import React from "react";
import type { ThreeEvent } from "@react-three/fiber";
import type { MusicGraph, MusicNode as MusicNodeType } from "../../domain/musicGraph.types";
import { Starfield } from "./Starfield";
import { MusicConnections } from "./MusicConnections";
import { MusicNode } from "./MusicNode";
import { CameraController } from "./CameraController";

interface UniverseSceneProps {
  graph: MusicGraph;
  filteredNodes: MusicNodeType[];
  selectedNodeId: string | null;
  hoveredNodeId: string | null;
  focusTarget: [number, number, number] | null;
  connectedEdgeIds: Set<string>;
  neighborNodeIds: Set<string>;
  showLabels: boolean;
  resetCameraTrigger: number;
  onSelectNode: (nodeId: string | null) => void;
  onHoverNode: (nodeId: string | null) => void;
  onClearSelection: () => void;
}

export const UniverseScene: React.FC<UniverseSceneProps> = ({
  graph,
  filteredNodes,
  selectedNodeId,
  hoveredNodeId,
  focusTarget,
  connectedEdgeIds,
  neighborNodeIds,
  showLabels,
  resetCameraTrigger,
  onSelectNode,
  onHoverNode,
  onClearSelection,
}) => {
  const handleBackgroundClick = (e: ThreeEvent<MouseEvent>) => {
    // Only handle if clicking empty space directly
    if (e.target === e.currentTarget) {
      onClearSelection();
    }
  };

  return (
    <>
      {/* Balanced, non-expensive cosmic lighting */}
      <ambientLight intensity={0.65} color="#cbd5e1" />
      <directionalLight position={[30, 40, 20]} intensity={1.1} color="#e0e7ff" />
      <directionalLight position={[-30, -20, -30]} intensity={0.5} color="#c084fc" />

      {/* Deep Space Starfield */}
      <Starfield count={2200} />

      {/* Relationship Connections */}
      <MusicConnections
        edges={graph.edges}
        nodes={graph.nodes}
        selectedNodeId={selectedNodeId}
        connectedEdgeIds={connectedEdgeIds}
      />

      {/* Music Entity Nodes */}
      <group>
        {filteredNodes.map((node) => {
          const isSelected = node.id === selectedNodeId;
          const isNeighbor = neighborNodeIds.has(node.id);
          const isHovered = node.id === hoveredNodeId;
          const isDimmed =
            selectedNodeId !== null &&
            !isSelected &&
            !isNeighbor;

          return (
            <MusicNode
              key={node.id}
              node={node}
              isSelected={isSelected}
              isNeighbor={isNeighbor}
              isHovered={isHovered}
              isDimmed={isDimmed}
              showLabels={showLabels}
              onSelect={(id) => onSelectNode(id)}
              onHover={onHoverNode}
            />
          );
        })}
      </group>

      {/* Invisible clickable backdrop to catch clicks on empty space */}
      <mesh
        position={[0, 0, 0]}
        scale={[300, 300, 300]}
        onClick={handleBackgroundClick}
        visible={false}
      >
        <sphereGeometry args={[1, 16, 16]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {/* Smooth Orbit and lerping Camera Controller */}
      <CameraController
        focusTarget={focusTarget}
        resetTrigger={resetCameraTrigger}
      />
    </>
  );
};
