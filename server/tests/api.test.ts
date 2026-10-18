import { describe, it, expect, vi, beforeEach } from "vitest";
import { app } from "../src/app.js";
import { defaultPlaylistImportService } from "../src/services/playlist-import.service.js";
import type { SpotifyPlaylistImportResponse } from "../src/types/music.types.js";

// Helper to make requests directly to Express app via Node http or native fetch with listening server
import http from "http";

describe("Musie Backend API Endpoints", () => {
  let server: http.Server;
  let baseUrl: string;

  beforeEach(async () => {
    await new Promise<void>((resolve) => {
      server = http.createServer(app).listen(0, "127.0.0.1", () => {
        const addr = server.address() as { port: number };
        baseUrl = `http://127.0.0.1:${addr.port}`;
        resolve();
      });
    });

    return () => {
      server.close();
    };
  });

  it("GET /api/health returns health status", async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toEqual({ status: "ok", service: "musie-api" });
  });

  it("GET /api/health/spotify returns configuration flag", async () => {
    const res = await fetch(`${baseUrl}/api/health/spotify`);
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.status).toBe("ok");
    expect(typeof body.spotifyConfigured).toBe("boolean");
  });

  it("POST /api/playlists/import rejects missing url", async () => {
    const res = await fetch(`${baseUrl}/api/playlists/import`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toBeDefined();
  });

  it("POST /api/playlists/import rejects non-playlist Spotify URLs", async () => {
    const res = await fetch(`${baseUrl}/api/playlists/import`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: "https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT" }),
    });

    expect(res.status).toBe(400);
    const body = await res.json();
    expect(body.error).toContain("This is a Spotify track link");
  });

  it("POST /api/playlists/import returns graph for valid playlist", async () => {
    const mockResponse: SpotifyPlaylistImportResponse = {
      source: "spotify",
      playlist: {
        id: "37i9dQZF1DXcBWIGoYBM5M",
        name: "Today's Top Hits",
        description: "The hottest tracks",
        externalUrl: "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M",
        imageUrl: "https://image.com/cover.jpg",
        totalTracks: 50,
      },
      stats: {
        tracksProcessed: 50,
        tracksSkipped: 0,
        artistsProcessed: 25,
        genresAvailable: 4,
        truncated: false,
      },
      graph: {
        nodes: [
          {
            id: "spotify:artist:1",
            type: "artist",
            label: "Dua Lipa",
            position: [0, 0, 0],
            dataOrigin: "spotify",
          },
        ],
        edges: [],
      },
      warnings: [],
    };

    vi.spyOn(defaultPlaylistImportService, "importPlaylist").mockResolvedValueOnce(mockResponse);

    const res = await fetch(`${baseUrl}/api/playlists/import`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M" }),
    });

    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body.source).toBe("spotify");
    expect(body.playlist.name).toBe("Today's Top Hits");
    expect(body.graph.nodes.length).toBe(1);
  });
});
