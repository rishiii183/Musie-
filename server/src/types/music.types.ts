export type MusicNodeType = "artist" | "track" | "genre";

export type DataOrigin = "demo" | "spotify" | "derived";

export interface MusicNode {
  id: string;
  type: MusicNodeType;
  label: string;
  listeningCount?: number;
  imageUrl?: string;
  externalUrl?: string;
  metadata?: Record<string, string | number | boolean | null>;
  position?: [number, number, number];
  color?: string;
  dataOrigin: DataOrigin;
}

export type MusicEdgeType =
  | "artist_track"
  | "artist_genre"
  | "related_artist"
  | "track_genre";

export interface MusicEdge {
  id: string;
  source: string;
  target: string;
  type: MusicEdgeType;
  confidence?: number;
  dataOrigin: DataOrigin;
}

export interface MusicGraph {
  nodes: MusicNode[];
  edges: MusicEdge[];
}

export interface SpotifyImage {
  url: string;
  height: number | null;
  width: number | null;
}

export interface SpotifyArtistSimple {
  id: string;
  name: string;
  external_urls?: {
    spotify?: string;
  };
}

export interface SpotifyAlbumSimple {
  id: string;
  name: string;
  release_date?: string;
  images?: SpotifyImage[];
  external_urls?: {
    spotify?: string;
  };
}

export interface SpotifyTrack {
  id: string;
  name: string;
  duration_ms?: number;
  preview_url?: string | null;
  external_urls?: {
    spotify?: string;
  };
  album?: SpotifyAlbumSimple;
  artists?: SpotifyArtistSimple[];
  is_local?: boolean;
}

export interface SpotifyPlaylistItem {
  track: SpotifyTrack | null;
  added_at?: string;
}

export interface SpotifyPlaylistMetadata {
  id: string;
  name: string;
  description: string | null;
  external_urls?: {
    spotify?: string;
  };
  images?: SpotifyImage[];
  tracks: {
    total: number;
    limit: number;
    offset: number;
    items?: SpotifyPlaylistItem[];
  };
}

export interface SpotifyPlaylistImportResponse {
  source: "spotify";
  playlist: {
    id: string;
    name: string;
    description: string | null;
    externalUrl: string;
    imageUrl: string | null;
    totalTracks: number;
  };
  stats: {
    tracksProcessed: number;
    tracksSkipped: number;
    artistsProcessed: number;
    genresAvailable: number;
    truncated: boolean;
  };
  graph: MusicGraph;
  warnings: string[];
}
