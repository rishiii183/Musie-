import type {
  MusicGraph,
  MusicNode,
  MusicEdge,
  GraphNeighborMap,
  GraphStats,
  FilterOptions,
  MusicNodeType,
} from "./musicGraph.types";

/**
 * Finds all direct neighbors and connected edges for a given node ID.
 */
export function getNodeNeighbors(graph: MusicGraph, nodeId: string | null): GraphNeighborMap {
  if (!nodeId) {
    return {
      neighborNodeIds: new Set<string>(),
      connectedEdgeIds: new Set<string>(),
      connectedNodes: [],
      connectedEdges: [],
    };
  }

  const neighborNodeIds = new Set<string>();
  const connectedEdgeIds = new Set<string>();
  const connectedEdges: MusicEdge[] = [];

  for (const edge of graph.edges) {
    if (edge.source === nodeId) {
      neighborNodeIds.add(edge.target);
      connectedEdgeIds.add(edge.id);
      connectedEdges.push(edge);
    } else if (edge.target === nodeId) {
      neighborNodeIds.add(edge.source);
      connectedEdgeIds.add(edge.id);
      connectedEdges.push(edge);
    }
  }

  const nodeMap = new Map<string, MusicNode>(graph.nodes.map((n) => [n.id, n]));
  const connectedNodes: MusicNode[] = [];
  for (const nId of neighborNodeIds) {
    const node = nodeMap.get(nId);
    if (node) {
      connectedNodes.push(node);
    }
  }

  return {
    neighborNodeIds,
    connectedEdgeIds,
    connectedNodes,
    connectedEdges,
  };
}

/**
 * Filters the graph according to search query and type checkboxes.
 */
export function filterGraphNodes(graph: MusicGraph, filters: FilterOptions): MusicNode[] {
  const query = filters.searchQuery.trim().toLowerCase();

  return graph.nodes.filter((node) => {
    // Type check
    if (node.type === "artist" && !filters.showArtists) return false;
    if (node.type === "track" && !filters.showTracks) return false;
    if (node.type === "genre" && !filters.showGenres) return false;

    // Search query check
    if (query.length > 0) {
      const matchLabel = node.label.toLowerCase().includes(query);
      const matchType = node.type.toLowerCase().includes(query);
      let matchMetadata = false;
      if (node.metadata) {
        matchMetadata = Object.values(node.metadata).some((val) =>
          String(val).toLowerCase().includes(query)
        );
      }
      return matchLabel || matchType || matchMetadata;
    }

    return true;
  });
}

/**
 * Computes high-level statistics for the graph.
 */
export function calculateGraphStats(graph: MusicGraph): GraphStats {
  let artistCount = 0;
  let trackCount = 0;
  let genreCount = 0;
  let totalListeningCount = 0;
  let hasUnknownMetrics = false;

  for (const node of graph.nodes) {
    if (node.type === "artist") artistCount++;
    if (node.type === "track") trackCount++;
    if (node.type === "genre") genreCount++;

    if (node.listeningCount !== undefined && node.listeningCount !== null) {
      totalListeningCount += node.listeningCount;
    } else {
      hasUnknownMetrics = true;
    }
  }

  return {
    totalNodes: graph.nodes.length,
    totalEdges: graph.edges.length,
    artistCount,
    trackCount,
    genreCount,
    totalListeningCount,
    hasUnknownMetrics,
  };
}

/**
 * Visual styling tokens and colors per node type.
 */
export const NODE_TYPE_THEMES: Record<
  MusicNodeType,
  {
    primary: string;
    glow: string;
    label: string;
    badgeBg: string;
    border: string;
  }
> = {
  genre: {
    primary: "#a855f7", // Celestial Violet / Purple
    glow: "rgba(168, 85, 247, 0.45)",
    label: "Genre",
    badgeBg: "rgba(168, 85, 247, 0.15)",
    border: "#c084fc",
  },
  artist: {
    primary: "#06b6d4", // Electric Cyan / Ocean
    glow: "rgba(6, 182, 212, 0.45)",
    label: "Artist",
    badgeBg: "rgba(6, 182, 212, 0.15)",
    border: "#22d3ee",
  },
  track: {
    primary: "#f59e0b", // Radiant Gold / Amber
    glow: "rgba(245, 158, 11, 0.45)",
    label: "Track",
    badgeBg: "rgba(245, 158, 11, 0.15)",
    border: "#fbbf24",
  },
};
