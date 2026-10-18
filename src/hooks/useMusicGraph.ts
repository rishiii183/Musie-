import { useState, useEffect, useMemo } from "react";
import type {
  MusicGraph,
  FilterOptions,
  GraphStats,
  MusicNode,
} from "../domain/musicGraph.types";
import { defaultDataProvider } from "../domain/musicDataProvider";
import type { MusicDataProvider } from "../domain/musicDataProvider";
import {
  filterGraphNodes,
  calculateGraphStats,
} from "../domain/graphSelectors";

export function useMusicGraph(
  filters: FilterOptions,
  provider: MusicDataProvider = defaultDataProvider
) {
  const [graph, setGraph] = useState<MusicGraph>({ nodes: [], edges: [] });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    provider
      .getMusicGraph()
      .then((data) => {
        if (isMounted) {
          setGraph(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load music graph");
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [provider]);

  const filteredNodes: MusicNode[] = useMemo(() => {
    return filterGraphNodes(graph, filters);
  }, [graph, filters]);

  const filteredNodeIds: Set<string> = useMemo(() => {
    return new Set(filteredNodes.map((n) => n.id));
  }, [filteredNodes]);

  const stats: GraphStats = useMemo(() => {
    return calculateGraphStats(graph);
  }, [graph]);

  return {
    graph,
    filteredNodes,
    filteredNodeIds,
    stats,
    isLoading,
    error,
  };
}
