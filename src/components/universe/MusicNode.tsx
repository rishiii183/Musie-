import React, { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import type { MusicNode as MusicNodeType } from "../../domain/musicGraph.types";
import { calculateNodeRadius } from "../../domain/graphValidation";
import { NODE_TYPE_THEMES } from "../../domain/graphSelectors";
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
  const meshRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const glowRingRef = useRef<THREE.Mesh>(null);

  const radius = useMemo(() => calculateNodeRadius(node), [node]);
  const theme = NODE_TYPE_THEMES[node.type];
  const color = useMemo(() => new THREE.Color(theme.primary), [theme.primary]);

  // Subtle breathing / pulse effect in 3D without triggering React renders
  useFrame((state, delta) => {
    if (ringRef.current) {
      ringRef.current.rotation.z += delta * (node.type === "genre" ? 0.35 : 0.6);
      ringRef.current.rotation.x += delta * 0.15;
    }

    if (glowRingRef.current && isSelected) {
      glowRingRef.current.rotation.z -= delta * 0.8;
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.08;
      glowRingRef.current.scale.set(pulse, pulse, pulse);
    }

    if (meshRef.current && (isSelected || isHovered)) {
      const targetScale = isSelected ? 1.25 : 1.15;
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        delta * 8
      );
    } else if (meshRef.current) {
      meshRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), delta * 8);
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

  const targetOpacity = isDimmed ? 0.22 : 1.0;
  const isPriority = isSelected || isNeighbor || isHovered;

  return (
    <group position={node.position}>
      {/* Central Node Sphere */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <sphereGeometry args={[radius, 24, 24]} />
        <meshStandardMaterial
          color={color}
          roughness={0.25}
          metalness={0.4}
          emissive={color}
          emissiveIntensity={isSelected ? 0.9 : isPriority ? 0.55 : 0.3}
          transparent
          opacity={targetOpacity}
        />
      </mesh>

      {/* Orbiting Halo Ring for Artists and Genres */}
      {(node.type === "genre" || node.type === "artist" || isSelected) && (
        <mesh ref={ringRef} rotation={[Math.PI / 3, 0, 0]}>
          <ringGeometry args={[radius * 1.35, radius * 1.55, 32]} />
          <meshBasicMaterial
            color={color}
            side={THREE.DoubleSide}
            transparent
            opacity={isDimmed ? 0.12 : isSelected ? 0.75 : 0.4}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Extra Pulsing Selected Ring */}
      {isSelected && (
        <mesh ref={glowRingRef} rotation={[0, Math.PI / 4, 0]}>
          <ringGeometry args={[radius * 1.7, radius * 1.9, 32]} />
          <meshBasicMaterial
            color="#ffffff"
            side={THREE.DoubleSide}
            transparent
            opacity={0.8}
            depthWrite={false}
          />
        </mesh>
      )}

      {/* Floating 3D HTML Label */}
      <NodeLabel
        node={node}
        visible={showLabels || node.type === "genre"}
        isSelected={isSelected}
        isNeighbor={isNeighbor}
        isHovered={isHovered}
      />
    </group>
  );
};
