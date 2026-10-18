# Architecture Decisions: 3D Music Universe

## 1. Demo before provider integration
**Decision:** Use local typed sample data in Phase 1.  
**Why:** The main early risk is the 3D experience, not authentication.  
**Trade-off:** Clearly label demo data and hide provider specifics behind an adapter.

## 2. React Three Fiber
**Decision:** Use Three.js through `@react-three/fiber` and common helpers from `@react-three/drei`.  
**Why:** Declarative scene components fit the React application.  
**Trade-off:** Keep frame-sensitive behavior inside the scene layer; avoid broad React state updates every frame.

## 3. One normalized graph model
**Decision:** Represent entities as nodes and relationships as edges.  
**Why:** Artist-track and artist-genre relationships can be traversed consistently.  
**Trade-off:** Every data source normalizes to the internal graph model before rendering.

## 4. Track provenance
**Decision:** Every node and edge records whether it is demo, provider-sourced, or derived.  
**Why:** A visual graph must not imply inferred relationships are observed facts.  
**Trade-off:** UI styling or labels should disclose derived/demo relationships when relevant.

## 5. Dedicated Node.js Backend for Spotify Integration
**Decision:** Implement a lightweight, dedicated Node.js + Express + TypeScript service in `server/`.  
**Why:** Spotify Web API Client Credentials tokens, client secrets, rate limiting, and playlist parsing must remain strictly server-side to prevent credential leakage and SSRF.  
**Trade-off:** The frontend Vite dev server proxies `/api` to the backend on `http://localhost:3001`. In-memory caching is used without requiring an external database.

## 6. Persistent details panel
**Decision:** Selection updates a side panel rather than a blocking modal.  
**Why:** Users retain spatial context and can move between connected entities.  
**Trade-off:** On narrow screens, use a bottom sheet or collapsible overlay.
