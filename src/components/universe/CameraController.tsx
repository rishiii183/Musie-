import React, { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";

interface CameraControllerProps {
  focusTarget: [number, number, number] | null;
  resetTrigger: number;
}

const DEFAULT_CAMERA_POS = new THREE.Vector3(0, 15, 52);
const DEFAULT_TARGET_POS = new THREE.Vector3(0, 0, 0);

export const CameraController: React.FC<CameraControllerProps> = ({
  focusTarget,
  resetTrigger,
}) => {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { camera } = useThree();

  // Animation targets
  const targetLookAt = useRef<THREE.Vector3>(DEFAULT_TARGET_POS.clone());
  const targetCamPos = useRef<THREE.Vector3>(DEFAULT_CAMERA_POS.clone());
  const isTransitioning = useRef<boolean>(false);

  // When focusTarget changes (node clicked or searched)
  useEffect(() => {
    if (focusTarget) {
      const [tx, ty, tz] = focusTarget;
      targetLookAt.current.set(tx, ty, tz);

      // Offset camera position back from node to avoid clipping
      const currentDir = camera.position.clone().sub(new THREE.Vector3(tx, ty, tz)).normalize();
      if (currentDir.lengthSq() < 0.001) {
        currentDir.set(0, 0.4, 1).normalize();
      }

      // Safe viewing distance of 14 units
      const offsetPos = new THREE.Vector3(tx, ty, tz).add(currentDir.multiplyScalar(15));
      targetCamPos.current.copy(offsetPos);
      isTransitioning.current = true;
    }
  }, [focusTarget, camera]);

  // When reset trigger increments
  useEffect(() => {
    if (resetTrigger > 0) {
      targetLookAt.current.copy(DEFAULT_TARGET_POS);
      targetCamPos.current.copy(DEFAULT_CAMERA_POS);
      isTransitioning.current = true;
    }
  }, [resetTrigger]);

  useFrame((_, delta) => {
    if (!isTransitioning.current || !controlsRef.current) return;

    // Smooth lerp damping
    const t = Math.min(1, delta * 3.5);
    camera.position.lerp(targetCamPos.current, t);
    controlsRef.current.target.lerp(targetLookAt.current, t);
    controlsRef.current.update();

    const distPos = camera.position.distanceTo(targetCamPos.current);
    const distTarget = controlsRef.current.target.distanceTo(targetLookAt.current);

    if (distPos < 0.1 && distTarget < 0.1) {
      isTransitioning.current = false;
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.06}
      minDistance={6}
      maxDistance={120}
      rotateSpeed={0.8}
      zoomSpeed={1.0}
      panSpeed={0.8}
    />
  );
};
