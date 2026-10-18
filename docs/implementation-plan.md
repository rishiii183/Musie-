# Implementation Plan

## Milestone 0 — Setup
- Inspect project directory and package manager.
- Initialize Vite React TypeScript only if the directory is empty.
- Install React Three Fiber, Drei, and required dependencies.
- Add scripts for checks/tests where practical.
- Run starter build.
**Done when:** app starts and production build passes.

## Milestone 1 — Domain model and sample graph
- Add TypeScript node/edge types.
- Add at least 12 artists, 30 tracks, and 6 genres.
- Add graph validation and selectors.
- Test graph integrity and neighbor lookup.
**Done when:** dataset validates and all edges point to existing nodes.

## Milestone 2 — Universe scene
- Add starfield, nodes, explicit edges, bounded node-size mapping.
- Add camera orbit, pan, zoom, and loading state.
**Done when:** scene works reliably on a typical laptop.

## Milestone 3 — Interaction
- Add hover labels, click selection, camera focus, connected-node highlighting.
- Add persistent details panel and separate clear/reset actions.
**Done when:** all node types show correct details and connections.

## Milestone 4 — Search and polish
- Add search, node-type filters, label toggle, legend, responsive behavior, reduced-motion support, and no-results state.
**Done when:** search, filters, selection, and panel remain synchronized.

## Milestone 5 — Quality gates
- Run type checks, lint, tests, production build.
- Test missing metrics, invalid edges, and empty data.
- Update README with setup and limitations.
**Done when:** checks pass and limitations are documented.

## Milestone 6 — Spotify integration (separate milestone)
- Review current developer rules, scopes, and endpoint availability.
- Configure a registered app and supported OAuth flow.
- Implement secure authorization/session handling.
- Normalize only data the app can actually retrieve.
- Test denied permissions, expired tokens, rate limits, and partial responses.
**Done when:** real integration is tested and unavailable fields are accurately represented.
