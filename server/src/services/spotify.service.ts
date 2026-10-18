import { env } from "../config/env.js";
import type {
  SpotifyPlaylistMetadata,
  SpotifyPlaylistItem,
} from "../types/music.types.js";

export class SpotifyError extends Error {
  statusCode: number;
  retryAfterSeconds?: number;

  constructor(message: string, statusCode = 500, retryAfterSeconds?: number) {
    super(message);
    this.name = "SpotifyError";
    this.statusCode = statusCode;
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

export class SpotifyConfigError extends SpotifyError {
  constructor(message = "Spotify API credentials are not configured on the server.") {
    super(message, 503);
    this.name = "SpotifyConfigError";
  }
}

export class SpotifyNotFoundError extends SpotifyError {
  constructor(message = "Spotify playlist not found or is private. Please verify the link.") {
    super(message, 404);
    this.name = "SpotifyNotFoundError";
  }
}

export class SpotifyRateLimitError extends SpotifyError {
  constructor(retryAfterSeconds = 10) {
    super(`Spotify API rate limit reached. Please retry in ${retryAfterSeconds}s.`, 429, retryAfterSeconds);
    this.name = "SpotifyRateLimitError";
  }
}

export class SpotifyAuthError extends SpotifyError {
  constructor(message = "Spotify authorization failed. Please check your credentials.") {
    super(message, 401);
    this.name = "SpotifyAuthError";
  }
}

interface CachedToken {
  accessToken: string;
  expiresAt: number;
}

export class SpotifyService {
  private clientId: string;
  private clientSecret: string;
  private tokenCache: CachedToken | null = null;
  private tokenPromise: Promise<string> | null = null;

  constructor(clientId?: string, clientSecret?: string) {
    this.clientId = (clientId ?? env.SPOTIFY_CLIENT_ID).trim();
    this.clientSecret = (clientSecret ?? env.SPOTIFY_CLIENT_SECRET).trim();
  }

  isConfigured(): boolean {
    return this.clientId.length > 0 && this.clientSecret.length > 0;
  }

  /**
   * Retrieves an application token using the Client Credentials Flow.
   * Caches in memory with safe renewal buffer.
   */
  async getAccessToken(forceRefresh = false): Promise<string> {
    if (!this.isConfigured()) {
      throw new SpotifyConfigError(
        "Spotify API credentials are not configured on the server. Please set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in server/.env."
      );
    }

    const now = Date.now();
    if (!forceRefresh && this.tokenCache && this.tokenCache.expiresAt > now + 60000) {
      return this.tokenCache.accessToken;
    }

    if (this.tokenPromise) {
      return this.tokenPromise;
    }

    this.tokenPromise = (async () => {
      try {
        const authHeader = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString("base64");

        const response = await fetch("https://accounts.spotify.com/api/token", {
          method: "POST",
          headers: {
            Authorization: `Basic ${authHeader}`,
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({ grant_type: "client_credentials" }),
        });

        if (!response.ok) {
          const status = response.status;
          if (status === 400 || status === 401) {
            throw new SpotifyAuthError(
              "Failed to authenticate with Spotify API. Please verify SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET."
            );
          }
          if (status === 429) {
            const retryAfter = Number(response.headers.get("Retry-After")) || 5;
            throw new SpotifyRateLimitError(retryAfter);
          }
          throw new SpotifyError(`Spotify token endpoint returned status ${status}.`, status);
        }

        const data = (await response.json()) as { access_token: string; expires_in: number };
        this.tokenCache = {
          accessToken: data.access_token,
          expiresAt: Date.now() + (data.expires_in - 30) * 1000,
        };
        return this.tokenCache.accessToken;
      } finally {
        this.tokenPromise = null;
      }
    })();

    return this.tokenPromise;
  }

  /**
   * Safe fetch with automatic token renewal and rate-limit handling.
   */
  private async fetchSpotify(url: string, attempt = 1): Promise<Response> {
    const token = await this.getAccessToken();

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    });

    if (response.status === 401 && attempt === 1) {
      // Token may have expired or been revoked server-side; force refresh once
      this.tokenCache = null;
      return this.fetchSpotify(url, 2);
    }

    if (response.status === 429) {
      const retryAfter = Number(response.headers.get("Retry-After")) || 5;
      throw new SpotifyRateLimitError(retryAfter);
    }

    if (response.status === 404) {
      throw new SpotifyNotFoundError();
    }

    if (response.status === 403) {
      throw new SpotifyError(
        "Spotify API returned 403 Forbidden. The playlist may be restricted or private.",
        403
      );
    }

    if (!response.ok) {
      throw new SpotifyError(
        `Spotify API request failed with status ${response.status}.`,
        response.status
      );
    }

    return response;
  }

  /**
   * Fetches public playlist metadata and track list directly via Spotify's public embed endpoint.
   * Enables 100% keyless playlist import for users without Spotify Developer/Premium credentials.
   */
  async fetchPlaylistFromEmbed(playlistId: string): Promise<SpotifyPlaylistMetadata> {
    const embedUrl = `https://open.spotify.com/embed/playlist/${encodeURIComponent(playlistId)}`;
    const res = await fetch(embedUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml,application/xml",
      },
    });

    if (res.status === 404) {
      throw new SpotifyNotFoundError("Spotify playlist not found or is private. Please ensure the playlist is public.");
    }

    if (!res.ok) {
      throw new SpotifyError(`Failed to fetch public playlist (Status ${res.status}).`, res.status);
    }

    const html = await res.text();
    const match = html.match(/<script id="__NEXT_DATA__"[^>]*>(.*?)<\/script>/s);

    if (!match || !match[1]) {
      throw new SpotifyError("Could not parse Spotify playlist data. The playlist may be private or restricted.", 502);
    }

    let json: any;
    try {
      json = JSON.parse(match[1]);
    } catch {
      throw new SpotifyError("Invalid data received from Spotify embed service.", 502);
    }

    const entity = json?.props?.pageProps?.state?.data?.entity;
    if (!entity) {
      throw new SpotifyNotFoundError("Playlist entity not found. Please verify the playlist link.");
    }

    const trackList = Array.isArray(entity.trackList) ? entity.trackList : [];
    const coverArtSources = entity.coverArt?.sources || [];

    const items: SpotifyPlaylistItem[] = trackList.map((t: any, idx: number) => {
      const trackId = t.uri ? t.uri.replace("spotify:track:", "") : `track_${idx}`;
      const rawArtists = (t.subtitle || "Unknown Artist")
        .split(/,\s*|\s*&\s*/)
        .map((s: string) => s.trim())
        .filter(Boolean);

      const artists = rawArtists.map((name: string) => ({
        id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "artist",
        name,
        external_urls: { spotify: `https://open.spotify.com/search/${encodeURIComponent(name)}` },
      }));

      return {
        track: {
          id: trackId,
          name: t.title || "Untitled Track",
          duration_ms: t.duration || 0,
          preview_url: t.audioPreview?.url || null,
          external_urls: {
            spotify: `https://open.spotify.com/track/${trackId}`,
          },
          album: {
            id: entity.id || playlistId,
            name: entity.title || "Playlist Collection",
            images: coverArtSources,
          },
          artists,
        },
      };
    });

    return {
      id: entity.id || playlistId,
      name: entity.title || entity.name || "Imported Playlist",
      description: entity.subtitle || null,
      external_urls: {
        spotify: `https://open.spotify.com/playlist/${playlistId}`,
      },
      images: coverArtSources.map((s: any) => ({
        url: s.url,
        height: s.height || null,
        width: s.width || null,
      })),
      tracks: {
        total: items.length,
        limit: items.length,
        offset: 0,
        items,
      },
    };
  }

  /**
   * Fetches playlist metadata along with the initial batch of tracks.
   * If official Web API credentials are not configured or fail auth, smoothly falls back to public embed fetching.
   */
  async getPlaylist(playlistId: string): Promise<SpotifyPlaylistMetadata> {
    if (this.isConfigured()) {
      try {
        const url = `https://api.spotify.com/v1/playlists/${encodeURIComponent(
          playlistId
        )}?fields=id,name,description,images,external_urls,tracks(total,limit,offset,items(track(id,name,duration_ms,preview_url,external_urls,album(id,name,images,release_date),artists(id,name,external_urls))))`;

        const res = await this.fetchSpotify(url);
        const data = (await res.json()) as SpotifyPlaylistMetadata;
        return data;
      } catch (err) {
        if (err instanceof SpotifyAuthError || (err instanceof SpotifyError && err.statusCode === 403)) {
          return this.fetchPlaylistFromEmbed(playlistId);
        }
        throw err;
      }
    }

    return this.fetchPlaylistFromEmbed(playlistId);
  }

  /**
   * Fetches a paginated page of playlist tracks.
   */
  async getPlaylistTracksPage(
    playlistId: string,
    offset: number,
    limit = 50
  ): Promise<{ items: SpotifyPlaylistItem[]; total: number }> {
    if (!this.isConfigured()) {
      return { items: [], total: 0 };
    }

    try {
      const url = `https://api.spotify.com/v1/playlists/${encodeURIComponent(
        playlistId
      )}/tracks?offset=${offset}&limit=${limit}&fields=total,limit,offset,items(track(id,name,duration_ms,preview_url,external_urls,album(id,name,images,release_date),artists(id,name,external_urls)))`;

      const res = await this.fetchSpotify(url);
      const data = (await res.json()) as { items?: SpotifyPlaylistItem[]; total: number };
      return {
        items: data.items ?? [],
        total: data.total ?? 0,
      };
    } catch {
      return { items: [], total: 0 };
    }
  }

  /**
   * Attempts to batch-fetch artist details (up to 50 at a time) to discover genres.
   * If this fails or is unsupported, returns an empty map without aborting.
   */
  async getArtistGenres(artistIds: string[]): Promise<Map<string, string[]>> {
    const genreMap = new Map<string, string[]>();
    if (artistIds.length === 0) return genreMap;

    // Spotify limits artist batch endpoint to 50 IDs per call
    const uniqueIds = Array.from(new Set(artistIds)).slice(0, 50);

    try {
      const url = `https://api.spotify.com/v1/artists?ids=${uniqueIds.map((id) => encodeURIComponent(id)).join(",")}`;
      const res = await this.fetchSpotify(url);
      const data = (await res.json()) as { artists?: Array<{ id: string; genres?: string[] }> };

      if (data.artists) {
        for (const artist of data.artists) {
          if (artist.id && Array.isArray(artist.genres)) {
            genreMap.set(artist.id, artist.genres);
          }
        }
      }
    } catch {
      // Graceful fallback: genre discovery is an optional enhancement
    }

    return genreMap;
  }
}

export const defaultSpotifyService = new SpotifyService();
