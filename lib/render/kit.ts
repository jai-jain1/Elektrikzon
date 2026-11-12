// Offline render kit (development only, used by /render): materials and
// helpers for the studio product renders. Units are centimetres.
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { noiseTexture } from "@/lib/three/textures";

export { brushedTexture, glowTexture, noiseTexture } from "@/lib/three/textures";

let plasterBump: THREE.Texture | null = null;
export function plaster(color = "#2b2b2d", repeat = 2) {
  plasterBump ??= noiseTexture(1024);
  const bump = plasterBump.clone();
  bump.needsUpdate = true;
  bump.repeat.set(repeat, repeat);
  return new THREE.MeshStandardMaterial({ color, roughness: 0.96, metalness: 0, bumpMap: bump, bumpScale: 2.2 });
}

export function roundedBox(w: number, h: number, d: number, r: number, mat: THREE.Material) {
  const m = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 5, r), mat);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}
