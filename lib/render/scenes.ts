// Scene definitions for the offline render studio (/render, dev only).
// Each builder returns a scene and camera for one photography slot.
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";
import { buildPlate, glowTexture, noiseTexture, plaster, planTexture, roundedBox, type FinishKey } from "./kit";

export interface Built {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
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

function studio(renderer: THREE.WebGLRenderer, background = "#000000", envStrength = 0.35) {
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
function finalize(scene: THREE.Scene) {
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

function cam(fov: number, w: number, h: number, pos: [number, number, number], look: [number, number, number]) {
  const c = new THREE.PerspectiveCamera(fov, w / h, 0.1, 2000);
  c.position.set(...pos);
  c.lookAt(...look);
  return c;
}

function spot(color: string, intensity: number, pos: [number, number, number], target: [number, number, number], angle = 0.5, penumbra = 0.9, shadow = true) {
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

function area(color: string, intensity: number, w: number, h: number, pos: [number, number, number], look: [number, number, number]) {
  const a = new THREE.RectAreaLight(color, intensity, w, h);
  a.position.set(...pos);
  a.lookAt(...look);
  return a;
}

function wall(mat: THREE.Material, w: number, h: number, z = 0) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
  m.position.z = z;
  m.receiveShadow = true;
  return m;
}

function shadowFloor(size: number, y: number, opacity = 0.55) {
  const m = new THREE.Mesh(new THREE.PlaneGeometry(size, size), new THREE.ShadowMaterial({ opacity }));
  m.rotation.x = -Math.PI / 2;
  m.position.y = y;
  m.receiveShadow = true;
  return m;
}

/* ------------------------------ product scenes ------------------------------ */

const heroPlate: SceneDef = {
  id: "hero",
  file: "hero-plate.webp",
  width: 2400,
  height: 1350,
  exposure: 1.1,
  build: (r) => {
    const scene = studio(r, "#050505", 0.25);
    scene.add(wall(plaster("#262628", 3), 160, 90));
    const { group } = buildPlate(["switch", "switch", "switch", "switch", "socket"], "Graphite");
    group.position.z = 0.3;
    scene.add(group);
    // Raking light from upper left reveals the plaster texture.
    const key = spot("#f3f1ee", 16000, [-42, 26, 9], [4, -3, 0], 0.6, 1);
    scene.add(key, key.target);
    scene.userData.key = key;
    scene.add(area("#dfe3ea", 5, 30, 8, [10, 18, 34], [0, 0, 0]));
    scene.add(new THREE.AmbientLight("#ffffff", 0.05));
    return { scene: finalize(scene), camera: cam(16, 2400, 1350, [4, 1.2, 75], [1.6, 0, 0]) };
  },
};

function finishShot(id: string, file: string, finish: FinishKey): SceneDef {
  return {
    id,
    file,
    width: 1600,
    height: 1600,
    exposure: 1,
    build: (r) => {
      const scene = studio(r, "#000000", finish === "Champagne Gold" || finish === "Silver" ? 0.7 : 0.45);
      const { group } = buildPlate(["switch", "switch", "socket"], finish);
      group.rotation.y = -0.32;
      group.rotation.x = -0.05;
      group.position.y = 0.6;
      scene.add(group);
      scene.add(shadowFloor(80, -4.4, 0.6));
      const key = area("#ffffff", 7, 18, 4, [0, 14, 12], [0, 0, 0]);
      const rim = area("#cfd6e0", 3, 3, 14, [16, 2, -4], [0, 0, 0]);
      const fill = area("#ffffff", 1.2, 14, 10, [-14, 0, 14], [0, 0, 0]);
      const drop = spot("#ffffff", 600, [0, 30, 8], [0, -4, 0], 0.4, 1);
      scene.add(key, rim, fill, drop, drop.target);
      return { scene: finalize(scene), camera: cam(20, 1600, 1600, [0, 3.2, 42], [0, -0.4, 0]) };
    },
  };
}

const lineSwitches: SceneDef = {
  id: "line-switches",
  file: "line-switches.webp",
  width: 1600,
  height: 1200,
  build: (r) => {
    const scene = studio(r, "#000000", 0.5);
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshStandardMaterial({ color: "#0c0c0d", roughness: 0.85, bumpMap: noiseTexture(512), bumpScale: 0.3 }));
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);
    const a = buildPlate(["switch", "switch", "switch", "switch", "socket"], "Graphite").group;
    a.rotation.set(-Math.PI / 2, 0, 0.18);
    a.position.set(-4, 0.3, 1);
    const b = buildPlate(["switch", "switch"], "Matte White").group;
    b.rotation.set(-Math.PI / 2, 0, -0.35);
    b.position.set(9, 0.3, -6);
    const c = buildPlate(["switch", "socket"], "Silver").group;
    c.rotation.set(-Math.PI / 2, 0, 0.55);
    c.position.set(10, 0.3, 8);
    scene.add(a, b, c);
    const key = spot("#ffffff", 3800, [-30, 50, 20], [2, 0, 0], 0.5, 1);
    scene.add(key, key.target, area("#e8ecf2", 2.5, 40, 10, [20, 30, -20], [0, 0, 0]));
    return { scene: finalize(scene), camera: cam(26, 1600, 1200, [0, 48, 34], [3, 0, 1]) };
  },
};

const lineLighting: SceneDef = {
  id: "line-lighting",
  file: "line-lighting.webp",
  width: 1600,
  height: 1200,
  exposure: 0.9,
  build: (r) => {
    const scene = studio(r, "#000000", 0.7);
    const alu = new THREE.MeshPhysicalMaterial({ color: "#2a2a2d", metalness: 0.9, roughness: 0.32 });
    const silverTrim = new THREE.MeshPhysicalMaterial({ color: "#b9bcc1", metalness: 1, roughness: 0.25 });
    const diffMat = new THREE.MeshStandardMaterial({ color: "#ffffff", emissive: "#f6f3ee", emissiveIntensity: 1.6, roughness: 0.9 });
    // Downlight, tilted towards the camera
    const dl = new THREE.Group();
    const body = new THREE.Mesh(new THREE.CylinderGeometry(3.2, 3.0, 3.6, 96, 1, true), alu);
    body.position.y = 1.8;
    const trim = new THREE.Mesh(new THREE.TorusGeometry(3.35, 0.28, 24, 96), silverTrim);
    trim.rotation.x = Math.PI / 2;
    const cone = new THREE.Mesh(
      new THREE.CylinderGeometry(3.05, 2.2, 1.2, 96, 1, true),
      new THREE.MeshPhysicalMaterial({ color: "#d7d9dc", metalness: 1, roughness: 0.2, side: THREE.DoubleSide }),
    );
    cone.position.y = 0.6;
    const diffuser = new THREE.Mesh(new THREE.CircleGeometry(2.2, 96), diffMat);
    diffuser.rotation.x = Math.PI / 2;
    diffuser.position.y = 0.9;
    const back = new THREE.Mesh(new THREE.CircleGeometry(3.2, 96), alu);
    back.rotation.x = -Math.PI / 2;
    back.position.y = 3.6;
    dl.add(body, back, trim, cone, diffuser);
    // Opening (−y) turned towards the camera, tilted slightly down.
    dl.rotation.set(-1.2, 0, 0.18);
    dl.position.set(-1, 4.2, 0);
    dl.traverse((o) => ((o as THREE.Mesh).castShadow = true));
    // Profile light: aluminium bar with a lit diffuser strip
    const prof = new THREE.Group();
    const bar = roundedBox(30, 1.8, 1.8, 0.25, alu);
    const strip = new THREE.Mesh(new THREE.PlaneGeometry(29.2, 1.1), new THREE.MeshStandardMaterial({ color: "#ffffff", emissive: "#f6f3ee", emissiveIntensity: 0.9, roughness: 0.9 }));
    strip.position.z = 0.91;
    prof.add(bar, strip);
    prof.rotation.set(-0.75, 0, -0.06);
    prof.position.set(0, -8.5, -2);
    scene.add(dl, prof);
    const glow = glowTexture();
    const g1 = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: "#fff7ee", blending: THREE.AdditiveBlending, opacity: 0.28, depthWrite: false }));
    g1.scale.set(16, 16, 1);
    g1.position.set(-0.8, 3.4, 2.5);
    const g2 = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: "#fff7ee", blending: THREE.AdditiveBlending, opacity: 0.2, depthWrite: false }));
    g2.scale.set(40, 9, 1);
    g2.position.set(0, -8.5, 0);
    scene.add(g1, g2);
    const key = spot("#ffffff", 5000, [-20, 30, 30], [0, 0, 0], 0.5, 1);
    scene.add(key, key.target, area("#ffffff", 2.5, 30, 6, [10, 20, 20], [0, 0, 0]));
    return { scene: finalize(scene), camera: cam(32, 1600, 1200, [0, 1, 48], [0, -1.5, 0]) };
  },
};

function coil(color: string, turns = 9, R = 3.2, tube = 0.22) {
  const g = new THREE.Group();
  const mat = new THREE.MeshPhysicalMaterial({ color, roughness: 0.32, clearcoat: 0.6, clearcoatRoughness: 0.25 });
  for (let i = 0; i < turns; i++) {
    const t = new THREE.Mesh(new THREE.TorusGeometry(R + (i % 3) * 0.42, tube, 20, 140), mat);
    t.rotation.x = Math.PI / 2;
    t.position.y = Math.floor(i / 3) * 0.44 + (i % 3) * 0.02;
    t.castShadow = true;
    t.receiveShadow = true;
    g.add(t);
  }
  return g;
}

const lineWires: SceneDef = {
  id: "line-wires",
  file: "line-wires.webp",
  width: 1600,
  height: 1200,
  build: (r) => {
    const scene = studio(r, "#000000", 0.45);
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshStandardMaterial({ color: "#121213", roughness: 0.9 }));
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);
    const red = coil("#a3241d");
    red.position.set(-4.5, 0.22, 4.4);
    const black = coil("#202022");
    black.position.set(4.5, 0.22, 4.4);
    const blue = coil("#1f4f9a");
    blue.position.set(-4.5, 0.22, -4.6);
    const grey = coil("#86888c");
    grey.position.set(4.5, 0.22, -4.6);
    scene.add(red, black, blue, grey);
    const key = spot("#ffffff", 2800, [-26, 26, 18], [0, 0, 0], 0.45, 1);
    scene.add(key, key.target, area("#dfe6ef", 3, 20, 4, [18, 10, -10], [0, 0, 0]));
    return { scene: finalize(scene), camera: cam(30, 1600, 1200, [0, 22, 30], [0, 0, 0.5]) };
  },
};

function bladeGeometry() {
  // Tapered paddle with a rounded tip.
  const sh = new THREE.Shape();
  sh.moveTo(4, -2.2);
  sh.lineTo(40, -4.2);
  sh.quadraticCurveTo(48, 0, 40, 4.2);
  sh.lineTo(4, 2.2);
  sh.quadraticCurveTo(2.5, 0, 4, -2.2);
  return new THREE.ExtrudeGeometry(sh, { depth: 0.35, bevelEnabled: true, bevelThickness: 0.12, bevelSize: 0.12, bevelSegments: 3, curveSegments: 24 });
}

const lineFans: SceneDef = {
  id: "line-fans",
  file: "line-fans.webp",
  width: 1600,
  height: 1200,
  exposure: 1.1,
  build: (r) => {
    const scene = studio(r, "#0a0a0b", 0.5);
    const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), plaster("#2c2c2e", 6));
    ceiling.position.z = -30;
    ceiling.receiveShadow = true;
    scene.add(ceiling);
    const matte = new THREE.MeshPhysicalMaterial({ color: "#1e1e20", roughness: 0.45, clearcoat: 0.4, clearcoatRoughness: 0.3 });
    const chrome = new THREE.MeshPhysicalMaterial({ color: "#a9acb1", metalness: 1, roughness: 0.22 });
    const fan = new THREE.Group();
    const canopy = new THREE.Mesh(new THREE.CylinderGeometry(3, 3.4, 2, 64), matte);
    canopy.rotation.x = Math.PI / 2;
    canopy.position.z = -28;
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 18, 24), matte);
    rod.rotation.x = Math.PI / 2;
    rod.position.z = -19;
    const motor = new THREE.Mesh(new THREE.CylinderGeometry(7, 6.4, 5, 128), matte);
    motor.rotation.x = Math.PI / 2;
    const band = new THREE.Mesh(new THREE.TorusGeometry(6.6, 0.18, 16, 128), chrome);
    band.position.z = 1.2;
    const cap = new THREE.Mesh(new THREE.SphereGeometry(2.6, 48, 24, 0, Math.PI * 2, 0, Math.PI / 2), matte);
    cap.rotation.x = Math.PI / 2;
    cap.position.z = 2.5;
    fan.add(canopy, rod, motor, band, cap);
    const geo = bladeGeometry();
    for (let i = 0; i < 3; i++) {
      const blade = new THREE.Mesh(geo, matte);
      blade.rotation.x = 0.14;
      blade.position.z = -0.6;
      const pivot = new THREE.Group();
      pivot.rotation.z = (i * Math.PI * 2) / 3 + 0.5;
      pivot.add(blade);
      fan.add(pivot);
    }
    fan.traverse((o) => ((o as THREE.Mesh).castShadow = true));
    fan.rotation.x = 0.18;
    scene.add(fan);
    const key = spot("#ffffff", 40000, [-70, 60, 80], [0, 0, -25], 0.45, 1);
    scene.add(key, key.target, area("#ffffff", 3, 90, 90, [0, 0, 95], [0, 0, 0]), area("#dfe5ee", 4, 10, 60, [60, 0, 20], [0, 0, 0]));
    return { scene: finalize(scene), camera: cam(48, 1600, 1200, [0, -14, 96], [0, -2, 0]) };
  },
};

const lineSmart: SceneDef = {
  id: "line-smart",
  file: "line-smart.webp",
  width: 1600,
  height: 1200,
  build: (r) => {
    const scene = studio(r, "#050505", 0.6);
    scene.add(wall(plaster("#202022", 3), 160, 120));
    const glass = new THREE.MeshPhysicalMaterial({ color: "#070708", roughness: 0.05, clearcoat: 1, clearcoatRoughness: 0.02, metalness: 0.1 });
    const panel = roundedBox(8.6, 8.6, 0.8, 0.36, glass);
    panel.position.z = 0.4;
    const frameMat = new THREE.MeshPhysicalMaterial({ color: "#2a2a2c", metalness: 0.9, roughness: 0.35 });
    const frame = roundedBox(9, 9, 0.6, 0.28, frameMat);
    frame.position.z = 0.25;
    const on = new THREE.MeshBasicMaterial({ color: "#ffffff", toneMapped: false });
    const ringA = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.06, 16, 96), on);
    ringA.position.set(-1.9, 0, 0.82);
    const ringB = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.06, 16, 96), on);
    ringB.position.set(1.9, 0, 0.82);
    const dotA = new THREE.Mesh(new THREE.CircleGeometry(0.12, 24), on);
    dotA.position.set(-1.9, -2.6, 0.82);
    const dotB = dotA.clone();
    dotB.position.x = 1.9;
    const group = new THREE.Group();
    group.add(frame, panel, ringA, ringB, dotA, dotB);
    group.rotation.y = -0.5;
    scene.add(group);
    const glow = glowTexture();
    [-1.9, 1.9].forEach((x) => {
      const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, blending: THREE.AdditiveBlending, opacity: 0.35, depthWrite: false }));
      s.scale.set(4.5, 4.5, 1);
      s.position.set(x * Math.cos(0.5), 0, 1.2 + x * 0.48);
      scene.add(s);
    });
    const key = spot("#eef1f6", 1500, [-26, 22, 26], [0, 0, 0], 0.4, 1);
    scene.add(key, key.target, area("#ffffff", 4, 6, 26, [14, 0, 14], [0, 0, 0]));
    return { scene: finalize(scene), camera: cam(24, 1600, 1200, [6, 1.5, 34], [0, 0, 0]) };
  },
};

/* ------------------------------ room scenes ------------------------------ */

function room(r: THREE.WebGLRenderer, lit: boolean): Built {
  const scene = studio(r, "#000000", lit ? 0.12 : 0.04);
  const W = 9;
  const H = 3;
  const D = 7;
  const wallMat = plaster(lit ? "#8c8a87" : "#7f7e7c", 4);
  const back = wall(wallMat, W, H);
  back.position.set(0, H / 2, -D / 2);
  const left = wall(wallMat, D, H);
  left.rotation.y = Math.PI / 2;
  left.position.set(-W / 2, H / 2, 0);
  const right = wall(wallMat, D, H);
  right.rotation.y = -Math.PI / 2;
  right.position.set(W / 2, H / 2, 0);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(W, D), new THREE.MeshStandardMaterial({ color: "#3a3937", roughness: 0.55, bumpMap: noiseTexture(512, undefined, 6), bumpScale: 0.4 }));
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  // Ceiling with a recessed cove around the edge
  const ceilMat = new THREE.MeshStandardMaterial({ color: "#9a9895", roughness: 0.95 });
  const ceilTop = new THREE.Mesh(new THREE.PlaneGeometry(W, D), ceilMat);
  ceilTop.rotation.x = Math.PI / 2;
  ceilTop.position.y = H;
  const drop = roundedBox(W - 1.2, 0.12, D - 1.2, 0.02, ceilMat);
  drop.position.set(0, H - 0.22, 0);
  drop.castShadow = false;
  scene.add(back, left, right, floor, ceilTop, drop);

  // Window (left wall) with mullions and night sky
  const sky = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 2), new THREE.MeshBasicMaterial({ color: lit ? "#0c1220" : "#16233d" }));
  sky.rotation.y = Math.PI / 2;
  sky.position.set(-W / 2 + 0.01, 1.45, -0.6);
  scene.add(sky);
  const mullMat = new THREE.MeshStandardMaterial({ color: "#151516", roughness: 0.6 });
  [-1.9, -0.6, 0.7].forEach((z) => {
    const m = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2.1, 0.06), mullMat);
    m.position.set(-W / 2 + 0.04, 1.45, z);
    scene.add(m);
  });
  const sill = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, 2.7), mullMat);
  sill.position.set(-W / 2 + 0.04, 0.45, -0.6);
  scene.add(sill);

  // Sofa
  const fabric = new THREE.MeshStandardMaterial({ color: "#5a5a5e", roughness: 1 });
  const sofa = new THREE.Group();
  const base = roundedBox(3, 0.42, 1, 0.12, fabric);
  base.position.y = 0.32;
  const seat = roundedBox(2.7, 0.18, 0.86, 0.08, fabric);
  seat.position.set(0, 0.6, 0.06);
  const backC = roundedBox(2.9, 0.62, 0.26, 0.12, fabric);
  backC.position.set(0, 0.82, -0.38);
  const armL = roundedBox(0.24, 0.62, 1, 0.1, fabric);
  armL.position.set(-1.44, 0.5, 0);
  const armR = armL.clone();
  armR.position.x = 1.44;
  sofa.add(base, seat, backC, armL, armR);
  sofa.position.set(0.4, 0, -2.6);
  scene.add(sofa);
  // Coffee table and rug
  const table = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 0.32, 64), new THREE.MeshPhysicalMaterial({ color: "#2a2a2c", roughness: 0.3, clearcoat: 0.6 }));
  table.position.set(1.6, 0.16, -1.6);
  table.castShadow = true;
  const rug = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 2.4), new THREE.MeshStandardMaterial({ color: "#5a5856", roughness: 1 }));
  rug.rotation.x = -Math.PI / 2;
  rug.position.set(0.4, 0.005, -1.7);
  rug.receiveShadow = true;
  scene.add(table, rug);
  // Art frame and a switch plate on the back wall
  const art = roundedBox(1.4, 0.9, 0.03, 0.01, new THREE.MeshStandardMaterial({ color: "#58575a", roughness: 0.9 }));
  art.position.set(0.4, 1.75, -D / 2 + 0.02);
  scene.add(art);
  const plate = buildPlate(["switch", "switch", "switch", "switch"], "Graphite", { on: lit }).group;
  plate.scale.setScalar(0.01);
  plate.position.set(2.7, 1.15, -D / 2 + 0.006);
  scene.add(plate);

  // Moonlight through the window
  const moon = new THREE.DirectionalLight("#8ea6d4", lit ? 0.25 : 1.2);
  moon.position.set(-9, 2.6, 0.8);
  moon.target.position.set(1, 0, -1);
  moon.castShadow = true;
  moon.shadow.mapSize.set(2048, 2048);
  moon.shadow.camera.left = -6;
  moon.shadow.camera.right = 6;
  moon.shadow.camera.top = 6;
  moon.shadow.camera.bottom = -6;
  moon.shadow.radius = 6;
  scene.add(moon, moon.target);
  scene.add(new THREE.HemisphereLight("#5a6c90", "#0b0b0c", lit ? 0.15 : 0.35));
  // Soft spill from the window into the room
  scene.add(area("#7f97c8", lit ? 0.8 : 3.2, 2.6, 2, [-W / 2 + 0.05, 1.45, -0.6], [0, 1.2, -0.6]));

  if (lit) {
    const warm = "#ffe7cf"; // ~3500 K, soft neutral-warm, no orange cast
    // Cove: emissive strip line + wall wash along the back and side walls
    const strip = new THREE.MeshBasicMaterial({ color: "#fff3e4", toneMapped: false });
    const backStrip = new THREE.Mesh(new THREE.BoxGeometry(W - 1.4, 0.02, 0.02), strip);
    backStrip.position.set(0, H - 0.14, -D / 2 + 0.62);
    scene.add(backStrip);
    scene.add(area(warm, 9, W - 1.2, 0.25, [0, H - 0.1, -D / 2 + 0.55], [0, H + 1, -D / 2 - 1]));
    scene.add(area(warm, 6, W - 1, 0.4, [0, H - 0.05, -D / 2 + 0.5], [0, 0.6, -D / 2 - 0.2]));
    scene.add(area(warm, 4, D - 1, 0.3, [W / 2 - 0.5, H - 0.08, 0], [W / 2 + 0.6, 0.8, 0]));
    // Three downlights washing the back wall
    [-2.2, 0.4, 3].forEach((x) => {
      const s = spot("#fff1e0", 16, [x, H - 0.23, -D / 2 + 1.1], [x, 0.4, -D / 2 + 0.05], 0.62, 0.85);
      s.shadow.mapSize.set(1024, 1024);
      scene.add(s, s.target);
      const disc = new THREE.Mesh(new THREE.CircleGeometry(0.07, 32), new THREE.MeshBasicMaterial({ color: "#ffffff", toneMapped: false }));
      disc.rotation.x = Math.PI / 2;
      disc.position.set(x, H - 0.285, -D / 2 + 1.1);
      scene.add(disc);
    });
    scene.add(new THREE.AmbientLight(warm, 0.12));
    scene.add(area(warm, 1.5, W - 1.5, D - 1.5, [0, H - 0.3, 0], [0, H + 2, 0]));
  }

  const camera = cam(50, 2400, 1350, [0.2, 1.25, 3.2], [0.3, 1.25, -3.5]);
  return { scene: finalize(scene), camera };
}

const roomOff: SceneDef = { id: "room-off", file: "room-off.webp", width: 2400, height: 1350, exposure: 1, build: (r) => room(r, false) };
const roomOn: SceneDef = { id: "room-on", file: "room-on.webp", width: 2400, height: 1350, exposure: 1, build: (r) => room(r, true) };

/* ------------------------------ story scenes ------------------------------ */

const filmPlan: SceneDef = {
  id: "film-plan",
  file: "film-plan.webp",
  width: 1440,
  height: 1800,
  build: (r) => {
    const scene = studio(r, "#000000", 0.35);
    const desk = new THREE.Mesh(new THREE.PlaneGeometry(200, 200), new THREE.MeshStandardMaterial({ color: "#151516", roughness: 0.8, bumpMap: noiseTexture(512), bumpScale: 0.2 }));
    desk.rotation.x = -Math.PI / 2;
    desk.receiveShadow = true;
    const paper = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.MeshStandardMaterial({ map: planTexture(), roughness: 0.92 }));
    paper.rotation.x = -Math.PI / 2;
    paper.rotation.z = 0.08;
    paper.position.y = 0.02;
    paper.receiveShadow = true;
    const pen = new THREE.Group();
    const silver = new THREE.MeshPhysicalMaterial({ color: "#c9ccd0", metalness: 1, roughness: 0.25 });
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 14, 48), silver);
    const tip = new THREE.Mesh(new THREE.ConeGeometry(0.45, 1.4, 48), silver);
    tip.position.y = -7.7;
    pen.add(barrel, tip);
    pen.rotation.set(Math.PI / 2, 0, 0.6);
    pen.position.set(9, 0.5, 9);
    pen.traverse((o) => ((o as THREE.Mesh).castShadow = true));
    scene.add(desk, paper, pen);
    const key = spot("#f4f2ee", 3200, [-24, 40, -8], [0, 0, 2], 0.55, 1);
    scene.add(key, key.target, area("#e6ebf2", 1.5, 30, 30, [0, 30, 20], [0, 0, 0]));
    return { scene: finalize(scene), camera: cam(34, 1440, 1800, [0, 46, 14], [0, 0, 1]) };
  },
};

const filmWire: SceneDef = {
  id: "film-wire",
  file: "film-wire.webp",
  width: 1440,
  height: 1800,
  exposure: 1.05,
  build: (r) => {
    const scene = studio(r, "#000000", 0.35);
    scene.add(wall(plaster("#5c5c5f", 2), 200, 240));
    const groove = new THREE.MeshStandardMaterial({ color: "#2e2e30", roughness: 1 });
    const pipeMat = new THREE.MeshPhysicalMaterial({ color: "#9a9ca0", roughness: 0.42, clearcoat: 0.3 });
    const add = (m: THREE.Mesh) => {
      m.castShadow = true;
      m.receiveShadow = true;
      scene.add(m);
      return m;
    };
    // Switch box recessed in the wall
    const box = add(roundedBox(11, 11, 3, 0.3, new THREE.MeshStandardMaterial({ color: "#2b2c2f", roughness: 0.75 })));
    box.position.set(-6, -16, -0.8);
    const inside = add(new THREE.Mesh(new THREE.PlaneGeometry(9, 9), new THREE.MeshStandardMaterial({ color: "#141415", roughness: 1 })));
    inside.position.set(-6, -16, 0.75);
    // Vertical chase + conduit into the top of the box
    const vChase = add(new THREE.Mesh(new THREE.BoxGeometry(3.6, 100, 0.4), groove));
    vChase.position.set(-6, 39.5, -0.15);
    const vPipe = add(new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 100, 48), pipeMat));
    vPipe.position.set(-6, 39.5, 0.5);
    // Horizontal chase + conduit out of the right side
    const hChase = add(new THREE.Mesh(new THREE.BoxGeometry(80, 3.6, 0.4), groove));
    hChase.position.set(39.5, -16, -0.15);
    const hPipe = add(new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 80, 48), pipeMat));
    hPipe.rotation.z = Math.PI / 2;
    hPipe.position.set(39.5, -16, 0.5);
    // Wires looping out of the box
    ["#a3241d", "#1b1b1d", "#1f4f9a"].forEach((c, i) => {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-8 + i * 2, -13.5, 0.6),
        new THREE.Vector3(-9 + i * 2.4, -9, 4),
        new THREE.Vector3(-5 + i * 2.2, -6.5, 6.5),
        new THREE.Vector3(-1.5 + i * 1.6, -10.5, 5.5),
        new THREE.Vector3(-2.5 + i * 1.4, -15.5, 3.5),
      ]);
      add(new THREE.Mesh(new THREE.TubeGeometry(curve, 160, 0.42, 20, false), new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.3, clearcoat: 0.6 })));
    });
    const key = spot("#f1efec", 9000, [-55, 28, 22], [0, -10, 0], 0.5, 1);
    scene.add(key, key.target, area("#dce3ec", 2, 40, 12, [30, 20, 30], [0, 0, 0]));
    return { scene: finalize(scene), camera: cam(34, 1440, 1800, [8, -4, 66], [2, -8, 0]) };
  },
};

const filmProtect: SceneDef = {
  id: "film-protect",
  file: "film-protect.webp",
  width: 1440,
  height: 1800,
  build: (r) => {
    const scene = studio(r, "#000000", 0.45);
    scene.add(wall(plaster("#222224", 2), 200, 240));
    const shell = new THREE.MeshPhysicalMaterial({ color: "#36373a", roughness: 0.5, clearcoat: 0.2 });
    const enclosure = roundedBox(34, 30, 7, 0.8, shell);
    enclosure.position.z = 3.5;
    const inner = new THREE.Mesh(new THREE.PlaneGeometry(31, 27), new THREE.MeshStandardMaterial({ color: "#151517", roughness: 0.85 }));
    inner.position.z = 7.05;
    inner.receiveShadow = true;
    scene.add(enclosure, inner);
    // Cover bars above and below the breaker row
    const cover = new THREE.MeshPhysicalMaterial({ color: "#3e3f43", roughness: 0.45, clearcoat: 0.3 });
    [11.5, -11.5].forEach((y) => {
      const b = roundedBox(31, 4, 0.6, 0.2, cover);
      b.position.set(0, y, 7.6);
      scene.add(b);
    });
    const white = new THREE.MeshPhysicalMaterial({ color: "#ebe9e5", roughness: 0.48, clearcoat: 0.25 });
    const grey = new THREE.MeshStandardMaterial({ color: "#2b2b2d", roughness: 0.55 });
    for (let i = 0; i < 8; i++) {
      const x = -12.25 + i * 3.5;
      const lower = roundedBox(3.4, 18, 4, 0.22, white);
      lower.position.set(x, 0, 9);
      const raised = roundedBox(3.4, 7, 2.2, 0.22, white);
      raised.position.set(x, 0, 11.6);
      const slot = new THREE.Mesh(new THREE.BoxGeometry(1.5, 3.6, 0.2), new THREE.MeshStandardMaterial({ color: "#0d0d0e", roughness: 1 }));
      slot.position.set(x, 0, 12.72);
      const up = i !== 5;
      const lever = roundedBox(1.2, 2, 1.4, 0.25, grey);
      lever.position.set(x, up ? 0.9 : -0.9, 13.2);
      lever.rotation.x = up ? -0.45 : 0.45;
      scene.add(lower, raised, slot, lever);
    }
    const led = new THREE.Mesh(new THREE.CircleGeometry(0.4, 32), new THREE.MeshBasicMaterial({ color: "#4ee084", toneMapped: false }));
    led.position.set(13.5, -11.5, 7.95);
    scene.add(led);
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture(), color: "#4ee084", blending: THREE.AdditiveBlending, opacity: 0.45, depthWrite: false }));
    glow.scale.set(4.5, 4.5, 1);
    glow.position.set(13.5, -11.5, 8.3);
    scene.add(glow);
    const key = spot("#f4f2ef", 9000, [-32, 42, 46], [0, 0, 8], 0.5, 1);
    scene.add(key, key.target, area("#dfe5ee", 3, 8, 40, [34, 0, 34], [0, 0, 8]));
    return { scene: finalize(scene), camera: cam(32, 1440, 1800, [16, -10, 84], [0, -1, 8]) };
  },
};

const filmFinish: SceneDef = {
  id: "film-finish",
  file: "film-finish.webp",
  width: 1440,
  height: 1800,
  build: (r) => {
    const scene = studio(r, "#050505", 0.3);
    scene.add(wall(plaster("#5b5b5e", 2), 160, 200));
    const { group } = buildPlate(["switch", "switch", "socket"], "Graphite");
    group.position.set(0, -6, 0.3);
    scene.add(group);
    // Wall washer above: bright scallop fading down the wall
    const washer = spot("#fff6ec", 2400, [0, 34, 6], [0, -10, 0], 0.55, 1);
    scene.add(washer, washer.target);
    scene.add(new THREE.AmbientLight("#ffffff", 0.04));
    return { scene: finalize(scene), camera: cam(30, 1440, 1800, [0, -2, 52], [0, -3, 0]) };
  },
};

export const SCENES: SceneDef[] = [
  heroPlate,
  roomOff,
  roomOn,
  finishShot("finish-matte-white", "finish-matte-white.webp", "Matte White"),
  finishShot("finish-charcoal", "finish-charcoal.webp", "Charcoal"),
  finishShot("finish-champagne-gold", "finish-champagne-gold.webp", "Champagne Gold"),
  finishShot("finish-walnut", "finish-walnut.webp", "Walnut"),
  finishShot("finish-black", "finish-black.webp", "Black"),
  finishShot("finish-silver", "finish-silver.webp", "Silver"),
  lineSwitches,
  lineLighting,
  lineWires,
  lineFans,
  lineSmart,
  filmPlan,
  filmWire,
  filmProtect,
  filmFinish,
];

/* ------------------------------ hero video ------------------------------ */

export const HERO_VIDEO = { file: "hero.mp4", width: 1920, height: 1080, seconds: 8, fps: 30 };

/**
 * Pose the hero scene for loop time t in [0, 1). Uses a cosine ease that
 * goes 0 → 1 → 0, so the last frame flows straight into the first:
 * a slow push-in on the plate while the raking light drifts across the
 * plaster and back.
 */
export function heroFrame({ scene, camera }: Built, t: number) {
  const k = (1 - Math.cos(2 * Math.PI * t)) / 2;
  camera.position.set(4 - 2.5 * k, 1.2 + 0.8 * k, 75 - 10 * k);
  camera.lookAt(1.6 - 1 * k, 0.1 * k, 0);
  const key = scene.userData.key as THREE.SpotLight;
  key.position.set(-42 + 16 * k, 26 + 3 * k, 9 + 2 * k);
  key.target.position.set(4 + 3 * k, -3, 0);
  key.target.updateMatrixWorld();
}

export const HERO_SCENE = heroPlate;
