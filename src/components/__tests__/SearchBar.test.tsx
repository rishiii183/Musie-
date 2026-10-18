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

    const input = screen.getByPlaceholderText("Search artists, tracks, genres...");
    fireEvent.change(input, { target: { value: "Tame" } });

    expect(screen.getByText("Tame Impala")).toBeDefined();
    expect(screen.getByText("ARTIST")).toBeDefined();
  });

  it("calls onSelectNode when a result is clicked", () => {
    const onSelectNode = vi.fn();
    render(<SearchBar nodes={sampleNodes} onSelectNode={onSelectNode} />);

    const input = screen.getByPlaceholderText("Search artists, tracks, genres...");
    fireEvent.change(input, { target: { value: "Let It" } });

    const resultBtn = screen.getByText("Let It Happen");
    fireEvent.click(resultBtn);

    expect(onSelectNode).toHaveBeenCalledWith("track-let-it");
  });

  it("displays empty state with helpful suggestion when query doesn't match", () => {
    render(<SearchBar nodes={sampleNodes} onSelectNode={vi.fn()} />);

    const input = screen.getByPlaceholderText("Search artists, tracks, genres...");
    fireEvent.change(input, { target: { value: "NonExistentArtistXYZ" } });

    expect(screen.getByText("No cosmic entities found")).toBeDefined();
  });
});
