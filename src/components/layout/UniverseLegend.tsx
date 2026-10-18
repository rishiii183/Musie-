import React, { useState } from "react";
import { Info, ChevronDown, ChevronUp } from "lucide-react";

export const UniverseLegend: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className="universe-legend-card" aria-label="Universe Legend">
      <div
        className="legend-header"
        onClick={() => setCollapsed(!collapsed)}
        role="button"
        tabIndex={0}
      >
        <div className="legend-title-box">
          <Info size={14} className="legend-icon" />
          <span className="legend-heading">Galaxy Legend</span>
        </div>
        <button
          type="button"
          className="legend-collapse-btn"
          aria-label={collapsed ? "Expand legend" : "Collapse legend"}
        >
          {collapsed ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {!collapsed && (
        <div className="legend-body">
          {/* Node Entities */}
          <div className="legend-section">
            <span className="legend-section-title">Celestial Entities</span>
            <div className="legend-item">
              <span className="legend-dot dot-genre" />
              <div className="legend-desc">
                <strong>Genre Supercluster</strong>
                <span>Pulsing core with planetary halo</span>
              </div>
            </div>
            <div className="legend-item">
              <span className="legend-dot dot-artist" />
              <div className="legend-desc">
                <strong>Artist Star</strong>
                <span>Cyan orbital solar center</span>
              </div>
            </div>
            <div className="legend-item">
              <span className="legend-dot dot-track" />
              <div className="legend-desc">
                <strong>Track Satellite</strong>
                <span>Golden orbiting celestial body</span>
              </div>
            </div>
          </div>

          {/* Relational Lines */}
          <div className="legend-section">
            <span className="legend-section-title">Gravitational Edges</span>
            <div className="legend-item">
              <span className="legend-line line-artist-track" />
              <span className="legend-line-label">Artist ↔ Track performance</span>
            </div>
            <div className="legend-item">
              <span className="legend-line line-artist-genre" />
              <span className="legend-line-label">Artist ↔ Genre association</span>
            </div>
            <div className="legend-item">
              <span className="legend-line line-related" />
              <span className="legend-line-label">Related Artist affinity</span>
            </div>
          </div>

          {/* Activity Scaling */}
          <div className="legend-footer">
            <span className="legend-note">
              • Node radius scales with demo play counts
            </span>
          </div>
        </div>
      )}
    </aside>
  );
};
