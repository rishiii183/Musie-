# Technical Specification: 3D Music Universe

## Recommended stack
- Vite + React + TypeScript
- Three.js
- `@react-three/fiber`
- `@react-three/drei`
- Tailwind CSS or the project's existing styling system
- Vitest + React Testing Library for unit/component tests
- Playwright for end-to-end smoke tests if practical

Use D3 only if a specific graph-layout or graph-analysis need is identified.

## Architecture
```text
React Application
├── App shell: header, search, filters, legend, controls, details panel
├── Universe canvas (React Three Fiber)
│   ├── Background starfield
│   ├── Music nodes
│   ├── Relationship edges
│   ├── Labels / hover feedback
│   └── Camera controls
├── Domain layer
│   ├── Graph types
│   ├── Sample dataset
│   ├── Validation / normalization
│   └── Selectors: neighbors, search, filters
└── Data adapter
    ├── Demo adapter (Phase 1)
    └── Spotify adapter (Phase 2)
```

Phase 1 should be frontend-only. Add a backend only when a real requirement—such as secure authorization/session handling—justifies it.

## Suggested folder structure
```text
src/
  app/App.tsx
  components/
    layout/
      AppHeader.tsx
      SearchBar.tsx
      TypeFilters.tsx
      UniverseLegend.tsx
      UniverseControls.tsx
      EntityDetailsPanel.tsx
    universe/
      MusicUniverse.tsx
      UniverseScene.tsx
      MusicNode.tsx
      MusicConnections.tsx
      NodeLabel.tsx
  data/sampleMusicGraph.ts
  domain/musicGraph.types.ts
  domain/graphValidation.ts
  domain/graphSelectors.ts
  hooks/useMusicGraph.ts
  hooks/useUniverseSelection.ts
  styles/index.css
```
Adapt this to the existing repository instead of replacing working conventions unnecessarily.

## Domain model
```ts
export type MusicNodeType = "artist" | "track" | "genre";

export interface MusicNode {
  id: string;
  type: MusicNodeType;
  label: string;
  listeningCount?: number;
  imageUrl?: string;
  externalUrl?: string;
  metadata?: Record<string, string | number | boolean | null>;
  position?: [number, number, number];
  dataOrigin: "demo" | "spotify" | "derived";
}

export type MusicEdgeType =
  | "artist_track"
  | "artist_genre"
  | "related_artist"
  | "track_genre";

export interface MusicEdge {
  id: string;
  source: string;
  target: string;
  type: MusicEdgeType;
  confidence?: number;
  dataOrigin: "demo" | "spotify" | "derived";
}

export interface MusicGraph {
  nodes: MusicNode[];
  edges: MusicEdge[];
}
```

Only include fields supported by the source. `confidence` is appropriate only for a defined derived relationship, never as a made-up value.

## Data validation
- Node and edge IDs are unique.
- Each edge points to existing nodes.
- Invalid positions are safely skipped.
- Missing listening counts are unknown, not automatically zero.
- Node size is bounded to avoid one value dominating.
- Empty graph and partial records are handled gracefully.
- Validate allowed node/edge type combinations.

## Visual mapping
- Type controls baseline appearance and legend.
- Activity uses bounded non-linear scaling (e.g. square-root) to avoid extreme size differences.
- Edge type defines relationship semantics.
- Selected node and direct neighbors become brighter.
- Unrelated nodes dim but remain discoverable.
- Labels appear on hover or for selected/nearby nodes.
- Use instancing or geometry reuse if profiling shows it is needed.

## Selection and camera
- Keep selected node ID in React state.
- Keep high-frequency camera/hover updates out of broad app state.
- Compute neighbors from graph edges.
- Camera focus animation is cancellable; avoid overlapping animations.
- Selection and panel stay synchronized.
- Clearing selection is independent from resetting camera.

## Spotify integration boundary
Expose an adapter such as:
```ts
export interface MusicDataProvider {
  getMusicGraph(): Promise<MusicGraph>;
}
```
Phase 1 returns the sample graph; a future Spotify adapter normalizes permitted provider responses into the same model.

Before OAuth implementation:
- Review current Spotify developer rules, scopes, and endpoint availability.
- Do not assume full play counts, all listening history, or artist-similarity data are available.
- Keep client secrets on a trusted server; never ship them in the browser bundle.
- Use the currently supported authorization flow for the deployment model.
- Request only necessary permissions.
- Handle token expiry, revoked access, rate limits, and partial responses.
- Follow provider branding, attribution, caching, and playback rules.
- Do not persist access/refresh tokens in localStorage; choose a secure session strategy for the actual architecture.

## Performance
- Start with a bounded demo graph and profile.
- Avoid React state updates every frame.
- Reuse geometry/materials and avoid one expensive light per node.
- Limit labels and post-processing.
- Test picking and camera controls under load.
- Consider reduced-motion and non-3D fallback behavior.

## Tests
Unit: graph validation, neighbor lookup, search/filter selectors, node-size mapping, adapter shape.
Integration: selecting each node type updates details; connected-node click updates selection; search selects node; filters do not leave stale selection; clear/reset behave independently.
E2E: app loads, search works, selecting a node opens details, no fatal console errors.

## Quality gates
Type check, lint if configured, unit tests, production build, no committed secrets, and documented limitations.
