# Musie — 3D Music Taste Universe

An immersive, interactive 3D web experience that turns listening taste into an explorable celestial galaxy of artists, tracks, and genres.

Built with **React 19**, **Three.js**, **@react-three/fiber**, **@react-three/drei**, and **TypeScript** with custom **Vanilla CSS** glassmorphism design.

---

## 🌟 Key Features

- **3D Celestial Constellations**: 7 genre superclusters, 15 artist stars, and 38 track satellites positioned in organic 3D orbits.
- **Data Provenance & Transparency**: Distinguishes demo data, provider-sourced data, and derived relationships (`dataOrigin: "demo"` clearly labeled).
- **Smooth Orbit & Camera Focus**: Full 3D orbit, pan, and zoom controls. Selecting or searching an entity smoothly glides the camera to focus without clipping.
- **Relational Edges**: Dynamic 3D constellation threads linking artists to their genres, tracks, and related artists. Selected nodes highlight connected edges while dimming unrelated nodes.
- **Instant Search**: Autocomplete search across artists, tracks, genres, and metadata with friendly no-results handling.
- **Type Filters**: Interactive filter chips with real-time entity count badges for Genres, Artists, and Tracks.
- **Persistent Details Panel**: Rich slide-out glass drawer showing entity metadata, play metrics, and one-click interactive connected orbits.
- **Galaxy Legend & Controls**: Collapsible visual key explaining node styles, edge connections, and activity radius scaling.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Locally (Dev Server)
```bash
npm run dev
```
Visit `http://localhost:5173/` in your browser.

### 3. Run Test Suite (Vitest)
```bash
npm test
```
Executes all domain validation, graph selector, and UI component tests.

### 4. Build for Production
```bash
npm run build
```

### 5. Lint Code
```bash
npm run lint
```

---

## 📐 Project Structure

```text
music-universe/
├── docs/                   # Product & Technical Specifications
│   ├── PRD.md              # Requirements and user journeys
│   ├── tech.md             # Stack and architectural standards
│   ├── architecture.md     # Architectural trade-offs
│   ├── data-model.md       # Graph schema and invariants
│   ├── implementation-plan.md # Milestones
│   └── AGENTS.md           # Engineering guidelines
├── src/
│   ├── components/
│   │   ├── layout/         # AppHeader, SearchBar, TypeFilters, Legend, DetailsPanel
│   │   └── universe/       # MusicUniverse, UniverseScene, MusicNode, Connections, Starfield
│   ├── data/
│   │   └── sampleMusicGraph.ts # High-fidelity 58-node sample galaxy
│   ├── domain/
│   │   ├── musicGraph.types.ts # Domain schemas and types
│   │   ├── graphValidation.ts  # Invariant checks and bounded sizing
│   │   ├── graphSelectors.ts   # Neighbors, search, filtering, and themes
│   │   └── musicDataProvider.ts# Data adapter interface & demo provider
│   ├── hooks/
│   │   ├── useMusicGraph.ts    # Graph loading & filtering state
│   │   └── useUniverseSelection.ts # Selection, camera targeting, & neighbors
│   ├── styles/
│   │   └── index.css       # Cosmic Vanilla CSS design system
│   ├── App.tsx             # Root application assembly
│   └── main.tsx            # Entrypoint
```

---

## 🔒 Security & Data Integrity

- Zero committed secrets or API keys.
- Strict data provenance: Sample demo data is explicitly disclosed in the UI and data model.
- Bounded non-linear scaling for node sizes to prevent visual domination.
- Empty states and invalid/partial records are validated and handled safely without scene crashes.

---

## 📋 Known Limitations & Phase 2 Roadmap

1. **Phase 1 Demo Mode**: Uses local typed sample data with 60 entities and 55 edges. Real Spotify OAuth integration is planned for Milestone 6 behind `MusicDataProvider`.
2. **Audio Previews**: Audio playback previews are deferred to Phase 2 to adhere to Spotify developer policy requirements.
3. **Hardware Acceleration**: Optimal performance requires WebGL-enabled desktop or mobile browsers. Fallbacks handle missing WebGL contexts gracefully.
