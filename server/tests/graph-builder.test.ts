import { describe, it, expect } from "vitest";
import { buildMusicGraphFromSpotify, formatTrackDuration } from "../src/services/graph-builder.service.js";
import type { SpotifyTrack } from "../src/types/music.types.js";

describe("Graph Builder Service", () => {
  const sampleTracks: SpotifyTrack[] = [
    {
      id: "track-1",
      name: "HUMBLE.",
      duration_ms: 177000,
      album: {
        id: "album-1",
        name: "DAMN.",
        release_date: "2017-04-14",
        images: [{ url: "https://i.scdn.co/image/damn.jpg", height: 300, width: 300 }],
      },
      artists: [{ id: "artist-kendrick", name: "Kendrick Lamar" }],
    },
    {
      id: "track-2",
      name: "All The Stars",
      duration_ms: 232000,
      album: {
        id: "album-2",
        name: "Black Panther The Album",
        release_date: "2018-02-09",
      },
      artists: [
        { id: "artist-kendrick", name: "Kendrick Lamar" },
        { id: "artist-sza", name: "SZA" },
      ],
    },
    {
      id: "track-3",
      name: "Kill Bill",
      duration_ms: 153000,
      album: {
        id: "album-3",
        name: "SOS",
        release_date: "2022-12-09",
      },
      artists: [{ id: "artist-sza", name: "SZA" }],
    },
  ];

  it("builds a connected graph with artists, tracks, and edges", () => {
    const { graph, stats } = buildMusicGraphFromSpotify(sampleTracks);

    expect(stats.tracksProcessed).toBe(3);
    expect(stats.artistsProcessed).toBe(2);
    expect(graph.nodes.length).toBe(5); // 2 artists + 3 tracks

    const kendrick = graph.nodes.find((n) => n.id === "spotify:artist:artist-kendrick");
    const sza = graph.nodes.find((n) => n.id === "spotify:artist:artist-sza");
    expect(kendrick).toBeDefined();
    expect(sza).toBeDefined();

    // Kendrick has 2 tracks, SZA has 2 tracks
    expect(kendrick?.listeningCount).toBe(100 + 2 * 35);
    expect(sza?.listeningCount).toBe(100 + 2 * 35);

    // Track nodes exist
    const humble = graph.nodes.find((n) => n.id === "spotify:track:track-1");
    expect(humble).toBeDefined();
    expect(humble?.label).toBe("HUMBLE.");
    expect(humble?.metadata?.duration).toBe("2:57");

    // Edges
    // Track 1 -> Kendrick
    expect(
      graph.edges.some(
        (e) =>
          e.source === "spotify:artist:artist-kendrick" &&
          e.target === "spotify:track:track-1" &&
          e.type === "artist_track"
      )
    ).toBe(true);

    // Track 2 has both Kendrick and SZA
    expect(
      graph.edges.some(
        (e) =>
          e.source === "spotify:artist:artist-kendrick" &&
          e.target === "spotify:track:track-2"
      )
    ).toBe(true);
    expect(
      graph.edges.some(
        (e) =>
          e.source === "spotify:artist:artist-sza" &&
          e.target === "spotify:track:track-2"
      )
    ).toBe(true);

    // Collaboration edge between Kendrick and SZA
    expect(
      graph.edges.some(
        (e) =>
          e.type === "related_artist" &&
          ((e.source === "spotify:artist:artist-kendrick" && e.target === "spotify:artist:artist-sza") ||
            (e.source === "spotify:artist:artist-sza" && e.target === "spotify:artist:artist-kendrick"))
      )
    ).toBe(true);
  });

  it("handles duplicate tracks in playlist without duplicating nodes", () => {
    const tracksWithDuplicates = [...sampleTracks, sampleTracks[0]]; // Duplicate HUMBLE.
    const { graph, stats } = buildMusicGraphFromSpotify(tracksWithDuplicates);

    expect(stats.tracksProcessed).toBe(3); // Deduplicated to 3 distinct tracks
    const humbleNode = graph.nodes.find((n) => n.id === "spotify:track:track-1");
    expect(humbleNode).toBeDefined();
    // Listening weight reflects 2 playlist appearances
    expect(humbleNode?.listeningCount).toBe(60 + 2 * 20);
  });

  it("assigns valid 3D coordinates to every generated node", () => {
    const { graph } = buildMusicGraphFromSpotify(sampleTracks);

    for (const node of graph.nodes) {
      expect(node.position).toBeDefined();
      expect(node.position?.length).toBe(3);
      expect(Number.isFinite(node.position?.[0])).toBe(true);
      expect(Number.isFinite(node.position?.[1])).toBe(true);
      expect(Number.isFinite(node.position?.[2])).toBe(true);
    }
  });

  it("safely skips null, missing-id, or local tracks", () => {
    const messyTracks: any[] = [
      null,
      undefined,
      { id: null, name: "Null Track" },
      { id: "local-1", name: "Local MP3", is_local: true },
      sampleTracks[0],
    ];

    const { graph, stats } = buildMusicGraphFromSpotify(messyTracks);
    expect(stats.tracksProcessed).toBe(1);
    expect(stats.tracksSkipped).toBe(4);
    expect(graph.nodes.length).toBe(2); // 1 track + 1 artist
  });

  it("integrates artist genres into outer celestial clusters", () => {
    const genreMap = new Map<string, string[]>([
      ["artist-kendrick", ["conscious hip hop", "west coast rap"]],
      ["artist-sza", ["contemporary r&b"]],
    ]);

    const { graph, stats } = buildMusicGraphFromSpotify(sampleTracks, genreMap);
    expect(stats.genresAvailable).toBe(3);

    const genreNode = graph.nodes.find((n) => n.type === "genre");
    expect(genreNode).toBeDefined();

    // Verify artist_genre edge
    expect(
      graph.edges.some(
        (e) =>
          e.source === "spotify:artist:artist-kendrick" &&
          e.type === "artist_genre"
      )
    ).toBe(true);
  });

  it("formats track duration accurately", () => {
    expect(formatTrackDuration(0)).toBe("0:00");
    expect(formatTrackDuration(65000)).toBe("1:05");
    expect(formatTrackDuration(365000)).toBe("6:05");
  });
});
