import React, { useState } from "react";
import {
  Sparkles,
  X,
  Loader2,
  AlertCircle,
  Music,
  Clipboard,
  Check,
  ShieldCheck,
} from "lucide-react";
import { importSpotifyPlaylist } from "../../services/spotifyImportApi";
import type { SpotifyImportResult } from "../../services/spotifyImportApi";

interface PlaylistImportModalProps {
  isOpen: boolean;
  initialUrl?: string;
  onClose: () => void;
  onImportSuccess: (result: SpotifyImportResult) => void;
}

export const PlaylistImportModal: React.FC<PlaylistImportModalProps> = ({
  isOpen,
  initialUrl = "",
  onClose,
  onImportSuccess,
}) => {
  const [url, setUrl] = useState(initialUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pasted, setPasted] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      if (initialUrl) {
        setUrl(initialUrl);
      }
      setError(null);
      setPasted(false);
    }
  }, [isOpen, initialUrl]);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    if (error) setError(null);
    if (pasted) setPasted(false);
  };

  const handlePasteClick = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          setUrl(text.trim());
          setError(null);
          setPasted(true);
          setTimeout(() => setPasted(false), 2000);
        }
      }
    } catch {
      // Clipboard access blocked or not supported
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = url.trim();

    if (!trimmed) {
      setError("Please paste a Spotify playlist link.");
      return;
    }

    if (trimmed.includes("/track/")) {
      setError("This is a track link. Please paste a playlist link instead.");
      return;
    }

    if (trimmed.includes("/album/")) {
      setError("This is an album link. Please paste a playlist link instead.");
      return;
    }

    if (trimmed.includes("/artist/")) {
      setError("This is an artist link. Please paste a playlist link instead.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await importSpotifyPlaylist(trimmed);
      onImportSuccess(result);
      onClose();
    } catch (err: any) {
      setError(err?.message || "Failed to import playlist. Please check your link.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  const handleSampleClick = (sampleUrl: string) => {
    setUrl(sampleUrl);
    setError(null);
  };

  return (
    <div
      className="import-modal-backdrop"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      <div className="import-modal-card">
        {/* Header */}
        <div className="import-modal-header">
          <div className="import-header-badge">
            <Sparkles size={12} className="sparkle-icon" />
            <span>SPOTIFY PLAYLIST IMPORT</span>
          </div>
          <button
            type="button"
            className="import-close-btn"
            onClick={onClose}
            disabled={isLoading}
            aria-label="Close modal"
          >
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="import-modal-body">
          <div className="import-intro-section">
            <h2 className="import-title">Import a Spotify Playlist</h2>
            <p className="import-subtitle">
              Paste any public playlist link to generate an interactive 3D constellation of its tracks, artists, and musical connections.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="import-form">
            <div className="import-input-container">
              <label htmlFor="spotify-playlist-url" className="import-input-label">
                Playlist URL or URI
              </label>
              <div className="import-input-wrapper">
                <Music size={15} className="import-input-icon" />
                <input
                  id="spotify-playlist-url"
                  type="text"
                  className="import-url-input"
                  placeholder="https://open.spotify.com/playlist/..."
                  value={url}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  autoComplete="off"
                  spellCheck={false}
                  autoFocus
                />
                <div className="import-input-actions">
                  {url && !isLoading ? (
                    <button
                      type="button"
                      className="import-action-btn clear-btn"
                      onClick={() => setUrl("")}
                      title="Clear input"
                    >
                      <X size={14} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      className={`import-action-btn paste-btn ${pasted ? "pasted-state" : ""}`}
                      onClick={handlePasteClick}
                      title="Paste from clipboard"
                    >
                      {pasted ? (
                        <>
                          <Check size={12} />
                          <span>Pasted</span>
                        </>
                      ) : (
                        <>
                          <Clipboard size={12} />
                          <span>Paste</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {error && (
              <div className="import-error-banner" role="alert">
                <AlertCircle size={14} className="error-icon" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="import-submit-btn"
              disabled={isLoading || !url.trim()}
            >
              {isLoading ? (
                <>
                  <Loader2 size={15} className="spinner-icon" />
                  <span>Building 3D galaxy...</span>
                </>
              ) : (
                <>
                  <span>Generate Galaxy</span>
                </>
              )}
            </button>
          </form>

          {/* Sample Playlists */}
          <div className="import-examples-section">
            <span className="examples-label">Examples:</span>
            <div className="example-pills-list">
              <button
                type="button"
                className="example-pill-btn"
                disabled={isLoading}
                onClick={() =>
                  handleSampleClick("https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M")
                }
              >
                Top Hits
              </button>
              <button
                type="button"
                className="example-pill-btn"
                disabled={isLoading}
                onClick={() =>
                  handleSampleClick("https://open.spotify.com/playlist/37i9dQZF1DXdLEN7aqioXM")
                }
              >
                Lo-Fi Beats
              </button>
              <button
                type="button"
                className="example-pill-btn"
                disabled={isLoading}
                onClick={() =>
                  handleSampleClick("https://open.spotify.com/playlist/37i9dQZF1DX4t95PaoR1zy")
                }
              >
                Synthwave
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="import-modal-footer">
          <ShieldCheck size={13} className="privacy-icon" />
          <span className="import-privacy-note">
            Only public metadata is fetched securely server-side. No Spotify login or credentials required.
          </span>
        </div>
      </div>
    </div>
  );
};
