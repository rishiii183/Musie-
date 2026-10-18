import { useState, useEffect, useCallback } from "react";
import type { FilterOptions } from "./domain/musicGraph.types";
import { defaultDataProvider } from "./domain/musicDataProvider";
import type { MusicDataProvider } from "./domain/musicDataProvider";
import { SpotifyMusicDataProvider } from "./domain/spotifyDataProvider";
import { useMusicGraph } from "./hooks/useMusicGraph";
import { useUniverseSelection } from "./hooks/useUniverseSelection";
import { MusicUniverse } from "./components/universe/MusicUniverse";
import { AppHeader } from "./components/layout/AppHeader";
import { SearchBar } from "./components/layout/SearchBar";
import { TypeFilters } from "./components/layout/TypeFilters";
import { UniverseLegend } from "./components/layout/UniverseLegend";
import { UniverseControls } from "./components/layout/UniverseControls";
import { EntityDetailsPanel } from "./components/layout/EntityDetailsPanel";
import { PlaylistImportModal } from "./components/layout/PlaylistImportModal";
import { ActivePlaylistBanner } from "./components/layout/ActivePlaylistBanner";
import type { SpotifyImportResult } from "./services/spotifyImportApi";

export function App() {
  const [provider, setProvider] = useState<MusicDataProvider>(defaultDataProvider);
  const [activePlaylistData, setActivePlaylistData] = useState<SpotifyImportResult | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importModalUrl, setImportModalUrl] = useState<string>("");

  const handleOpenImport = useCallback((prefillUrl?: string) => {
    if (typeof prefillUrl === "string") {
      setImportModalUrl(prefillUrl);
    }
    setIsImportModalOpen(true);
  }, []);

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
  } = useMusicGraph(filters, provider);

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

  const handleImportSuccess = useCallback(
    (result: SpotifyImportResult) => {
      const spotifyProvider = new SpotifyMusicDataProvider(
        result.graph,
        result.playlist,
        result.stats,
        result.warnings
      );
      setProvider(spotifyProvider);
      setActivePlaylistData(result);
      clearSelection();
      resetCamera();
    },
    [clearSelection, resetCamera]
  );

  const handleResetToDemo = useCallback(() => {
    setProvider(defaultDataProvider);
    setActivePlaylistData(null);
    clearSelection();
    resetCamera();
  }, [clearSelection, resetCamera]);

  return (
    <main className="app-container">
      {/* 1. Header Bar with Brand, Controls & Import Trigger */}
      <AppHeader
        stats={stats}
        showLabels={filters.showLabels}
        isSpotifyMode={Boolean(activePlaylistData)}
        onToggleLabels={handleToggleLabels}
        onResetCamera={resetCamera}
        onOpenImport={() => handleOpenImport()}
      />

      {/* 2. Active Spotify Playlist Floating Banner (when in Spotify mode) */}
      {activePlaylistData && (
        <ActivePlaylistBanner
          playlist={activePlaylistData.playlist}
          stats={activePlaylistData.stats}
          warnings={activePlaylistData.warnings}
          onOpenImport={() => handleOpenImport()}
          onResetToDemo={handleResetToDemo}
        />
      )}

      {/* 3. Floating Top-Left Controls (Search & Type Filters) */}
      <section className="floating-top-controls" aria-label="Search and Filter Controls">
        <SearchBar
          nodes={graph.nodes}
          onSelectNode={(nodeId) => selectNode(nodeId, true)}
          onOpenImport={handleOpenImport}
        />
        <TypeFilters
          filters={filters}
          stats={stats}
          onFilterChange={setFilters}
        />
      </section>

      {/* 4. 3D WebGL Universe Canvas */}
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

      {/* 5. Collapsible Galaxy Legend (Bottom-Left) */}
      <UniverseLegend />

      {/* 6. Floating Action Controls & Hints (Bottom-Center) */}
      <UniverseControls
        hasSelection={selectedNodeId !== null}
        showLabels={filters.showLabels}
        onClearSelection={clearSelection}
        onResetCamera={resetCamera}
        onToggleLabels={handleToggleLabels}
      />

      {/* 7. Persistent Entity Details Panel (Right-Drawer) */}
      <EntityDetailsPanel
        node={selectedNode}
        neighbors={neighbors}
        onSelectNode={(nodeId) => selectNode(nodeId, true)}
        onClose={clearSelection}
      />

      {/* 8. Spotify Playlist Import Modal */}
      <PlaylistImportModal
        isOpen={isImportModalOpen}
        initialUrl={importModalUrl}
        onClose={() => setIsImportModalOpen(false)}
        onImportSuccess={handleImportSuccess}
      />
    </main>
  );
}

export default App;
