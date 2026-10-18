import React, { useRef, useEffect } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import * as THREE from "three";

interface CameraControllerProps {
  focusTarget: [number, number, number] | null;
  resetTrigger: number;
}

const DEFAULT_CAMERA_POS = new THREE.Vector3(0, 10, 56);
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

  // Active keyboard keys state for WASD / QE fly navigation
  const keysPressed = useRef<Record<string, boolean>>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      keysPressed.current[e.key.toLowerCase()] = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysPressed.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // When focusTarget changes (node clicked or searched)
  useEffect(() => {
    if (focusTarget) {
      const [tx, ty, tz] = focusTarget;
      targetLookAt.current.set(tx, ty, tz);

      // Offset camera position back from node to avoid clipping
      const currentDir = camera.position.clone().sub(new THREE.Vector3(tx, ty, tz)).normalize();
      if (currentDir.lengthSq() < 0.001) {
        currentDir.set(0, 0.35, 1).normalize();
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
    if (!controlsRef.current) return;

    // 1. Smooth lerping when transitioning to target or reset
    if (isTransitioning.current) {
      const t = Math.min(1, delta * 3.8);
      camera.position.lerp(targetCamPos.current, t);
      controlsRef.current.target.lerp(targetLookAt.current, t);
      controlsRef.current.update();

      const distPos = camera.position.distanceTo(targetCamPos.current);
      const distTarget = controlsRef.current.target.distanceTo(targetLookAt.current);

      if (distPos < 0.1 && distTarget < 0.1) {
        isTransitioning.current = false;
      }
      return;
    }

    // 2. Keyboard fly navigation (W A S D to fly, Q E up/down)
    const moveSpeed = 24 * delta;
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(camera.up, forward).negate().normalize();

    const moveDelta = new THREE.Vector3(0, 0, 0);

    if (keysPressed.current["w"]) moveDelta.addScaledVector(forward, moveSpeed);
    if (keysPressed.current["s"]) moveDelta.addScaledVector(forward, -moveSpeed);
    if (keysPressed.current["d"]) moveDelta.addScaledVector(right, moveSpeed);
    if (keysPressed.current["a"]) moveDelta.addScaledVector(right, -moveSpeed);
    if (keysPressed.current["e"]) moveDelta.y += moveSpeed;
    if (keysPressed.current["q"]) moveDelta.y -= moveSpeed;

    if (moveDelta.lengthSq() > 0) {
      camera.position.add(moveDelta);
      controlsRef.current.target.add(moveDelta);
      controlsRef.current.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      enableDamping
      dampingFactor={0.065}
      minDistance={5}
      maxDistance={140}
      rotateSpeed={0.8}
      zoomSpeed={1.0}
      panSpeed={0.85}
    />
  );
};
