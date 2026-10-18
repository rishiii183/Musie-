# Musie — 3D Music Taste Universe & Spotify Playlist Galaxy

An immersive, interactive 3D web experience that turns listening taste and Spotify playlists into an explorable celestial galaxy of artists, tracks, and genres.

Built with **React 19**, **Three.js**, **@react-three/fiber**, **Node.js**, **Express**, **TypeScript**, and custom **Vanilla CSS** glassmorphism design.

---

## 🌟 Key Features

- **Spotify Playlist Galaxy Import**: Paste any public Spotify playlist URL to generate an interactive 3D celestial galaxy rendered from real Spotify Web API metadata.
- **Curated Demo Universe**: Seamless toggle between your custom imported Spotify playlist galaxy and the curated demo galaxy.
- **Logarithmic Spiral Galaxy Layout**: Artists positioned as stellar centers along spiral galaxy arms with track satellites orbiting their parent stars.
- **3D Celestial Constellations**: Additive blending radial glows, vibrant cluster colors, and relational constellation threads linking tracks, artists, and genres.
- **Data Provenance & Transparency**: Distinguishes demo data, provider-sourced data, and derived relationships (`dataOrigin: "spotify"` and `dataOrigin: "demo"`).
- **Smooth Orbit & Camera Focus**: Full 3D orbit, pan, and zoom controls. Selecting or searching an entity smoothly glides the camera to focus without clipping.
- **Instant Search & Type Filters**: Autocomplete search across artists, tracks, and genres with interactive filter chips and real-time count badges.
- **Persistent Details Panel**: Slide-out glass drawer showing entity metadata, duration, album art, and one-click interactive connected orbits.
- **Secure Server-Side Integration**: Client Credentials flow runs strictly on the Node.js backend; client secrets and access tokens are never exposed to the browser.
- **SSRF-Protected URL Validation**: Strict URL parsing rejects non-Spotify hosts, malicious IP addresses, and non-playlist resources.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
npm --prefix server install
```

### 2. Configure Backend Environment
Copy the example environment file in `server/`:
```bash
cp server/.env.example server/.env
```
Edit `server/.env`:
```ini
PORT=3001
NODE_ENV=development
FRONTEND_ORIGIN=http://localhost:5173

# Optional: Add your credentials from https://developer.spotify.com/dashboard
SPOTIFY_CLIENT_ID=your_client_id_here
SPOTIFY_CLIENT_SECRET=your_client_secret_here

MAX_PLAYLIST_TRACKS=500
API_RATE_LIMIT_MAX=60
API_RATE_LIMIT_WINDOW_MS=60000
```

> **Note:** If `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` are not set, the curated demo galaxy remains fully operational, and the import modal clearly guides you to set credentials.

### 3. Run Locally

In separate terminal windows:

**Terminal 1 (Backend API):**
```bash
npm run server:dev
```
Backend runs on `http://localhost:3001`.

**Terminal 2 (Frontend Client):**
```bash
npm run dev
```
Frontend runs on `http://localhost:5173` (with `/api` automatically proxied to the backend).

---

## 🧪 Testing & Quality Gates

Run all automated tests across both frontend and backend:
```bash
npm test
```
Or run individually:
```bash
# Frontend tests (validation, selectors, UI components)
npm test

# Backend tests (URL validation, graph builder, Spotify service, API routes)
npm run server:test

# Typecheck backend
npm --prefix server run typecheck

# Production builds
npm run build
npm run server:build
```

---

## 📡 API Endpoints

### 1. `GET /api/health`
Indicates service health status.
```json
{
  "status": "ok",
  "service": "musie-api"
}
```

### 2. `GET /api/health/spotify`
Diagnostic check indicating whether Spotify credentials are configured on the server without exposing secrets.
```json
{
  "status": "ok",
  "spotifyConfigured": true
}
```

### 3. `POST /api/playlists/import`
Imports a Spotify playlist and generates a normalized 3D celestial graph.

**Request Body:**
```json
{
  "url": "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M"
}
```

**Supported URL / URI Formats:**
- `https://open.spotify.com/playlist/PLAYLIST_ID`
- `https://open.spotify.com/playlist/PLAYLIST_ID?si=...`
- `https://open.spotify.com/intl-de/playlist/PLAYLIST_ID`
- `spotify:playlist:PLAYLIST_ID`

**Response Shape:**
```json
{
  "source": "spotify",
  "playlist": {
    "id": "37i9dQZF1DXcBWIGoYBM5M",
    "name": "Today's Top Hits",
    "description": "Jung Kook is on top of the Hottest 50!",
    "externalUrl": "https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M",
    "imageUrl": "https://i.scdn.co/image/...",
    "totalTracks": 50
  },
  "stats": {
    "tracksProcessed": 50,
    "tracksSkipped": 0,
    "artistsProcessed": 32,
    "genresAvailable": 6,
    "truncated": false
  },
  "graph": {
    "nodes": [
      {
        "id": "spotify:artist:2YZyLoL8N0Wb9xBt1NhZWg",
        "type": "artist",
        "label": "Kendrick Lamar",
        "listeningCount": 170,
        "position": [4.2, 0.5, -3.1],
        "color": "#ff6b81",
        "dataOrigin": "spotify",
        "metadata": {
          "spotifyId": "2YZyLoL8N0Wb9xBt1NhZWg",
          "playlistTrackCount": 2,
          "genres": "conscious hip hop, west coast rap"
        }
      }
    ],
    "edges": [
      {
        "id": "edge-artist_track-spotify:artist:2YZyLoL8N0Wb9xBt1NhZWg-spotify:track:4cOdK2wGLETKBW3PvgPWqT",
        "source": "spotify:artist:2YZyLoL8N0Wb9xBt1NhZWg",
        "target": "spotify:track:4cOdK2wGLETKBW3PvgPWqT",
        "type": "artist_track",
        "dataOrigin": "spotify"
      }
    ]
  },
  "warnings": []
}
```

---

## 🛠️ Spotify Developer Dashboard Setup

1. Log in to the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard).
2. Click **Create App**.
3. Set:
   - **App name**: `Musie`
   - **App description**: `3D interactive music galaxy visualizer`
   - **Redirect URI**: `http://localhost:5173/callback` (or `http://localhost:3001/callback`)
   - **APIs used**: Select **Web API**.
4. Navigate to **Settings** and copy:
   - **Client ID**
   - **Client Secret**
5. Paste them into `server/.env` as `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET`.
6. Restart the backend: `npm run server:dev`.

---

## 🔧 Troubleshooting Error Codes

| Status Code | Cause | Resolution |
| :--- | :--- | :--- |
| **400 Bad Request** | Invalid link format, non-playlist link (track, album, artist), or malformed ID. | Ensure you paste a Spotify playlist link (`open.spotify.com/playlist/...`). |
| **401 Unauthorized** | Expired or invalid Spotify application credentials. | Check `SPOTIFY_CLIENT_ID` and `SPOTIFY_CLIENT_SECRET` in `server/.env`. |
| **403 Forbidden** | Spotify playlist is private, or restricted by country/API policy. | Make sure the playlist is set to **Public** on Spotify. |
| **404 Not Found** | Playlist does not exist or was deleted. | Verify the URL in your browser or Spotify app. |
| **429 Rate Limit** | Spotify API rate limit or development quota reached. | Server respects the `Retry-After` header. Wait for the cooldown period before trying again. |
| **503 Service Unavailable** | Spotify credentials missing from `server/.env`. | Add your Spotify Client ID and Secret in `server/.env`. |

---

## 📐 Architecture Layout

```text
music-universe/
├── server/                           # Backend Node.js / Express Service
│   ├── src/
│   │   ├── config/env.ts             # Environment parsing & validation (Zod)
│   │   ├── controllers/
│   │   │   └── playlist.controller.ts # Request orchestration
│   │   ├── middleware/
│   │   │   ├── error-handler.ts      # Centralized error mapping
│   │   │   └── rate-limit.ts         # IP request throttling
│   │   ├── routes/
│   │   │   ├── health.routes.ts      # Health & diagnostics
│   │   │   └── playlist.routes.ts    # Import endpoint
│   │   ├── services/
│   │   │   ├── spotify.service.ts    # Client Credentials OAuth & API fetcher
│   │   │   ├── graph-builder.service.ts # 3D spiral layout & normalization
│   │   │   └── playlist-import.service.ts # Pipeline coordinator
│   │   ├── types/music.types.ts      # Shared graph & Spotify types
│   │   ├── utils/spotify-url.ts      # SSRF-safe URL parser
│   │   ├── app.ts                    # Express app configuration
│   │   └── index.ts                  # Server entrypoint
│   └── tests/                        # Vitest unit & integration tests
├── src/                              # Frontend React 19 Client
│   ├── components/
│   │   ├── layout/                   # AppHeader, ActivePlaylistBanner, PlaylistImportModal
│   │   └── universe/                 # React Three Fiber 3D Galaxy Scene
│   ├── domain/
│   │   ├── musicDataProvider.ts      # Abstract data provider interface
│   │   └── spotifyDataProvider.ts    # Spotify provider implementation
│   ├── services/
│   │   └── spotifyImportApi.ts       # Backend REST client
│   └── App.tsx                       # Main application shell
```
