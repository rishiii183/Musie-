import type { MusicGraph } from "../domain/musicGraph.types";

export interface SpotifyPlaylistMeta {
  id: string;
  name: string;
  description: string | null;
  externalUrl: string;
  imageUrl: string | null;
  totalTracks: number;
}

export interface SpotifyImportStats {
  tracksProcessed: number;
  tracksSkipped: number;
  artistsProcessed: number;
  genresAvailable: number;
  truncated: boolean;
}

export interface SpotifyImportResult {
  source: "spotify";
  playlist: SpotifyPlaylistMeta;
  stats: SpotifyImportStats;
  graph: MusicGraph;
  warnings: string[];
}

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

/**
 * Sends a Spotify playlist URL to the backend to generate a 3D galaxy.
 */
export async function importSpotifyPlaylist(url: string): Promise<SpotifyImportResult> {
  const endpoint = `${API_BASE}/api/playlists/import`;

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ url }),
    });
  } catch {
    throw new Error(
      "Unable to connect to the Musie API server. Please verify the backend is running on port 3001."
    );
  }

  let data: any;
  try {
    data = await response.json();
  } catch {
    throw new Error(`Server returned an invalid response (Status ${response.status}).`);
  }

  if (!response.ok) {
    const errorMsg = data?.error || `Import failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  if (!data?.graph || !Array.isArray(data.graph.nodes)) {
    throw new Error("Invalid graph format received from server.");
  }

  return data as SpotifyImportResult;
}

/**
 * Checks if the backend server and Spotify integration are active.
 */
export async function checkBackendHealth(): Promise<{ ok: boolean; spotifyConfigured: boolean }> {
  try {
    const res = await fetch(`${API_BASE}/api/health/spotify`);
    if (!res.ok) return { ok: false, spotifyConfigured: false };
    const json = await res.json();
    return { ok: true, spotifyConfigured: Boolean(json.spotifyConfigured) };
  } catch {
    return { ok: false, spotifyConfigured: false };
  }
}
