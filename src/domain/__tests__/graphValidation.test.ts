import { describe, it, expect } from "vitest";
import { validateMusicGraph, calculateNodeRadius } from "../graphValidation";
import { sampleMusicGraph } from "../../data/sampleMusicGraph";
import type { MusicGraph, MusicNode } from "../musicGraph.types";

describe("graphValidation", () => {
  it("validates the production sampleMusicGraph without errors", () => {
    const result = validateMusicGraph(sampleMusicGraph);
    expect(result.isValid).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.normalizedGraph.nodes.length).toBeGreaterThanOrEqual(50); // 7 + 15 + 36 = 58
    expect(result.normalizedGraph.edges.length).toBeGreaterThanOrEqual(50);
  });

  it("ensures all edge endpoints point to valid existing nodes", () => {
    const nodeIds = new Set(sampleMusicGraph.nodes.map((n) => n.id));
    for (const edge of sampleMusicGraph.edges) {
      expect(nodeIds.has(edge.source)).toBe(true);
      expect(nodeIds.has(edge.target)).toBe(true);
      expect(edge.source).not.toBe(edge.target);
    }
  });

  it("catches duplicate node IDs", () => {
    const testGraph: MusicGraph = {
      nodes: [
        { id: "node-1", type: "artist", label: "Artist 1", dataOrigin: "demo" },
        { id: "node-1", type: "track", label: "Track 1", dataOrigin: "demo" },
      ],
      edges: [],
    };
    const result = validateMusicGraph(testGraph);
    expect(result.isValid).toBe(false);
    expect(result.errors.some((e) => e.includes("Duplicate node ID"))).toBe(true);
  });

  it("catches dangling edge references", () => {
    const testGraph: MusicGraph = {
      nodes: [
        { id: "node-1", type: "artist", label: "Artist 1", dataOrigin: "demo" },
      ],
      edges: [
        {
          id: "edge-1",
          source: "node-1",
          target: "non-existent-node",
          type: "artist_track",
          dataOrigin: "demo",
        },
      ],
    };
    const result = validateMusicGraph(testGraph);
    expect(result.isValid).toBe(false);
    expect(result.errors.some((e) => e.includes("non-existent target node"))).toBe(true);
  });

  it("handles null or empty graphs gracefully without crashing", () => {
    const nullResult = validateMusicGraph(null);
    expect(nullResult.isValid).toBe(false);
    expect(nullResult.normalizedGraph.nodes).toEqual([]);

    const emptyResult = validateMusicGraph({ nodes: [], edges: [] });
    expect(emptyResult.isValid).toBe(true);
    expect(emptyResult.errors).toEqual([]);
  });

  it("calculates bounded node radius using non-linear scaling", () => {
    const genreNode: MusicNode = {
      id: "g1",
      type: "genre",
      label: "Pop",
      listeningCount: 500,
      dataOrigin: "demo",
    };
    const trackNode: MusicNode = {
      id: "t1",
      type: "track",
      label: "Song",
      listeningCount: 10,
      dataOrigin: "demo",
    };
    const unmeasuredNode: MusicNode = {
      id: "u1",
      type: "artist",
      label: "Unknown",
      dataOrigin: "demo",
    };

    const genreR = calculateNodeRadius(genreNode);
    const trackR = calculateNodeRadius(trackNode);
    const unmeasuredR = calculateNodeRadius(unmeasuredNode);

    expect(genreR).toBeGreaterThan(trackR);
    expect(unmeasuredR).toBeGreaterThan(0.5);
    expect(genreR).toBeLessThanOrEqual(4.0); // Bounded
  });
});
