# Product Requirements Document (PRD): 3D Music Universe

**Status:** Draft v1  
**Goal:** Turn a user's music taste into an explorable 3D universe of artists, tracks, and genres.

## Product vision
Music Universe is an immersive web experience where music entities appear as connected nodes in a 3D scene. Artists, songs, and genres have distinct visual styles. Node size may represent listening activity when a reliable metric is available; edges represent known relationships or clearly labeled estimates.

## Target users
- Music fans curious about their listening habits.
- Spotify users who want a visual music identity.
- Portfolio reviewers evaluating a polished 3D web project.

## Product principles
1. Explore without overwhelming the user.
2. Every interaction should reveal useful information.
3. Distinguish real data, derived data, and demo data.
4. Build a complete sample-data experience before Spotify integration.
5. Keep rendering responsive on typical laptops.

## Scope — Phase 1 MVP
- 3D starfield and universe scene.
- Sample graph with at least 12 artists, 30 tracks, and 6 genres.
- Explicit artist-track and artist-genre relationships.
- Node size based on demo listening counts.
- Orbit, pan, and zoom controls.
- Hover labels and click selection.
- Focus animation and connected-node highlighting.
- Persistent entity-details panel.
- Search, type filters, labels toggle, legend, and reset-camera control.
- Loading, empty-search, and invalid-data handling.
- Responsive layout.

## Core user journey
1. Open the site and enter a demo universe without signing in.
2. Rotate and zoom around the universe.
3. Hover a node to see its label and type.
4. Click a node to focus the camera and open its details.
5. See direct relationships highlighted while unrelated nodes dim.
6. Click a connected entity to continue exploring.
7. Clear selection or reset the camera.

## Node interactions
### Single click
- Select node; smoothly focus camera without clipping into it.
- Highlight selected node and direct neighbors.
- Dim unrelated nodes without hiding the universe.
- Open or update the persistent details panel.

### Hover
- Show compact name/type label.
- Do not open the full details panel.

### Connected-node click
- Transition focus and update details without rebuilding the whole scene.

### Empty-space click / clear selection
- Clear emphasis and selection.
- Do not reset camera unless Reset View is explicitly used.

### Search
- Search artists, tracks, and genres.
- Selecting a result selects and focuses its node.
- Show a useful no-results state.

## Details panel
Common: name, entity type, available activity metric, relationships, and demo/source indicator where useful.
- Artist: name, known genres, connected tracks, available activity metric.
- Track: title, artist(s), available album art/album title, external link, activity metric.
- Genre: genre name and associated artists/tracks; aggregated activity only if its calculation is defined.

Never fabricate play counts, metadata, similarity, or relationships.

## Visual direction
Deep black/midnight space, restrained accent colors, distinct node treatments, thin edges, clear labels, selected relationships with stronger emphasis. Avoid excessive bloom, heavy post-processing, clutter, and generic dashboard styling. Respect reduced-motion preferences where practical.

## Non-functional requirements
- TypeScript checks and production build pass.
- No secrets in frontend source or repository.
- Handle missing metrics, malformed edges, empty graphs, and missing coordinates.
- Keyboard-accessible search and controls where practical.
- Responsive desktop/tablet layout; simplified mobile controls if necessary.
- Never present demo or inferred data as live Spotify data.

## Success criteria
- App starts using documented commands.
- Every node type can be selected and shows appropriate details.
- Search, filters, selection, and panel remain synchronized.
- Camera controls and connected-node highlighting work.
- Missing/empty data does not crash the scene.
- Demo data is clearly labeled.
- Spotify integration is only considered done after testing with a registered app and currently permitted API access.

## Out of scope for Phase 1
Spotify OAuth, backend/database, playback, social profiles, collaborative sessions, and unsourced artist similarity.

## Open decisions
Final brand identity; persistence requirements; provider fields actually available; whether non-basic relationships are provider-sourced or transparently derived.
