import React from "react";
import {
  X,
  Radio,
  Mic2,
  Disc3,
  Calendar,
  Clock,
  Globe,
  Users,
  Activity,
  Layers,
  Sparkles,
} from "lucide-react";
import type { MusicNode, GraphNeighborMap } from "../../domain/musicGraph.types";
import { NODE_TYPE_THEMES } from "../../domain/graphSelectors";

interface EntityDetailsPanelProps {
  node: MusicNode | null;
  neighbors: GraphNeighborMap;
  onSelectNode: (nodeId: string) => void;
  onClose: () => void;
}

export const EntityDetailsPanel: React.FC<EntityDetailsPanelProps> = ({
  node,
  neighbors,
  onSelectNode,
  onClose,
}) => {
  if (!node) return null;

  const theme = NODE_TYPE_THEMES[node.type];

  // Group connected nodes by type
  const connectedGenres = neighbors.connectedNodes.filter((n) => n.type === "genre");
  const connectedArtists = neighbors.connectedNodes.filter((n) => n.type === "artist");
  const connectedTracks = neighbors.connectedNodes.filter((n) => n.type === "track");

  const getNodeIcon = () => {
    switch (node.type) {
      case "genre":
        return <Radio size={22} className="text-purple" />;
      case "artist":
        return <Mic2 size={22} className="text-cyan" />;
      case "track":
      default:
        return <Disc3 size={22} className="text-amber" />;
    }
  };

  return (
    <aside className="entity-panel-container" aria-label="Entity Details Panel">
      <div className="panel-card">
        {/* Header Bar */}
        <div className="panel-header">
          <div className="panel-type-badge-row">
            <span
              className="panel-type-badge"
              style={{
                backgroundColor: theme.badgeBg,
                color: theme.primary,
                borderColor: theme.border,
              }}
            >
              {theme.label}
            </span>

            <span className="panel-origin-badge">
              <span className="origin-dot" />
              Demo Sourced
            </span>
          </div>

          <button
            type="button"
            className="panel-close-btn"
            onClick={onClose}
            aria-label="Close details panel"
          >
            <X size={16} />
          </button>
        </div>

        {/* Main Entity Title */}
        <div className="panel-title-section">
          <div className="entity-avatar-box" style={{ borderColor: theme.primary }}>
            {getNodeIcon()}
          </div>
          <div className="entity-title-info">
            <h2 className="entity-name">{node.label}</h2>
            {node.metadata?.album && (
              <p className="entity-subname">Album: {String(node.metadata.album)}</p>
            )}
          </div>
        </div>

        {/* Metric / Activity Stat */}
        <div className="panel-stats-card">
          <div className="stat-metric-row">
            <div className="metric-icon-box">
              <Activity size={18} style={{ color: theme.primary }} />
            </div>
            <div className="metric-content">
              <span className="metric-value">
                {node.listeningCount !== undefined ? node.listeningCount : "Unknown"}
              </span>
              <span className="metric-label">Demo Listening Plays</span>
            </div>
          </div>
          <p className="metric-disclaimer">
            * Count derived from sample demo session data
          </p>
        </div>

        {/* Metadata Details */}
        {node.metadata && Object.keys(node.metadata).length > 0 && (
          <div className="panel-meta-section">
            <h3 className="section-title">Attributes</h3>
            <div className="meta-grid">
              {node.metadata.releaseYear && (
                <div className="meta-item">
                  <Calendar size={13} className="meta-icon" />
                  <span className="meta-label">Year:</span>
                  <span className="meta-val">{String(node.metadata.releaseYear)}</span>
                </div>
              )}
              {node.metadata.duration && (
                <div className="meta-item">
                  <Clock size={13} className="meta-icon" />
                  <span className="meta-label">Length:</span>
                  <span className="meta-val">{String(node.metadata.duration)}</span>
                </div>
              )}
              {node.metadata.country && (
                <div className="meta-item">
                  <Globe size={13} className="meta-icon" />
                  <span className="meta-label">Origin:</span>
                  <span className="meta-val">{String(node.metadata.country)}</span>
                </div>
              )}
              {node.metadata.monthlyListeners && (
                <div className="meta-item">
                  <Users size={13} className="meta-icon" />
                  <span className="meta-label">Followers:</span>
                  <span className="meta-val">{String(node.metadata.monthlyListeners)}</span>
                </div>
              )}
              {node.metadata.mood && (
                <div className="meta-item wide">
                  <Sparkles size={13} className="meta-icon" />
                  <span className="meta-label">Vibe:</span>
                  <span className="meta-val">{String(node.metadata.mood)}</span>
                </div>
              )}
              {node.metadata.description && (
                <div className="meta-item wide description">
                  <p>{String(node.metadata.description)}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Gravitational Connected Nodes */}
        <div className="panel-connections-section">
          <div className="section-header-row">
            <Layers size={14} className="section-icon" />
            <h3 className="section-title">
              Connected Orbit ({neighbors.connectedNodes.length})
            </h3>
          </div>

          {neighbors.connectedNodes.length === 0 ? (
            <p className="empty-connections-hint">No direct orbital connections</p>
          ) : (
            <div className="connections-groups-container">
              {/* Connected Genres */}
              {connectedGenres.length > 0 && (
                <div className="conn-subgroup">
                  <span className="conn-subgroup-title text-purple">Genres</span>
                  <div className="conn-chips-list">
                    {connectedGenres.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className="conn-chip chip-genre"
                        onClick={() => onSelectNode(item.id)}
                      >
                        <Radio size={12} />
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Connected Artists */}
              {connectedArtists.length > 0 && (
                <div className="conn-subgroup">
                  <span className="conn-subgroup-title text-cyan">Artists</span>
                  <div className="conn-chips-list">
                    {connectedArtists.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className="conn-chip chip-artist"
                        onClick={() => onSelectNode(item.id)}
                      >
                        <Mic2 size={12} />
                        <span>{item.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Connected Tracks */}
              {connectedTracks.length > 0 && (
                <div className="conn-subgroup">
                  <span className="conn-subgroup-title text-amber">Tracks</span>
                  <div className="conn-chips-list">
                    {connectedTracks.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        className="conn-chip chip-track"
                        onClick={() => onSelectNode(item.id)}
                      >
                        <Disc3 size={12} />
                        <span>{item.label}</span>
                        {item.listeningCount !== undefined && (
                          <span className="chip-metric">{item.listeningCount}</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
