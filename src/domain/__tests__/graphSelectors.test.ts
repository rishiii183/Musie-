import { describe, it, expect } from "vitest";
import {
  getNodeNeighbors,
  filterGraphNodes,
  calculateGraphStats,
} from "../graphSelectors";
import { sampleMusicGraph } from "../../data/sampleMusicGraph";

describe("graphSelectors", () => {
  it("retrieves neighbors and connected edges for a selected node", () => {
    const tameNeighbors = getNodeNeighbors(sampleMusicGraph, "artist-tame-impala");
    expect(tameNeighbors.neighborNodeIds.size).toBeGreaterThan(0);
    // Should connect to artist-beach-house
    expect(tameNeighbors.neighborNodeIds.has("artist-beach-house")).toBe(true);
    // Should connect to track-let-it-happen
    expect(tameNeighbors.neighborNodeIds.has("track-let-it-happen")).toBe(true);
    // Should have connected nodes
    expect(tameNeighbors.connectedNodes.length).toBe(tameNeighbors.neighborNodeIds.size);
    expect(tameNeighbors.connectedEdges.length).toBe(tameNeighbors.connectedEdgeIds.size);
  });

  it("returns empty set when no node is selected", () => {
    const emptyNeighbors = getNodeNeighbors(sampleMusicGraph, null);
    expect(emptyNeighbors.neighborNodeIds.size).toBe(0);
    expect(emptyNeighbors.connectedEdges).toEqual([]);
  });

  it("filters nodes by search query correctly", () => {
    const searchResults = filterGraphNodes(sampleMusicGraph, {
      searchQuery: "Kendrick",
      showArtists: true,
      showTracks: true,
      showGenres: true,
      showLabels: true,
    });
    expect(searchResults.some((n) => n.id === "artist-kendrick-lamar")).toBe(true);
  });

  it("filters nodes by type correctly", () => {
    const onlyGenres = filterGraphNodes(sampleMusicGraph, {
      searchQuery: "",
      showArtists: false,
      showTracks: false,
      showGenres: true,
      showLabels: true,
    });
    expect(onlyGenres.length).toBe(17);
    expect(onlyGenres.every((n) => n.type === "genre")).toBe(true);
  });

  it("calculates accurate graph statistics", () => {
    const stats = calculateGraphStats(sampleMusicGraph);
    expect(stats.genreCount).toBe(17);
    expect(stats.artistCount).toBe(16);
    expect(stats.trackCount).toBe(19);
    expect(stats.totalNodes).toBe(52);
    expect(stats.totalListeningCount).toBeGreaterThan(1000);
  });
});
