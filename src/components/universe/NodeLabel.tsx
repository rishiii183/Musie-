import React from "react";
import { Html } from "@react-three/drei";
import type { MusicNode } from "../../domain/musicGraph.types";

interface NodeLabelProps {
  node: MusicNode;
  visible: boolean;
  isSelected: boolean;
  isNeighbor: boolean;
  isHovered: boolean;
  radius: number;
}

export const NodeLabel: React.FC<NodeLabelProps> = ({
  node,
  visible,
  isSelected,
  isNeighbor,
  isHovered,
}) => {
  // Always show if label visibility is enabled, or if hovered/selected/neighbor
  if (!visible && !isSelected && !isNeighbor && !isHovered) {
    return null;
  }

  const isPriority = isSelected || isHovered;
  const isMajor = node.type === "genre" || (node.listeningCount && node.listeningCount > 150);

  const fontSize = isMajor ? (isPriority ? "16px" : "14px") : isPriority ? "13px" : "11px";
  const fontWeight = isMajor ? 700 : isPriority ? 600 : 500;
  const opacity = isSelected ? 1.0 : isHovered ? 1.0 : isNeighbor ? 0.95 : 0.88;

  return (
    <Html
      center
      distanceFactor={48}
      style={{
        pointerEvents: "none",
        userSelect: "none",
        transition: "opacity 0.2s ease, transform 0.2s ease",
        zIndex: isSelected ? 100 : isHovered ? 90 : 10,
        opacity,
      }}
    >
      <div
        style={{
          fontFamily: "'Space Grotesk', 'Plus Jakarta Sans', system-ui, sans-serif",
          fontSize,
          fontWeight,
          color: "#ffffff",
          textAlign: "center",
          whiteSpace: "nowrap",
          textShadow:
            "0 1px 4px rgba(0, 0, 0, 0.95), 0 0 10px rgba(0, 0, 0, 0.9), 0 0 20px rgba(0, 0, 0, 0.75)",
          letterSpacing: isMajor ? "0.01em" : "0",
          transform: isPriority ? "scale(1.08)" : "scale(1)",
          lineHeight: 1.15,
        }}
      >
        {node.label}
      </div>
    </Html>
  );
};
