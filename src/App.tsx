import { useState, useEffect, useCallback } from "react";
import type { FilterOptions } from "./domain/musicGraph.types";
import { useMusicGraph } from "./hooks/useMusicGraph";
import { useUniverseSelection } from "./hooks/useUniverseSelection";
import { MusicUniverse } from "./components/universe/MusicUniverse";
import { AppHeader } from "./components/layout/AppHeader";
import { SearchBar } from "./components/layout/SearchBar";
import { TypeFilters } from "./components/layout/TypeFilters";
import { UniverseLegend } from "./components/layout/UniverseLegend";
import { UniverseControls } from "./components/layout/UniverseControls";
import { EntityDetailsPanel } from "./components/layout/EntityDetailsPanel";

export function App() {
  const [filters, setFilters] = useState<FilterOptions>({
    searchQuery: "",
    showArtists: true,
    showTracks: true,
    showGenres: true,
    showLabels: true,
  });

  const {
    graph,
    filteredNodes,
    stats,
    isLoading,
    error,
  } = useMusicGraph(filters);

  const {
    selectedNodeId,
    selectedNode,
    hoveredNodeId,
    setHoveredNodeId,
    focusTarget,
    neighbors,
    selectNode,
    clearSelection,
    resetCamera,
    resetCameraTrigger,
  } = useUniverseSelection(graph);

  // Global key bindings: Escape clears selection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        clearSelection();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [clearSelection]);

  const handleToggleLabels = useCallback(() => {
    setFilters((prev) => ({ ...prev, showLabels: !prev.showLabels }));
  }, []);

  return (
    <main className="app-container">
      {/* 1. Header Bar with Brand, Provenance & Stats */}
      <AppHeader
        stats={stats}
        showLabels={filters.showLabels}
        onToggleLabels={handleToggleLabels}
        onResetCamera={resetCamera}
      />

      {/* 2. Floating Top-Left Controls (Search & Type Filters) */}
      <section className="floating-top-controls" aria-label="Search and Filter Controls">
        <SearchBar
          nodes={graph.nodes}
          onSelectNode={(nodeId) => selectNode(nodeId, true)}
        />
        <TypeFilters
          filters={filters}
          stats={stats}
          onFilterChange={setFilters}
        />
      </section>

      {/* 3. 3D WebGL Universe Canvas */}
      <MusicUniverse
        graph={graph}
        filteredNodes={filteredNodes}
        selectedNodeId={selectedNodeId}
        hoveredNodeId={hoveredNodeId}
        focusTarget={focusTarget}
        connectedEdgeIds={neighbors.connectedEdgeIds}
        neighborNodeIds={neighbors.neighborNodeIds}
        showLabels={filters.showLabels}
        resetCameraTrigger={resetCameraTrigger}
        isLoading={isLoading}
        error={error}
        onSelectNode={(nodeId) => selectNode(nodeId, true)}
        onHoverNode={setHoveredNodeId}
        onClearSelection={clearSelection}
      />

      {/* 4. Collapsible Galaxy Legend (Bottom-Left) */}
      <UniverseLegend />

      {/* 5. Floating Action Controls & Hints (Bottom-Center) */}
      <UniverseControls
        hasSelection={selectedNodeId !== null}
        showLabels={filters.showLabels}
        onClearSelection={clearSelection}
        onResetCamera={resetCamera}
        onToggleLabels={handleToggleLabels}
      />

      {/* 6. Persistent Entity Details Panel (Right-Drawer) */}
      <EntityDetailsPanel
        node={selectedNode}
        neighbors={neighbors}
        onSelectNode={(nodeId) => selectNode(nodeId, true)}
        onClose={clearSelection}
      />
    </main>
  );
}

export default App;
