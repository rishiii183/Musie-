import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface StarfieldProps {
  count?: number;
}

// Generate static celestial star coordinates once outside render
function generateStarBuffers(count: number) {
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const sz = new Float32Array(count);

  const cosmicPalette = [
    new THREE.Color("#ffffff"),
    new THREE.Color("#93c5fd"), // Soft cyan-blue
    new THREE.Color("#c084fc"), // Soft violet
    new THREE.Color("#fde68a"), // Pale gold
    new THREE.Color("#e2e8f0"), // Diamond white
  ];

  // Deterministic generator
  let seed = 42;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  for (let i = 0; i < count; i++) {
    const r = 40 + rand() * 120;
    const theta = rand() * Math.PI * 2;
    const phi = Math.acos(rand() * 2 - 1);

    pos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    pos[i * 3 + 2] = r * Math.cos(phi);

    const color = cosmicPalette[Math.floor(rand() * cosmicPalette.length)];
    col[i * 3] = color.r;
    col[i * 3 + 1] = color.g;
    col[i * 3 + 2] = color.b;

    sz[i] = rand() * 1.8 + 0.6;
  }

  return { positions: pos, colors: col, sizes: sz };
}

const STATIC_STARFIELD = generateStarBuffers(2400);

export const Starfield: React.FC<StarfieldProps> = () => {
  const pointsRef = useRef<THREE.Points>(null);

  // Gentle cosmic drift
  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.012;
      pointsRef.current.rotation.x += delta * 0.004;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[STATIC_STARFIELD.positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[STATIC_STARFIELD.colors, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[STATIC_STARFIELD.sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.8}
        vertexColors
        transparent
        opacity={0.65}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
};
