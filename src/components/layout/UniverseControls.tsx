import React from "react";
import { XCircle } from "lucide-react";

interface UniverseControlsProps {
  hasSelection: boolean;
  showLabels: boolean;
  onClearSelection: () => void;
  onResetCamera: () => void;
  onToggleLabels: () => void;
}

export const UniverseControls: React.FC<UniverseControlsProps> = ({
  hasSelection,
  onClearSelection,
}) => {
  return (
    <footer className="universe-bottom-guide" aria-label="Navigation controls guide">
      {hasSelection && (
        <button
          type="button"
          className="bottom-clear-focus-btn"
          onClick={onClearSelection}
          title="Clear active node selection (Esc)"
        >
          <XCircle size={13} />
          <span>Clear Focus</span>
        </button>
      )}

      <div className="bottom-key-nav-hint">
        <span><strong>Drag</strong> to orbit</span>
        <span className="dot-sep">·</span>
        <span><strong>Scroll</strong> to zoom</span>
        <span className="dot-sep">·</span>
        <span><strong>W A S D</strong> to fly</span>
        <span className="dot-sep">·</span>
        <span><strong>Q E</strong> up/down</span>
        <span className="dot-sep">·</span>
        <span><strong>Click</strong> a node</span>
      </div>
    </footer>
  );
};
