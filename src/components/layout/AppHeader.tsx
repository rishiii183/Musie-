import React from "react";
import { Sparkles } from "lucide-react";
import type { GraphStats } from "../../domain/musicGraph.types";

interface AppHeaderProps {
  stats: GraphStats;
  showLabels: boolean;
  isSpotifyMode?: boolean;
  onToggleLabels: () => void;
  onResetCamera: () => void;
  onOpenImport?: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  showLabels,
  isSpotifyMode,
  onToggleLabels,
  onResetCamera,
  onOpenImport,
}) => {
  return (
    <header className="app-header">
      <div className="header-left">
        <div className="brand-text">
          <h1 className="brand-title">MUSIC UNIVERSE</h1>
          <span className="brand-tagline">
            {isSpotifyMode ? "Spotify Playlist Galaxy" : "your listening, mapped as a galaxy"}
          </span>
        </div>
      </div>

      <div className="header-right">
        {onOpenImport && (
          <button
            type="button"
            className="minimal-pill-btn import-pill-btn"
            onClick={onOpenImport}
            aria-label="Import Spotify playlist"
            title="Import a Spotify playlist to generate a 3D galaxy"
          >
            <Sparkles size={12} className="sparkle-icon" />
            <span>IMPORT PLAYLIST</span>
          </button>
        )}

        <button
          type="button"
          className={`minimal-pill-btn ${showLabels ? "active" : ""}`}
          onClick={onToggleLabels}
          aria-label="Toggle node labels"
        >
          LABELS
        </button>

        <button
          type="button"
          className="minimal-pill-btn"
          onClick={onResetCamera}
          aria-label="Reset camera view"
        >
          RESET
        </button>
      </div>
    </header>
  );
};
