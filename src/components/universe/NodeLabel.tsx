import React from "react";
import { Html } from "@react-three/drei";
import type { MusicNode } from "../../domain/musicGraph.types";
import { NODE_TYPE_THEMES } from "../../domain/graphSelectors";

interface NodeLabelProps {
  node: MusicNode;
  visible: boolean;
  isSelected: boolean;
  isNeighbor: boolean;
  isHovered: boolean;
}

export const NodeLabel: React.FC<NodeLabelProps> = ({
  node,
  visible,
  isSelected,
  isNeighbor,
  isHovered,
}) => {
  if (!visible && !isSelected && !isNeighbor && !isHovered) {
    return null;
  }

  const theme = NODE_TYPE_THEMES[node.type];
  const isPriority = isSelected || isHovered;

  return (
    <Html
      center
      distanceFactor={45}
      style={{
        pointerEvents: "none",
        userSelect: "none",
        transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        transform: `translate3d(0, ${isPriority ? "-24px" : "-18px"}, 0)`,
        zIndex: isSelected ? 100 : isHovered ? 90 : 10,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          padding: isPriority ? "4px 10px" : "2px 8px",
          background: isSelected
            ? "rgba(15, 23, 42, 0.92)"
            : "rgba(15, 23, 42, 0.78)",
          border: `1px solid ${isSelected ? theme.primary : isNeighbor ? theme.border : "rgba(255, 255, 255, 0.15)"}`,
          borderRadius: "9999px",
          boxShadow: isSelected
            ? `0 0 16px ${theme.glow}, 0 4px 12px rgba(0, 0, 0, 0.5)`
            : "0 2px 8px rgba(0, 0, 0, 0.4)",
          backdropFilter: "blur(6px)",
          whiteSpace: "nowrap",
        }}
      >
        <span
          style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            backgroundColor: theme.primary,
            boxShadow: `0 0 6px ${theme.primary}`,
          }}
        />
        <span
          style={{
            fontSize: isPriority ? "12px" : "11px",
            fontWeight: isPriority ? 600 : 500,
            color: "#f8fafc",
            letterSpacing: "0.01em",
          }}
        >
          {node.label}
        </span>
        {isPriority && node.listeningCount !== undefined && (
          <span
            style={{
              fontSize: "10px",
              color: "#94a3b8",
              marginLeft: "2px",
            }}
          >
            {node.listeningCount} plays
          </span>
        )}
      </div>
    </Html>
  );
};
