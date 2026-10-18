import React from "react";
import { Music, AlertTriangle, RotateCcw, PlusCircle } from "lucide-react";
import type { SpotifyPlaylistMeta, SpotifyImportStats } from "../../services/spotifyImportApi";

interface ActivePlaylistBannerProps {
  playlist: SpotifyPlaylistMeta;
  stats: SpotifyImportStats;
  warnings: string[];
  onOpenImport: () => void;
  onResetToDemo: () => void;
}

export const ActivePlaylistBanner: React.FC<ActivePlaylistBannerProps> = ({
  playlist,
  stats,
  warnings,
  onOpenImport,
  onResetToDemo,
}) => {
  return (
    <div className="active-playlist-banner" role="region" aria-label="Imported Playlist Galaxy">
      <div className="active-playlist-left">
        {playlist.imageUrl ? (
          <img
            src={playlist.imageUrl}
            alt={playlist.name}
            className="active-playlist-thumb"
          />
        ) : (
          <div className="active-playlist-placeholder">
            <Music size={16} />
          </div>
        )}

        <div className="active-playlist-info">
          <div className="active-playlist-title-row">
            <span className="active-spotify-tag">SPOTIFY PLAYLIST</span>
            <a
              href={playlist.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="active-playlist-title"
              title="Open on Spotify"
            >
              {playlist.name}
            </a>
          </div>

          <div className="active-playlist-meta-row">
            <span>{stats.tracksProcessed} tracks mapped</span>
            <span className="dot-sep">·</span>
            <span>{stats.artistsProcessed} artists</span>
            {stats.truncated && (
              <>
                <span className="dot-sep">·</span>
                <span className="truncated-badge" title={warnings[0]}>
                  Capped at 500
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="active-playlist-actions">
        {warnings.length > 0 && (
          <div className="active-warning-tooltip" title={warnings.join("\n")}>
            <AlertTriangle size={14} className="warning-icon" />
          </div>
        )}

        <button
          type="button"
          className="active-action-btn btn-another"
          onClick={onOpenImport}
          title="Import another Spotify playlist"
        >
          <PlusCircle size={13} />
          <span>Import Another</span>
        </button>

        <button
          type="button"
          className="active-action-btn btn-demo"
          onClick={onResetToDemo}
          title="Return to the curated demo universe"
        >
          <RotateCcw size={13} />
          <span>Demo Galaxy</span>
        </button>
      </div>
    </div>
  );
};
