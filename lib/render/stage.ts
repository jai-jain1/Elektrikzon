// Shared pieces for the offline render studio (/render, dev only): scene
// types, the studio environment, lights and small mesh helpers.
// Units are centimetres unless a scene says otherwise.
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { glowTexture } from "@/lib/three/textures";

export interface Built {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  /** Custom render at the given pixel size (the showroom uses bloom); default is a plain render. */
  render?: (width: number, height: number) => void;
  dispose?: () => void;
}

export interface SceneDef {
  id: string;
  file: string;
  width: number;
  height: number;
  exposure?: number;
  build: (renderer: THREE.WebGLRenderer) => Built;
}

let areaInit = false;
let envTex: THREE.Texture | null = null;

export function studio(renderer: THREE.WebGLRenderer, background = "#000000", envStrength = 0.35) {
  if (!areaInit) {
    RectAreaLightUniformsLib.init();
    areaInit = true;
  }
  if (!envTex) {
    const pmrem = new THREE.PMREMGenerator(renderer);
    envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  }
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(background);
  scene.environment = envTex;
  scene.userData.envStrength = envStrength;
  return scene;
}

/** Scale every material's reflection strength (RoomEnvironment is bright). */
export function finalize(scene: THREE.Scene) {
  const k = scene.userData.envStrength as number;
  scene.traverse((o) => {
    const mesh = o as THREE.Mesh;
    if (!mesh.isMesh) return;
    const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
    mats.forEach((m) => {
      const std = m as THREE.MeshStandardMaterial;
      if ("envMapIntensity" in std) std.envMapIntensity = (std.envMapIntensity ?? 1) * k;
    });
  });
  return scene;
}

export function cam(fov: number, w: number, h: number, pos: [number, number, number], look: [number, number, number]) {
  const c = new THREE.PerspectiveCamera(fov, w / h, 0.1, 2000);
  c.position.set(...pos);
  c.lookAt(...look);
  return c;
}

export function spot(color: string, intensity: number, pos: [number, number, number], target: [number, number, number], angle = 0.5, penumbra = 0.9, shadow = true) {
  const s = new THREE.SpotLight(color, intensity, 0, angle, penumbra, 2);
  s.position.set(...pos);
  s.target.position.set(...target);
  if (shadow) {
    s.castShadow = true;
    s.shadow.mapSize.set(2048, 2048);
    s.shadow.bias = -0.0002;
    s.shadow.radius = 8;
  }
  return s;
}

export function area(color: string, intensity: number, w: number, h: number, pos: [number, number, number], look: [number, number, number]) {
  const a = new THREE.RectAreaLight(color, intensity, w, h);
  a.position.set(...pos);
  a.lookAt(...look);
  return a;
}

export function wall(mat: THREE.Material, w: number, h: number, z = 0) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
  m.position.z = z;
  m.receiveShadow = true;
  return m;
}

/** Renders the scene with a soft bloom, so lit diffusers and LEDs glow like the real thing. */
export function glowing(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera, strength = 0.32, radius = 0.65, threshold = 0.9): Built {
  let composer: EffectComposer | null = null;
  return {
    scene,
    camera,
    render: (w, h) => {
      if (!composer) {
        composer = new EffectComposer(renderer, new THREE.WebGLRenderTarget(w, h, { type: THREE.HalfFloatType, samples: 4 }));
        composer.setPixelRatio(1);
        composer.setSize(w, h);
        composer.addPass(new RenderPass(scene, camera));
        composer.addPass(new UnrealBloomPass(new THREE.Vector2(w, h), strength, radius, threshold));
        composer.addPass(new OutputPass());
      }
      composer.render();
    },
    dispose: () => {
      composer?.dispose();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.isMesh) m.geometry.dispose();
      });
    },
  };
}

/** A mesh that casts and receives shadows, placed at x, y, z. */
export function part(geo: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0) {
  const m = new THREE.Mesh(geo, mat);
  m.position.set(x, y, z);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}

/** A surface that gives off light (a diffuser, an LED chip). */
export const emissive = (color: string, intensity: number) => new THREE.MeshStandardMaterial({ color: "#ffffff", emissive: color, emissiveIntensity: intensity, roughness: 0.8 });

let glowTex: THREE.Texture | null = null;

/** Camera-facing halo. */
export function halo(color: string, size: number, opacity: number, x: number, y: number, z: number, tall = size) {
  glowTex ??= glowTexture();
  const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color, blending: THREE.AdditiveBlending, opacity, depthWrite: false }));
  s.scale.set(size, tall, 1);
  s.position.set(x, y, z);
  return s;
}

/** Soft pool of light lying on the floor (y = 0). */
export function pool(color: string, w: number, d: number, opacity: number, x: number, z: number, turn = 0) {
  glowTex ??= glowTexture();
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, d), new THREE.MeshBasicMaterial({ map: glowTex, color, blending: THREE.AdditiveBlending, transparent: true, opacity, depthWrite: false }));
  m.rotation.set(-Math.PI / 2, 0, turn);
  m.position.set(x, 0.03, z);
  return m;
}

/** The product stage: black backdrop, a dark satin floor, a soft key light, a cool rim light and a weak front fill. */
export function stage(renderer: THREE.WebGLRenderer, envStrength = 0.45) {
  const scene = studio(renderer, "#000000", envStrength);
  // Large and barely reflective, so it fades to black rather than showing a horizon.
  const floor = new THREE.Mesh(new THREE.CircleGeometry(1500, 64), new THREE.MeshStandardMaterial({ color: "#0c0c0d", roughness: 0.42, envMapIntensity: 0.12 }));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  scene.add(floor);
  const key = spot("#ffffff", 9000, [-32, 62, 38], [0, 4, 0], 0.45, 1);
  scene.add(key, key.target, area("#dfe6ff", 3, 40, 14, [34, 26, -30], [0, 6, 0]), area("#ffffff", 1.1, 70, 40, [0, 34, 80], [0, 5, 0]));
  return scene;
}
