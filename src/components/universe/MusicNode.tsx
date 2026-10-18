import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import type { MusicNode as MusicNodeType } from "../../domain/musicGraph.types";
import { calculateNodeRadius } from "../../domain/graphValidation";
import { NODE_TYPE_THEMES } from "../../domain/graphSelectors";
import { getRadialGlowTexture } from "./glowTexture";
import { NodeLabel } from "./NodeLabel";

interface MusicNodeProps {
  node: MusicNodeType;
  isSelected: boolean;
  isNeighbor: boolean;
  isHovered: boolean;
  isDimmed: boolean;
  showLabels: boolean;
  onSelect: (nodeId: string) => void;
  onHover: (nodeId: string | null) => void;
}

export const MusicNode: React.FC<MusicNodeProps> = ({
  node,
  isSelected,
  isNeighbor,
  isHovered,
  isDimmed,
  showLabels,
  onSelect,
  onHover,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const spriteRef = useRef<THREE.Sprite>(null);
  const coreRef = useRef<THREE.Mesh>(null);

  const radius = useMemo(() => calculateNodeRadius(node), [node]);
  const glowTexture = useMemo(() => getRadialGlowTexture(), []);

  // Use custom node color if assigned, otherwise fallback to theme
  const nodeColorHex = node.color || NODE_TYPE_THEMES[node.type].primary;
  const color = useMemo(() => new THREE.Color(nodeColorHex), [nodeColorHex]);

  // Halo sprite scale: ~4x the inner core for that soft cosmic nebula aura
  const spriteScale = useMemo(() => radius * 4.6, [radius]);

  // Gentle organic breathing animation without React state re-renders
  useFrame((state, delta) => {
    if (!groupRef.current) return;

    if (isSelected || isHovered) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.06;
      groupRef.current.scale.lerp(new THREE.Vector3(pulse * 1.15, pulse * 1.15, pulse * 1.15), delta * 8);
    } else {
      groupRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), delta * 6);
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onSelect(node.id);
  };

  const handlePointerOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    document.body.style.cursor = "pointer";
    onHover(node.id);
  };

  const handlePointerOut = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    document.body.style.cursor = "auto";
    onHover(null);
  };

  if (!node.position) return null;

  const targetOpacity = isDimmed ? 0.18 : 1.0;
  const haloOpacity = isDimmed ? 0.12 : isSelected ? 0.95 : isHovered ? 0.85 : 0.72;

  return (
    <group ref={groupRef} position={node.position}>
      {/* 1. Outer Soft Radial Glow Halo (Additive blending for nebula blending) */}
      <sprite
        ref={spriteRef}
        scale={[spriteScale, spriteScale, 1]}
      >
        <spriteMaterial
          map={glowTexture}
          color={color}
          transparent
          opacity={haloOpacity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </sprite>

      {/* 2. Inner Luminous Core Sphere */}
      <mesh
        ref={coreRef}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <sphereGeometry args={[radius * 0.52, 24, 24]} />
        <meshBasicMaterial
          color="#ffffff"
          transparent
          opacity={targetOpacity * 0.95}
        />
      </mesh>

      {/* 3. Mid-layer Color Core */}
      <mesh>
        <sphereGeometry args={[radius * 0.82, 24, 24]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={targetOpacity * 0.75}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* 4. Crisp floating typography label */}
      <NodeLabel
        node={node}
        visible={showLabels}
        isSelected={isSelected}
        isNeighbor={isNeighbor}
        isHovered={isHovered}
        radius={radius}
      />
    </group>
  );
};
