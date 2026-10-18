import React from "react";
import { Sparkles, Compass, Tag } from "lucide-react";
import type { GraphStats } from "../../domain/musicGraph.types";

interface AppHeaderProps {
  stats: GraphStats;
  showLabels: boolean;
  onToggleLabels: () => void;
  onResetCamera: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  stats,
  showLabels,
  onToggleLabels,
  onResetCamera,
}) => {
  return (
    <header className="app-header">
      <div className="header-left">
        <div className="brand-badge">
          <Sparkles className="brand-icon" size={20} />
          <div className="brand-text">
            <h1 className="brand-title">MUSIE</h1>
            <span className="brand-tagline">3D Sonic Galaxy</span>
          </div>
        </div>

        <div className="provenance-pill" title="This universe is rendered from curated demo listening data">
          <span className="provenance-dot" />
          <span>Demo Data Mode</span>
        </div>
      </div>

      <div className="header-center">
        <div className="stats-ticker">
          <span className="stat-item">
            <strong className="stat-count text-purple">{stats.genreCount}</strong> Genres
          </span>
          <span className="stat-divider">•</span>
          <span className="stat-item">
            <strong className="stat-count text-cyan">{stats.artistCount}</strong> Artists
          </span>
          <span className="stat-divider">•</span>
          <span className="stat-item">
            <strong className="stat-count text-amber">{stats.trackCount}</strong> Tracks
          </span>
        </div>
      </div>

      <div className="header-right">
        <button
          type="button"
          className={`header-button ${showLabels ? "active" : ""}`}
          onClick={onToggleLabels}
          title="Toggle 3D world labels"
          aria-label="Toggle labels"
        >
          <Tag size={15} />
          <span>{showLabels ? "Labels ON" : "Labels OFF"}</span>
        </button>

        <button
          type="button"
          className="header-button"
          onClick={onResetCamera}
          title="Reset camera view to galaxy overview"
          aria-label="Reset camera"
        >
          <Compass size={15} />
          <span>Reset View</span>
        </button>
      </div>
    </header>
  );
};
