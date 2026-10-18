import React, { useState, useRef, useEffect } from "react";
import { Search, X, Disc3, Mic2, Radio } from "lucide-react";
import type { MusicNode } from "../../domain/musicGraph.types";
import { NODE_TYPE_THEMES } from "../../domain/graphSelectors";

interface SearchBarProps {
  nodes: MusicNode[];
  onSelectNode: (nodeId: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ nodes, onSelectNode }) => {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const trimmed = query.trim().toLowerCase();

  const results = React.useMemo(() => {
    if (!trimmed) return [];
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
  }, [nodes, trimmed]);

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
          placeholder="Search artists, tracks, genres..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          aria-label="Search universe"
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
          {results.length > 0 ? (
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
                Try searching for "Tame Impala", "Daft Punk", "Blonde", or "Indie Rock".
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
