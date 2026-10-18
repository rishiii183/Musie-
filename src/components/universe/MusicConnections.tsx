import React, { useMemo } from "react";
import * as THREE from "three";
import type { MusicEdge, MusicNode } from "../../domain/musicGraph.types";

interface MusicConnectionsProps {
  edges: MusicEdge[];
  nodes: MusicNode[];
  selectedNodeId: string | null;
  connectedEdgeIds: Set<string>;
}

export const MusicConnections: React.FC<MusicConnectionsProps> = ({
  edges,
  nodes,
  selectedNodeId,
  connectedEdgeIds,
}) => {
  const nodeMap = useMemo(() => {
    return new Map<string, MusicNode>(nodes.map((n) => [n.id, n]));
  }, [nodes]);

  // Separate edges into active (connected to selected) and ambient
  const { ambientPositions, activePositions, activeColors } = useMemo(() => {
    const ambPos: number[] = [];
    const actPos: number[] = [];
    const actCol: number[] = [];

    const activeColorArtistTrack = new THREE.Color("#38bdf8"); // Sky cyan
    const activeColorArtistGenre = new THREE.Color("#c084fc"); // Celestial purple
    const activeColorRelated = new THREE.Color("#fbbf24");     // Radiant amber

    for (const edge of edges) {
      const srcNode = nodeMap.get(edge.source);
      const tgtNode = nodeMap.get(edge.target);

      if (!srcNode?.position || !tgtNode?.position) {
        continue;
      }

      const [x1, y1, z1] = srcNode.position;
      const [x2, y2, z2] = tgtNode.position;

      const isConnected = connectedEdgeIds.has(edge.id);

      if (isConnected) {
        actPos.push(x1, y1, z1, x2, y2, z2);

        let color = activeColorArtistTrack;
        if (edge.type === "artist_genre") {
          color = activeColorArtistGenre;
        } else if (edge.type === "related_artist") {
          color = activeColorRelated;
        }

        actCol.push(color.r, color.g, color.b, color.r, color.g, color.b);
      } else {
        ambPos.push(x1, y1, z1, x2, y2, z2);
      }
    }

    return {
      ambientPositions: new Float32Array(ambPos),
      activePositions: new Float32Array(actPos),
      activeColors: new Float32Array(actCol),
    };
  }, [edges, nodeMap, connectedEdgeIds]);

  const ambientOpacity = selectedNodeId ? 0.08 : 0.22;

  return (
    <group>
      {/* Ambient background constellation threads */}
      {ambientPositions.length > 0 && (
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[ambientPositions, 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial
            color="#475569"
            transparent
            opacity={ambientOpacity}
            depthWrite={false}
          />
        </lineSegments>
      )}

      {/* Selected / Connected highlighted threads */}
      {activePositions.length > 0 && (
        <lineSegments>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              args={[activePositions, 3]}
            />
            <bufferAttribute
              attach="attributes-color"
              args={[activeColors, 3]}
            />
          </bufferGeometry>
          <lineBasicMaterial
            vertexColors
            transparent
            opacity={0.92}
            linewidth={2}
            depthWrite={false}
          />
        </lineSegments>
      )}
    </group>
  );
};
