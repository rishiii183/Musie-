import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import type { MusicGraph, MusicNode } from "../../domain/musicGraph.types";
import { UniverseScene } from "./UniverseScene";
import { Loader2 } from "lucide-react";

interface MusicUniverseProps {
  graph: MusicGraph;
  filteredNodes: MusicNode[];
  selectedNodeId: string | null;
  hoveredNodeId: string | null;
  focusTarget: [number, number, number] | null;
  connectedEdgeIds: Set<string>;
  neighborNodeIds: Set<string>;
  showLabels: boolean;
  resetCameraTrigger: number;
  isLoading: boolean;
  error: string | null;
  onSelectNode: (nodeId: string | null) => void;
  onHoverNode: (nodeId: string | null) => void;
  onClearSelection: () => void;
}

export const MusicUniverse: React.FC<MusicUniverseProps> = ({
  graph,
  filteredNodes,
  selectedNodeId,
  hoveredNodeId,
  focusTarget,
  connectedEdgeIds,
  neighborNodeIds,
  showLabels,
  resetCameraTrigger,
  isLoading,
  error,
  onSelectNode,
  onHoverNode,
  onClearSelection,
}) => {
  if (error) {
    return (
      <div className="universe-error-container">
        <div className="universe-error-card">
          <p className="universe-error-title">Cosmic Anomaly Detected</p>
          <p className="universe-error-message">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="universe-canvas-container">
      {isLoading && (
        <div className="universe-loader-overlay">
          <Loader2 className="spinner-icon" size={36} />
          <p>Aligning celestial constellations...</p>
        </div>
      )}

      <Canvas
        camera={{ position: [0, 15, 52], fov: 50, near: 0.1, far: 1000 }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        dpr={[1, 2]}
        onPointerMissed={() => onClearSelection()}
      >
        <color attach="background" args={["#030712"]} />
        <Suspense fallback={null}>
          <UniverseScene
            graph={graph}
            filteredNodes={filteredNodes}
            selectedNodeId={selectedNodeId}
            hoveredNodeId={hoveredNodeId}
            focusTarget={focusTarget}
            connectedEdgeIds={connectedEdgeIds}
            neighborNodeIds={neighborNodeIds}
            showLabels={showLabels}
            resetCameraTrigger={resetCameraTrigger}
            onSelectNode={onSelectNode}
            onHoverNode={onHoverNode}
            onClearSelection={onClearSelection}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};
