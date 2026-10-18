import { useState, useMemo, useCallback } from "react";
import type { MusicGraph, MusicNode } from "../domain/musicGraph.types";
import { getNodeNeighbors } from "../domain/graphSelectors";

export function useUniverseSelection(graph: MusicGraph) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
  const [focusTarget, setFocusTarget] = useState<[number, number, number] | null>(null);
  const [resetCameraTrigger, setResetCameraTrigger] = useState<number>(0);

  const nodeMap = useMemo(() => {
    return new Map<string, MusicNode>(graph.nodes.map((n) => [n.id, n]));
  }, [graph.nodes]);

  const selectedNode = useMemo(() => {
    return selectedNodeId ? nodeMap.get(selectedNodeId) ?? null : null;
  }, [selectedNodeId, nodeMap]);

  const hoveredNode = useMemo(() => {
    return hoveredNodeId ? nodeMap.get(hoveredNodeId) ?? null : null;
  }, [hoveredNodeId, nodeMap]);

  const neighbors = useMemo(() => {
    return getNodeNeighbors(graph, selectedNodeId);
  }, [graph, selectedNodeId]);

  const selectNode = useCallback(
    (nodeId: string | null, shouldFocus: boolean = true) => {
      setSelectedNodeId(nodeId);
      if (nodeId && shouldFocus) {
        const node = nodeMap.get(nodeId);
        if (node?.position) {
          setFocusTarget(node.position);
        }
      } else if (!nodeId) {
        setFocusTarget(null);
      }
    },
    [nodeMap]
  );

  const clearSelection = useCallback(() => {
    setSelectedNodeId(null);
  }, []);

  const resetCamera = useCallback(() => {
    setResetCameraTrigger((prev) => prev + 1);
    setFocusTarget(null);
  }, []);

  return {
    selectedNodeId,
    selectedNode,
    hoveredNodeId,
    hoveredNode,
    setHoveredNodeId,
    focusTarget,
    neighbors,
    selectNode,
    clearSelection,
    resetCamera,
    resetCameraTrigger,
  };
}
