import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { SearchBar } from "../layout/SearchBar";
import type { MusicNode } from "../../domain/musicGraph.types";

describe("SearchBar", () => {
  const sampleNodes: MusicNode[] = [
    { id: "artist-tame", type: "artist", label: "Tame Impala", dataOrigin: "demo" },
    { id: "track-let-it", type: "track", label: "Let It Happen", dataOrigin: "demo", metadata: { album: "Currents" } },
    { id: "genre-indie", type: "genre", label: "Indie Rock", dataOrigin: "demo" },
  ];

  it("filters and displays search results when user types", () => {
    const onSelectNode = vi.fn();
    render(<SearchBar nodes={sampleNodes} onSelectNode={onSelectNode} />);

    const input = screen.getByPlaceholderText("Search entities or paste Spotify playlist link...");
    fireEvent.change(input, { target: { value: "Tame" } });

    expect(screen.getByText("Tame Impala")).toBeDefined();
    expect(screen.getByText("ARTIST")).toBeDefined();
  });

  it("calls onSelectNode when a result is clicked", () => {
    const onSelectNode = vi.fn();
    render(<SearchBar nodes={sampleNodes} onSelectNode={onSelectNode} />);

    const input = screen.getByPlaceholderText("Search entities or paste Spotify playlist link...");
    fireEvent.change(input, { target: { value: "Let It" } });

    const resultBtn = screen.getByText("Let It Happen");
    fireEvent.click(resultBtn);

    expect(onSelectNode).toHaveBeenCalledWith("track-let-it");
  });

  it("displays empty state with helpful suggestion when query doesn't match", () => {
    render(<SearchBar nodes={sampleNodes} onSelectNode={vi.fn()} />);

    const input = screen.getByPlaceholderText("Search entities or paste Spotify playlist link...");
    fireEvent.change(input, { target: { value: "NonExistentArtistXYZ" } });

    expect(screen.getByText("No cosmic entities found")).toBeDefined();
  });

  it("detects Spotify playlist URL and triggers onOpenImport", () => {
    const onOpenImport = vi.fn();
    render(<SearchBar nodes={sampleNodes} onSelectNode={vi.fn()} onOpenImport={onOpenImport} />);

    const input = screen.getByPlaceholderText("Search entities or paste Spotify playlist link...");
    const playlistUrl = "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M";
    fireEvent.change(input, { target: { value: playlistUrl } });

    expect(screen.getByText("Spotify Playlist Link Detected")).toBeDefined();
    const generateBtn = screen.getByText("Generate Galaxy");
    fireEvent.click(generateBtn);

    expect(onOpenImport).toHaveBeenCalledWith(playlistUrl);
  });
});
