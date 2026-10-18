import React from "react";
import { Compass, XCircle, Tag, MousePointer } from "lucide-react";

interface UniverseControlsProps {
  hasSelection: boolean;
  showLabels: boolean;
  onClearSelection: () => void;
  onResetCamera: () => void;
  onToggleLabels: () => void;
}

export const UniverseControls: React.FC<UniverseControlsProps> = ({
  hasSelection,
  showLabels,
  onClearSelection,
  onResetCamera,
  onToggleLabels,
}) => {
  return (
    <div className="universe-controls-overlay">
      <div className="controls-button-group">
        {hasSelection && (
          <button
            type="button"
            className="ctrl-btn btn-clear"
            onClick={onClearSelection}
            title="Clear current selection (Esc)"
          >
            <XCircle size={15} />
            <span>Clear Focus</span>
          </button>
        )}

        <button
          type="button"
          className="ctrl-btn"
          onClick={onResetCamera}
          title="Reset camera to galaxy overview"
        >
          <Compass size={15} />
          <span>Reset View</span>
        </button>

        <button
          type="button"
          className={`ctrl-btn ${showLabels ? "active" : ""}`}
          onClick={onToggleLabels}
          title="Toggle 3D world labels"
        >
          <Tag size={15} />
          <span>{showLabels ? "Hide Labels" : "Show Labels"}</span>
        </button>
      </div>

      <div className="controls-hint">
        <MousePointer size={12} className="hint-icon" />
        <span>Drag to orbit • Right-drag to pan • Scroll to zoom</span>
      </div>
    </div>
  );
};
