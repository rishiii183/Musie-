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

## 5. Frontend-only Phase 1
**Decision:** No backend/database until a requirement needs one.  
**Why:** A sample-data experience can deploy as a static frontend.  
**Trade-off:** OAuth and token handling require a separate architecture review.

## 6. Persistent details panel
**Decision:** Selection updates a side panel rather than a blocking modal.  
**Why:** Users retain spatial context and can move between connected entities.  
**Trade-off:** On narrow screens, use a bottom sheet or collapsible overlay.
