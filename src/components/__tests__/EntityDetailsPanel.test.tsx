import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { EntityDetailsPanel } from "../layout/EntityDetailsPanel";
import type { MusicNode, GraphNeighborMap } from "../../domain/musicGraph.types";

describe("EntityDetailsPanel", () => {
  const dummyNeighbors: GraphNeighborMap = {
    neighborNodeIds: new Set(["track-1", "genre-1"]),
    connectedEdgeIds: new Set(["edge-1", "edge-2"]),
    connectedNodes: [
      { id: "track-1", type: "track", label: "Track One", listeningCount: 50, dataOrigin: "demo" },
      { id: "genre-1", type: "genre", label: "Genre One", dataOrigin: "demo" },
    ],
    connectedEdges: [],
  };

  it("renders null when node is null", () => {
    const { container } = render(
      <EntityDetailsPanel
        node={null}
        neighbors={dummyNeighbors}
        onSelectNode={vi.fn()}
        onClose={vi.fn()}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it("renders artist details with listening metric and provenance label", () => {
    const artistNode: MusicNode = {
      id: "artist-1",
      type: "artist",
      label: "Star Artist",
      listeningCount: 180,
      dataOrigin: "demo",
      metadata: { country: "United Kingdom", monthlyListeners: "10M" },
    };

    render(
      <EntityDetailsPanel
        node={artistNode}
        neighbors={dummyNeighbors}
        onSelectNode={vi.fn()}
        onClose={vi.fn()}
      />
    );

    expect(screen.getByText("Star Artist")).toBeDefined();
    expect(screen.getByText("Artist")).toBeDefined();
    expect(screen.getByText("180")).toBeDefined();
    expect(screen.getByText("Demo Sourced")).toBeDefined();
    expect(screen.getByText("United Kingdom")).toBeDefined();
  });

  it("renders track details with album, year, and duration", () => {
    const trackNode: MusicNode = {
      id: "track-sample",
      type: "track",
      label: "Cosmic Melody",
      listeningCount: 75,
      dataOrigin: "demo",
      metadata: { album: "Cosmic Odyssey", releaseYear: 2024, duration: "4:15" },
    };

    render(
      <EntityDetailsPanel
        node={trackNode}
        neighbors={dummyNeighbors}
        onSelectNode={vi.fn()}
        onClose={vi.fn()}
      />
    );

    expect(screen.getByText("Cosmic Melody")).toBeDefined();
    expect(screen.getByText("Track")).toBeDefined();
    expect(screen.getByText("Album: Cosmic Odyssey")).toBeDefined();
    expect(screen.getByText("2024")).toBeDefined();
    expect(screen.getByText("4:15")).toBeDefined();
  });

  it("allows clicking connected entities to navigate focus", () => {
    const artistNode: MusicNode = {
      id: "artist-1",
      type: "artist",
      label: "Star Artist",
      dataOrigin: "demo",
    };
    const onSelectNode = vi.fn();

    render(
      <EntityDetailsPanel
        node={artistNode}
        neighbors={dummyNeighbors}
        onSelectNode={onSelectNode}
        onClose={vi.fn()}
      />
    );

    const trackChip = screen.getByText("Track One");
    fireEvent.click(trackChip);
    expect(onSelectNode).toHaveBeenCalledWith("track-1");
  });

  it("calls onClose when the close button is clicked", () => {
    const artistNode: MusicNode = {
      id: "artist-1",
      type: "artist",
      label: "Star Artist",
      dataOrigin: "demo",
    };
    const onClose = vi.fn();

    render(
      <EntityDetailsPanel
        node={artistNode}
        neighbors={dummyNeighbors}
        onSelectNode={vi.fn()}
        onClose={onClose}
      />
    );

    const closeBtn = screen.getByLabelText("Close details panel");
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
