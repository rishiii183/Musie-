import * as THREE from "three";

/**
 * Creates a high-resolution radial soft glow texture dynamically using an offscreen canvas.
 * This delivers authentic nebula / star bloom without expensive post-processing passes.
 */
let cachedGlowTexture: THREE.CanvasTexture | null = null;

export function getRadialGlowTexture(): THREE.CanvasTexture {
  if (cachedGlowTexture) return cachedGlowTexture;

  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    gradient.addColorStop(0.18, "rgba(255, 255, 255, 0.85)");
    gradient.addColorStop(0.42, "rgba(255, 255, 255, 0.45)");
    gradient.addColorStop(0.72, "rgba(255, 255, 255, 0.15)");
    gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  cachedGlowTexture = texture;
  return texture;
}
