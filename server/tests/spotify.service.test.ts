import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  SpotifyService,
  SpotifyConfigError,
  SpotifyNotFoundError,
  SpotifyRateLimitError,
} from "../src/services/spotify.service.js";

describe("SpotifyService Client Credentials & API", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("throws SpotifyConfigError when credentials are not configured", async () => {
    const unconfigured = new SpotifyService("", "");
    expect(unconfigured.isConfigured()).toBe(false);
    await expect(unconfigured.getAccessToken()).rejects.toThrow(SpotifyConfigError);
  });

  it("obtains and caches access token using Client Credentials flow", async () => {
    const mockToken = "mock_spotify_token_123";
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        access_token: mockToken,
        token_type: "Bearer",
        expires_in: 3600,
      }),
    });
    global.fetch = fetchMock as any;

    const service = new SpotifyService("client_id", "client_secret");
    const token1 = await service.getAccessToken();
    const token2 = await service.getAccessToken();

    expect(token1).toBe(mockToken);
    expect(token2).toBe(mockToken);
    // Cached: fetch called only once
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("handles 404 Playlist Not Found", async () => {
    const service = new SpotifyService("client_id", "client_secret");

    global.fetch = vi
      .fn()
      // 1. Token response
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ access_token: "token", expires_in: 3600 }),
      })
      // 2. Playlist 404
      .mockResolvedValueOnce({
        ok: false,
        status: 404,
      });

    await expect(service.getPlaylist("non_existent_id")).rejects.toThrow(
      SpotifyNotFoundError
    );
  });

  it("handles 429 Rate Limit and parses Retry-After header", async () => {
    const service = new SpotifyService("client_id", "client_secret");

    global.fetch = vi
      .fn()
      // Token response
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ access_token: "token", expires_in: 3600 }),
      })
      // Playlist 429
      .mockResolvedValueOnce({
        ok: false,
        status: 429,
        headers: new Headers({ "Retry-After": "15" }),
      });

    try {
      await service.getPlaylist("rate_limited_id");
      expect.fail("Should have thrown rate limit error");
    } catch (err: any) {
      expect(err).toBeInstanceOf(SpotifyRateLimitError);
      expect(err.retryAfterSeconds).toBe(15);
      expect(err.statusCode).toBe(429);
    }
  });

  it("re-authenticates once on 401 Unauthorized response", async () => {
    const service = new SpotifyService("client_id", "client_secret");

    global.fetch = vi
      .fn()
      // First token call
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ access_token: "old_token", expires_in: 3600 }),
      })
      // First playlist call -> 401
      .mockResolvedValueOnce({
        ok: false,
        status: 401,
      })
      // Renew token call
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({ access_token: "new_token", expires_in: 3600 }),
      })
      // Second playlist call -> 200 Success
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: async () => ({
          id: "test_playlist",
          name: "Test Playlist",
          tracks: { total: 0, items: [] },
        }),
      });

    const playlist = await service.getPlaylist("test_playlist");
    expect(playlist.id).toBe("test_playlist");
    expect(global.fetch).toHaveBeenCalledTimes(4);
  });

  it("fetches public playlist metadata via embed endpoint when unconfigured", async () => {
    const unconfigured = new SpotifyService("", "");
    expect(unconfigured.isConfigured()).toBe(false);

    const mockEmbedHtml = `
      <html>
        <head>
          <script id="__NEXT_DATA__" type="application/json">
            {
              "props": {
                "pageProps": {
                  "state": {
                    "data": {
                      "entity": {
                        "id": "embed_playlist_1",
                        "title": "Public Chill Hits",
                        "subtitle": "Relaxing music",
                        "coverArt": { "sources": [{ "url": "https://img.com/cover.jpg" }] },
                        "trackList": [
                          {
                            "uri": "spotify:track:track_embed_1",
                            "title": "Cosmic Drift",
                            "subtitle": "Star Artist, Echo Co-Artist",
                            "duration": 210000
                          }
                        ]
                      }
                    }
                  }
                }
              }
            }
          </script>
        </head>
      </html>
    `;

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: async () => mockEmbedHtml,
    });

    const playlist = await unconfigured.getPlaylist("embed_playlist_1");
    expect(playlist.id).toBe("embed_playlist_1");
    expect(playlist.name).toBe("Public Chill Hits");
    expect(playlist.tracks.items?.length).toBe(1);

    const track = playlist.tracks.items?.[0]?.track;
    expect(track?.id).toBe("track_embed_1");
    expect(track?.name).toBe("Cosmic Drift");
    expect(track?.artists?.length).toBe(2);
    expect(track?.artists?.[0].name).toBe("Star Artist");
    expect(track?.artists?.[1].name).toBe("Echo Co-Artist");
  });
});
