import type {
  MusicGraph,
  MusicNode,
  MusicEdge,
  GraphValidationResult,
  MusicNodeType,
  MusicEdgeType,
} from "./musicGraph.types";

/**
 * Validates graph invariants according to docs/data-model.md and docs/tech.md:
 * - Node IDs are unique
 * - Edge IDs are unique
 * - Every edge endpoint exists
 * - No self-edges unless explicitly defined
 * - Data origin is always present
 * - Missing listening counts are unknown, not zero
 */
export function validateMusicGraph(graph: Partial<MusicGraph> | null | undefined): GraphValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!graph || typeof graph !== "object") {
    return {
      isValid: false,
      errors: ["Graph data is null, undefined, or not an object"],
      warnings: [],
      normalizedGraph: { nodes: [], edges: [] },
    };
  }

  const rawNodes = Array.isArray(graph.nodes) ? graph.nodes : [];
  const rawEdges = Array.isArray(graph.edges) ? graph.edges : [];

  const validNodes: MusicNode[] = [];
  const nodeMap = new Map<string, MusicNode>();
  const validNodeTypes = new Set<MusicNodeType>(["artist", "track", "genre"]);
  const validOrigins = new Set(["demo", "spotify", "derived"]);

  for (let i = 0; i < rawNodes.length; i++) {
    const node = rawNodes[i];
    if (!node || typeof node !== "object") {
      errors.push(`Node at index ${i} is not a valid object`);
      continue;
    }

    if (!node.id || typeof node.id !== "string") {
      errors.push(`Node at index ${i} is missing a valid 'id'`);
      continue;
    }

    if (nodeMap.has(node.id)) {
      errors.push(`Duplicate node ID found: "${node.id}"`);
      continue;
    }

    if (!validNodeTypes.has(node.type)) {
      errors.push(`Node "${node.id}" has invalid type "${String(node.type)}"`);
      continue;
    }

    if (!node.label || typeof node.label !== "string") {
      warnings.push(`Node "${node.id}" has missing or non-string label; using ID as label`);
    }

    const dataOrigin = validOrigins.has(node.dataOrigin) ? node.dataOrigin : "demo";
    if (!validOrigins.has(node.dataOrigin)) {
      warnings.push(`Node "${node.id}" missing or invalid dataOrigin; default to "demo"`);
    }

    let position: [number, number, number] | undefined = undefined;
    if (
      Array.isArray(node.position) &&
      node.position.length === 3 &&
      node.position.every((coord) => typeof coord === "number" && !isNaN(coord))
    ) {
      position = [node.position[0], node.position[1], node.position[2]];
    }

    const normalizedNode: MusicNode = {
      id: node.id,
      type: node.type,
      label: node.label || node.id,
      listeningCount:
        typeof node.listeningCount === "number" && !isNaN(node.listeningCount) && node.listeningCount >= 0
          ? node.listeningCount
          : undefined,
      imageUrl: typeof node.imageUrl === "string" ? node.imageUrl : undefined,
      externalUrl: typeof node.externalUrl === "string" ? node.externalUrl : undefined,
      metadata: node.metadata && typeof node.metadata === "object" ? { ...node.metadata } : undefined,
      position,
      color: typeof node.color === "string" ? node.color : undefined,
      dataOrigin,
    };

    validNodes.push(normalizedNode);
    nodeMap.set(normalizedNode.id, normalizedNode);
  }

  const validEdges: MusicEdge[] = [];
  const edgeIdSet = new Set<string>();
  const validEdgeTypes = new Set<MusicEdgeType>([
    "artist_track",
    "artist_genre",
    "related_artist",
    "track_genre",
  ]);

  for (let i = 0; i < rawEdges.length; i++) {
    const edge = rawEdges[i];
    if (!edge || typeof edge !== "object") {
      errors.push(`Edge at index ${i} is not a valid object`);
      continue;
    }

    if (!edge.id || typeof edge.id !== "string") {
      errors.push(`Edge at index ${i} is missing a valid 'id'`);
      continue;
    }

    if (edgeIdSet.has(edge.id)) {
      errors.push(`Duplicate edge ID found: "${edge.id}"`);
      continue;
    }

    if (!nodeMap.has(edge.source)) {
      errors.push(`Edge "${edge.id}" references non-existent source node "${edge.source}"`);
      continue;
    }

    if (!nodeMap.has(edge.target)) {
      errors.push(`Edge "${edge.id}" references non-existent target node "${edge.target}"`);
      continue;
    }

    if (edge.source === edge.target) {
      errors.push(`Edge "${edge.id}" is a self-edge from "${edge.source}" to "${edge.target}"`);
      continue;
    }

    if (!validEdgeTypes.has(edge.type)) {
      errors.push(`Edge "${edge.id}" has invalid type "${String(edge.type)}"`);
      continue;
    }

    const dataOrigin = validOrigins.has(edge.dataOrigin) ? edge.dataOrigin : "demo";

    validEdges.push({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: edge.type,
      confidence:
        typeof edge.confidence === "number" && !isNaN(edge.confidence)
          ? Math.max(0, Math.min(1, edge.confidence))
          : undefined,
      dataOrigin,
    });
    edgeIdSet.add(edge.id);
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
    normalizedGraph: {
      nodes: validNodes,
      edges: validEdges,
    },
  };
}

/**
 * Calculates a visually balanced 3D radius for a node using bounded square-root scaling.
 * Per tech.md: Avoid extreme size differences and dominating nodes.
 */
export function calculateNodeRadius(
  node: MusicNode,
  minRadius: number = 0.8,
  maxRadius: number = 2.4,
  maxActivityBaseline: number = 300
): number {
  const baseTypeRadius: Record<MusicNodeType, number> = {
    genre: 1.8,
    artist: 1.3,
    track: 0.9,
  };

  const base = baseTypeRadius[node.type] ?? 1.0;

  if (node.listeningCount === undefined || node.listeningCount === null) {
    return base;
  }

  // Non-linear sqrt scaling
  const normalizedActivity = Math.min(1, Math.max(0, node.listeningCount / maxActivityBaseline));
  const activityBoost = Math.sqrt(normalizedActivity) * (maxRadius - minRadius);

  return Math.max(minRadius, Math.min(maxRadius * 1.5, base + activityBoost * 0.7));
}
