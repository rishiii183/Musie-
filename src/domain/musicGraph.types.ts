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

export interface GraphValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  normalizedGraph: MusicGraph;
}

export interface GraphNeighborMap {
  neighborNodeIds: Set<string>;
  connectedEdgeIds: Set<string>;
  connectedNodes: MusicNode[];
  connectedEdges: MusicEdge[];
}

export interface GraphStats {
  totalNodes: number;
  totalEdges: number;
  artistCount: number;
  trackCount: number;
  genreCount: number;
  totalListeningCount: number;
  hasUnknownMetrics: boolean;
}

export interface UniverseSelectionState {
  selectedNodeId: string | null;
  hoveredNodeId: string | null;
  focusedNodeId: string | null;
}

export interface FilterOptions {
  searchQuery: string;
  showArtists: boolean;
  showTracks: boolean;
  showGenres: boolean;
  showLabels: boolean;
}
