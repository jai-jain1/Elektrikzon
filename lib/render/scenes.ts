// Scene definitions for the offline render studio (/render, dev only).
// Each builder returns a scene and camera for one image slot in data/shots.ts.
import * as THREE from "three";
import { allLayers, buildShowroom, type ShowroomView } from "@/lib/three/showroom";
import { glowTexture, noiseTexture, plaster, roundedBox } from "./kit";
import { RANGE_SCENES } from "./range";
import { cam, finalize, studio, wall, type SceneDef } from "./stage";

export type { Built, SceneDef } from "./stage";

/* ------------------------------ the showroom ------------------------------ */

/** A still of the live 3D room (lib/three/showroom.ts), lights on or off. */
function showroomShot(id: string, width: number, height: number, on: boolean, view?: ShowroomView): SceneDef {
  return {
    id,
    file: `${id}.webp`,
    width,
    height,
    build: (r) => {
      const room = buildShowroom(r, { quality: "high" });
      room.setState({ layers: allLayers(on), kelvin: 3000, brightness: 1 }, true);
      if (view) room.setView(view);
      return {
        scene: room.scene,
        camera: room.camera,
        render: (w, h) => {
          room.resize(w, h, 1);
          room.update(0);
          room.render();
        },
        dispose: () => room.dispose(),
      };
    },
  };
}

/* ------------------------------ campaign scenes ------------------------------ */

/** Clay diya: a shallow lathed bowl with a spout, wick flame and glow. */
function diya(clay: THREE.Material, flameMat: THREE.Material, glow: THREE.Texture) {
  const g = new THREE.Group();
  const pts = [
    [0, 0], [1.1, 0.02], [1.7, 0.25], [2.0, 0.7], [2.05, 0.95], [1.85, 0.98], [1.6, 0.6], [1.0, 0.42], [0, 0.4],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const bowl = new THREE.Mesh(new THREE.LatheGeometry(pts, 64), clay);
  bowl.scale.set(1, 1, 0.82);
  const spout = new THREE.Mesh(new THREE.ConeGeometry(0.42, 1.3, 24, 1, true), clay);
  spout.rotation.z = Math.PI / 2 + 0.25;
  spout.position.set(2.05, 0.78, 0);
  const oil = new THREE.Mesh(new THREE.CircleGeometry(1.55, 48), new THREE.MeshPhysicalMaterial({ color: "#3a2208", roughness: 0.15, clearcoat: 1 }));
  oil.rotation.x = -Math.PI / 2;
  oil.position.y = 0.62;
  const flame = new THREE.Mesh(new THREE.SphereGeometry(0.28, 24, 16), flameMat);
  flame.scale.set(1, 2.6, 1);
  flame.position.set(2.35, 1.6, 0);
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: "#ffb35c", blending: THREE.AdditiveBlending, opacity: 0.55, depthWrite: false }));
  halo.scale.set(4.5, 6, 1);
  halo.position.copy(flame.position);
  const light = new THREE.PointLight("#ffa44d", 90, 0, 2);
  light.position.set(2.35, 2.1, 0.4);
  light.castShadow = true;
  light.shadow.mapSize.set(1024, 1024);
  light.shadow.radius = 6;
  bowl.castShadow = spout.castShadow = true;
  g.add(bowl, spout, oil, flame, halo, light);
  return g;
}

const campaignLights: SceneDef = {
  id: "campaign-lights",
  file: "campaign-lights.webp",
  width: 2400,
  height: 1350,
  exposure: 1,
  build: (r) => {
    const scene = studio(r, "#040303", 0.18);
    scene.add(wall(plaster("#2a2624", 3), 220, 130));
    const glow = glowTexture();
    // Graphite shelf
    const shelf = roundedBox(110, 2.2, 14, 0.4, new THREE.MeshPhysicalMaterial({ color: "#202022", roughness: 0.45, metalness: 0.2, clearcoat: 0.4 }));
    shelf.position.set(0, -15, 7);
    shelf.receiveShadow = true;
    scene.add(shelf);
    // Diyas on the shelf
    const clay = new THREE.MeshStandardMaterial({ color: "#8a4a2a", roughness: 0.85, bumpMap: noiseTexture(512), bumpScale: 0.6 });
    const flameMat = new THREE.MeshStandardMaterial({ color: "#ffd9a0", emissive: "#ffb347", emissiveIntensity: 4 });
    [-30, -15, 0, 15, 30].forEach((x, i) => {
      const d = diya(clay, flameMat, glow);
      d.position.set(x + (i % 2 ? 1.2 : -0.8), -13.9, 8 + (i % 2 ? -1.5 : 1));
      d.rotation.y = -0.5 + i * 0.22;
      d.scale.setScalar(1.8);
      scene.add(d);
    });
    // String lights: three drooping strands of warm bulbs across the wall
    const bulbMat = new THREE.MeshStandardMaterial({ color: "#ffe2b8", emissive: "#ffb85c", emissiveIntensity: 3 });
    const wireMat = new THREE.MeshStandardMaterial({ color: "#111", roughness: 0.6 });
    const strands: [number, number, number, number][] = [
      // x0, x1, y, sag
      [-70, 70, 30, 12],
      [-60, 40, 18, 9],
      [-20, 75, 24, 10],
    ];
    strands.forEach(([x0, x1, y, sag], si) => {
      const curve = new THREE.QuadraticBezierCurve3(new THREE.Vector3(x0, y, 1.2), new THREE.Vector3((x0 + x1) / 2, y - sag * 2, 2.2), new THREE.Vector3(x1, y, 1.2));
      scene.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 120, 0.09, 8), wireMat));
      const n = 22;
      for (let i = 1; i < n; i++) {
        const p = curve.getPoint(i / n);
        const b = new THREE.Mesh(new THREE.SphereGeometry(0.42, 16, 12), bulbMat);
        b.position.set(p.x, p.y - 0.5, p.z);
        const h = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: "#ffbf73", blending: THREE.AdditiveBlending, opacity: 0.42, depthWrite: false }));
        h.scale.set(5, 5, 1);
        h.position.copy(b.position);
        scene.add(b, h);
        if (i % 4 === 2) {
          const l = new THREE.PointLight("#ffb766", 70 + si * 10, 0, 2);
          l.position.set(p.x, p.y - 0.8, p.z + 2.5);
          scene.add(l);
        }
      }
    });
    // Out-of-focus bokeh in the foreground
    for (let i = 0; i < 14; i++) {
      const b = new THREE.Sprite(new THREE.SpriteMaterial({ map: glow, color: i % 3 ? "#ffb066" : "#ffe1b0", blending: THREE.AdditiveBlending, opacity: 0.1 + (i % 4) * 0.04, depthWrite: false }));
      const sz = 6 + ((i * 37) % 9);
      b.scale.set(sz, sz, 1);
      b.position.set(-60 + ((i * 53) % 120), -20 + ((i * 29) % 50), 30 + (i % 3) * 4);
      scene.add(b);
    }
    scene.add(new THREE.AmbientLight("#ffd2a0", 0.06));
    return { scene: finalize(scene), camera: cam(34, 2400, 1350, [0, 0, 88], [0, 1, 0]) };
  },
};

export const SCENES: SceneDef[] = [
  showroomShot("showroom-on", 1920, 1080, true),
  showroomShot("showroom-off", 1920, 1080, false),
  showroomShot("showroom-on-tall", 1080, 1920, true),
  showroomShot("showroom-off-tall", 1080, 1920, false),
  showroomShot("showroom-detail", 1600, 1200, true, { position: [-2.2, 1.0, 3.3], target: [0.35, 1.45, 0], fov: 42 }),
  ...RANGE_SCENES,
  campaignLights,
];
