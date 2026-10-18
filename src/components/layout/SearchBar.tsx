import React, { useState, useRef, useEffect } from "react";
import { Search, X, Disc3, Mic2, Radio, Sparkles, ArrowRight } from "lucide-react";
import type { MusicNode } from "../../domain/musicGraph.types";
import { NODE_TYPE_THEMES } from "../../domain/graphSelectors";

interface SearchBarProps {
  nodes: MusicNode[];
  onSelectNode: (nodeId: string) => void;
  onOpenImport?: (prefillUrl?: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ nodes, onSelectNode, onOpenImport }) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const trimmed = query.trim().toLowerCase();

  const isSpotifyPlaylistLink = React.useMemo(() => {
    return (
      trimmed.includes("open.spotify.com/playlist") ||
      trimmed.startsWith("spotify:playlist:") ||
      trimmed.includes("spotify.link/") ||
      (trimmed.includes("spotify.com") && trimmed.includes("playlist"))
    );
  }, [trimmed]);

  const results = React.useMemo(() => {
    if (!trimmed || isSpotifyPlaylistLink) return [];
    return nodes
      .filter((node) => {
        const matchLabel = node.label.toLowerCase().includes(trimmed);
        const matchType = node.type.toLowerCase().includes(trimmed);
        const matchMeta = node.metadata
          ? Object.values(node.metadata).some((v) =>
              String(v).toLowerCase().includes(trimmed)
            )
          : false;
        return matchLabel || matchType || matchMeta;
      })
      .slice(0, 8); // Top 8 results
  }, [nodes, trimmed, isSpotifyPlaylistLink]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  const handleSelect = (nodeId: string) => {
    onSelectNode(nodeId);
    setIsOpen(false);
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case "artist":
        return <Mic2 size={14} className="text-cyan" />;
      case "genre":
        return <Radio size={14} className="text-purple" />;
      case "track":
      default:
        return <Disc3 size={14} className="text-amber" />;
    }
  };

  return (
    <div className="search-bar-wrapper" ref={containerRef}>
      <div className="search-input-box">
        <Search className="search-icon" size={17} />
        <input
          type="text"
          className="search-input"
          placeholder="Search entities or paste Spotify playlist link..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (isSpotifyPlaylistLink && onOpenImport) {
                e.preventDefault();
                onOpenImport(query.trim());
                setIsOpen(false);
              } else if (results.length > 0) {
                e.preventDefault();
                handleSelect(results[0].id);
              }
            }
          }}
          aria-label="Search universe or paste Spotify playlist"
        />
        {query && (
          <button
            type="button"
            className="search-clear-button"
            onClick={() => {
              setQuery("");
              setIsOpen(false);
            }}
            aria-label="Clear search"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {isOpen && query.trim().length > 0 && (
        <div className="search-dropdown">
          {isSpotifyPlaylistLink ? (
            <div className="search-spotify-action-card">
              <div className="spotify-action-header">
                <div className="spotify-action-icon-box">
                  <Sparkles size={18} className="sparkle-icon" />
                </div>
                <div className="spotify-action-text">
                  <span className="spotify-action-title">Spotify Playlist Link Detected</span>
                  <span className="spotify-action-desc">
                    Ready to fetch tracks and generate your 3D Galaxy
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="spotify-action-launch-btn"
                onClick={() => {
                  onOpenImport?.(query.trim());
                  setIsOpen(false);
                }}
              >
                <span>Generate Galaxy</span>
                <ArrowRight size={14} />
              </button>
            </div>
          ) : results.length > 0 ? (
            <div className="search-results-list">
              {results.map((item) => {
                const theme = NODE_TYPE_THEMES[item.type];
                return (
                  <button
                    key={item.id}
                    type="button"
                    className="search-result-item"
                    onClick={() => handleSelect(item.id)}
                  >
                    <div className="result-icon-box">{getNodeIcon(item.type)}</div>
                    <div className="result-info">
                      <span className="result-label">{item.label}</span>
                      <span className="result-sub">
                        {item.type.toUpperCase()}{" "}
                        {item.metadata?.album ? `• ${String(item.metadata.album)}` : ""}{" "}
                        {item.listeningCount ? `• ${item.listeningCount} plays` : ""}
                      </span>
                    </div>
                    <span
                      className="result-badge"
                      style={{
                        backgroundColor: theme.badgeBg,
                        color: theme.primary,
                        borderColor: theme.border,
                      }}
                    >
                      {theme.label}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="search-empty-state">
              <p className="empty-state-title">No cosmic entities found</p>
              <p className="empty-state-hint">
                Try searching for "Tame Impala", "Daft Punk", or paste any public Spotify playlist link to generate a custom universe.
              </p>
              {onOpenImport && (
                <button
                  type="button"
                  className="search-empty-import-btn"
                  onClick={() => {
                    onOpenImport();
                    setIsOpen(false);
                  }}
                >
                  <Sparkles size={13} className="sparkle-icon" />
                  <span>Open Spotify Playlist Importer</span>
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
