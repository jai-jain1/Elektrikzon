// Offline render kit (development only, used by /render).
// Procedural textures, materials and a modular switch plate built from
// real proportions, so the site's photography can be rendered locally.
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

/* ------------------------------ textures ------------------------------ */

function canvas(size: number) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  return [c, c.getContext("2d")!] as const;
}

/** Smooth fractal value noise (stacked upscaled random grids). */
export function noiseTexture(size = 1024, octaves = [4, 8, 16, 32, 64, 128, 256], repeat = 1) {
  const [c, ctx] = canvas(size);
  ctx.fillStyle = "#808080";
  ctx.fillRect(0, 0, size, size);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  octaves.forEach((o, i) => {
    const [s, sctx] = canvas(o);
    const img = sctx.createImageData(o, o);
    for (let p = 0; p < img.data.length; p += 4) {
      const v = Math.random() * 255;
      img.data[p] = img.data[p + 1] = img.data[p + 2] = v;
      img.data[p + 3] = 255;
    }
    sctx.putImageData(img, 0, 0);
    ctx.globalAlpha = 0.5 / (i + 1) + 0.08;
    ctx.drawImage(s, 0, 0, size, size);
  });
  ctx.globalAlpha = 1;
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat, repeat);
  return t;
}

/** Fine horizontal streaks for brushed metal. */
export function brushedTexture(size = 1024) {
  const [c, ctx] = canvas(size);
  ctx.fillStyle = "#8a8a8a";
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 2600; i++) {
    const y = Math.random() * size;
    const g = 100 + Math.random() * 90;
    ctx.strokeStyle = `rgba(${g},${g},${g},${0.15 + Math.random() * 0.35})`;
    ctx.lineWidth = Math.random() * 1.4;
    ctx.beginPath();
    const x = Math.random() * size;
    ctx.moveTo(x - size * 0.6, y);
    ctx.lineTo(x + size * 0.6, y + (Math.random() - 0.5) * 2);
    ctx.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

/** Walnut veneer: dark wavy grain. Returns colour map. */
export function walnutTexture(size = 1024) {
  const [c, ctx] = canvas(size);
  const g = ctx.createLinearGradient(0, 0, size, 0);
  g.addColorStop(0, "#3b2618");
  g.addColorStop(0.5, "#4a3120");
  g.addColorStop(1, "#33210f");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 220; i++) {
    const x0 = Math.random() * size;
    const amp = 6 + Math.random() * 18;
    const freq = 0.004 + Math.random() * 0.006;
    ctx.strokeStyle = `rgba(${20 + Math.random() * 20},${12 + Math.random() * 10},${6},${0.15 + Math.random() * 0.35})`;
    ctx.lineWidth = 0.6 + Math.random() * 2.4;
    ctx.beginPath();
    for (let y = 0; y <= size; y += 8) {
      const x = x0 + Math.sin(y * freq + i) * amp;
      if (y === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** An electrical layout drawing (lines and symbols only, no readable text). */
export function planTexture(size = 2048) {
  const [c, ctx] = canvas(size);
  ctx.fillStyle = "#d9d9d6";
  ctx.fillRect(0, 0, size, size);
  ctx.strokeStyle = "#2a2a2c";
  ctx.lineCap = "round";
  const u = size / 40;
  // Walls
  ctx.lineWidth = u * 0.5;
  ctx.strokeRect(u * 4, u * 4, u * 32, u * 30);
  ctx.beginPath();
  ctx.moveTo(u * 20, u * 4);
  ctx.lineTo(u * 20, u * 18);
  ctx.moveTo(u * 4, u * 20);
  ctx.lineTo(u * 14, u * 20);
  ctx.moveTo(u * 26, u * 20);
  ctx.lineTo(u * 36, u * 20);
  ctx.stroke();
  // Grid
  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgba(40,40,44,0.12)";
  for (let i = 0; i <= 40; i++) {
    ctx.beginPath();
    ctx.moveTo(i * u, 0);
    ctx.lineTo(i * u, size);
    ctx.moveTo(0, i * u);
    ctx.lineTo(size, i * u);
    ctx.stroke();
  }
  // Light points (circle with cross), switches (small squares), sockets (half circles)
  ctx.strokeStyle = "#1d1d1f";
  ctx.lineWidth = u * 0.12;
  const light = (x: number, y: number) => {
    ctx.beginPath();
    ctx.arc(x * u, y * u, u * 0.8, 0, Math.PI * 2);
    ctx.moveTo((x - 0.56) * u, (y - 0.56) * u);
    ctx.lineTo((x + 0.56) * u, (y + 0.56) * u);
    ctx.moveTo((x + 0.56) * u, (y - 0.56) * u);
    ctx.lineTo((x - 0.56) * u, (y + 0.56) * u);
    ctx.stroke();
  };
  [
    [10, 10],
    [28, 10],
    [12, 27],
    [28, 27],
    [20, 27],
  ].forEach(([x, y]) => light(x, y));
  [
    [19.2, 8],
    [5, 22],
    [35, 24],
  ].forEach(([x, y]) => ctx.strokeRect(x * u, y * u, u * 0.9, u * 0.9));
  [
    [8, 33.4],
    [24, 33.4],
    [35.4, 14],
  ].forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x * u, y * u, u * 0.6, Math.PI, 0);
    ctx.stroke();
  });
  // Dashed circuit runs
  ctx.setLineDash([u * 0.5, u * 0.4]);
  ctx.lineWidth = u * 0.08;
  ctx.beginPath();
  ctx.moveTo(19.6 * u, 8.4 * u);
  ctx.quadraticCurveTo(15 * u, 9 * u, 10.8 * u, 10 * u);
  ctx.moveTo(20 * u, 8.4 * u);
  ctx.quadraticCurveTo(24 * u, 9 * u, 27.2 * u, 10 * u);
  ctx.moveTo(5.5 * u, 22.4 * u);
  ctx.quadraticCurveTo(8 * u, 25 * u, 11.2 * u, 27 * u);
  ctx.moveTo(35.4 * u, 24.4 * u);
  ctx.quadraticCurveTo(32 * u, 26 * u, 28.8 * u, 27 * u);
  ctx.stroke();
  ctx.setLineDash([]);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

/** Soft radial sprite for glows. */
export function glowTexture(size = 256) {
  const [c, ctx] = canvas(size);
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.25, "rgba(255,255,255,0.35)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/* ------------------------------ materials ------------------------------ */

let plasterBump: THREE.Texture | null = null;
export function plaster(color = "#2b2b2d", repeat = 2) {
  plasterBump ??= noiseTexture(1024);
  const bump = plasterBump.clone();
  bump.needsUpdate = true;
  bump.repeat.set(repeat, repeat);
  return new THREE.MeshStandardMaterial({ color, roughness: 0.96, metalness: 0, bumpMap: bump, bumpScale: 2.2 });
}

export type FinishKey = "Matte White" | "Charcoal" | "Champagne Gold" | "Walnut" | "Black" | "Silver" | "Graphite";

let brushed: THREE.Texture | null = null;
let walnut: THREE.Texture | null = null;

/** Plate and rocker materials per finish. */
export function finishMaterials(f: FinishKey): { plate: THREE.Material; rocker: THREE.Material } {
  brushed ??= brushedTexture();
  walnut ??= walnutTexture();
  const phys = (o: THREE.MeshPhysicalMaterialParameters) => new THREE.MeshPhysicalMaterial(o);
  switch (f) {
    case "Matte White":
      return { plate: phys({ color: "#ecebe7", roughness: 0.55, clearcoat: 0.15, clearcoatRoughness: 0.5 }), rocker: phys({ color: "#f4f3ef", roughness: 0.45, clearcoat: 0.2 }) };
    case "Charcoal":
      return { plate: phys({ color: "#323336", roughness: 0.6, clearcoat: 0.1 }), rocker: phys({ color: "#45464a", roughness: 0.48, clearcoat: 0.25 }) };
    case "Graphite":
      return { plate: phys({ color: "#4a4b4f", roughness: 0.42, metalness: 0.15, clearcoat: 0.35, clearcoatRoughness: 0.35 }), rocker: phys({ color: "#5a5b60", roughness: 0.38, clearcoat: 0.4 }) };
    case "Champagne Gold":
      return {
        plate: phys({ color: "#cfc8bc", metalness: 1, roughness: 0.34, roughnessMap: brushed, envMapIntensity: 1.1 }),
        rocker: phys({ color: "#ddd7cd", metalness: 0.35, roughness: 0.32, clearcoat: 0.3 }),
      };
    case "Walnut":
      return { plate: phys({ map: walnut, roughness: 0.55, clearcoat: 0.25, clearcoatRoughness: 0.4 }), rocker: phys({ color: "#efede8", roughness: 0.45, clearcoat: 0.2 }) };
    case "Black":
      return { plate: phys({ color: "#0b0b0c", roughness: 0.06, clearcoat: 1, clearcoatRoughness: 0.03, reflectivity: 0.6 }), rocker: phys({ color: "#1c1c1e", roughness: 0.12, clearcoat: 1 }) };
    case "Silver":
      return {
        plate: phys({ color: "#c4c7cb", metalness: 1, roughness: 0.3, roughnessMap: brushed, envMapIntensity: 1.1 }),
        rocker: phys({ color: "#d9dbde", metalness: 0.35, roughness: 0.3, clearcoat: 0.3 }),
      };
  }
}

export const darkPlastic = () => new THREE.MeshStandardMaterial({ color: "#0e0e0f", roughness: 0.7 });

/* ------------------------------ geometry ------------------------------ */

/** Units: centimetres. One module ≈ 2.25 cm wide; opening 4.4 cm tall. */
export const M = 2.25;
export type ModuleType = "switch" | "socket" | "blank" | "dimmer";

export function buildPlate(modules: ModuleType[], finish: FinishKey, opts: { on?: boolean; led?: boolean } = {}) {
  const { plate: plateMat, rocker: rockerMat } = finishMaterials(finish);
  const slots = modules.reduce((n, m) => n + (m === "socket" ? 2 : 1), 0);
  const W = slots * M + 2.8;
  const H = 8.6;
  const group = new THREE.Group();

  const plate = new THREE.Mesh(new RoundedBoxGeometry(W, H, 0.55, 6, 0.25), plateMat);
  plate.castShadow = true;
  plate.receiveShadow = true;
  group.add(plate);

  // Shadow gap around the module frame
  const frame = new THREE.Mesh(new RoundedBoxGeometry(slots * M + 0.16, 4.56, 0.2, 4, 0.08), new THREE.MeshStandardMaterial({ color: "#050505", roughness: 0.9 }));
  frame.position.z = 0.2;
  group.add(frame);

  let x = -(slots * M) / 2;
  for (const m of modules) {
    const w = (m === "socket" ? 2 : 1) * M;
    const cx = x + w / 2;
    if (m === "switch" || m === "blank" || m === "dimmer") {
      const r = new THREE.Mesh(new RoundedBoxGeometry(w - 0.12, 4.32, 0.5, 5, 0.16), m === "blank" ? plateMat : rockerMat);
      r.position.set(cx, 0, 0.36);
      if (m === "switch") r.rotation.x = opts.on ? -0.06 : 0.06;
      r.castShadow = true;
      group.add(r);
      if (m === "switch") {
        // Split line and locator LED
        const line = new THREE.Mesh(new THREE.BoxGeometry(w - 0.5, 0.025, 0.02), new THREE.MeshStandardMaterial({ color: "#000", transparent: true, opacity: 0.25 }));
        line.position.set(cx, 0, 0.62);
        group.add(line);
        if (opts.led !== false) {
          const led = new THREE.Mesh(new THREE.CircleGeometry(0.07, 24), new THREE.MeshBasicMaterial({ color: "#ffffff", toneMapped: false }));
          led.position.set(cx, 1.55, 0.625);
          group.add(led);
        }
      }
      if (m === "dimmer") {
        const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.8, 0.5, 48), rockerMat);
        knob.rotation.x = Math.PI / 2;
        knob.position.set(cx, 0, 0.75);
        knob.castShadow = true;
        group.add(knob);
      }
    } else {
      const face = new THREE.Mesh(new RoundedBoxGeometry(w - 0.12, 4.32, 0.5, 5, 0.16), rockerMat);
      face.position.set(cx, 0, 0.36);
      group.add(face);
      const disc = new THREE.Mesh(new THREE.CylinderGeometry(1.75, 1.8, 0.16, 64), rockerMat);
      disc.rotation.x = Math.PI / 2;
      disc.position.set(cx, 0, 0.66);
      group.add(disc);
      const hole = (hx: number, hy: number, r: number) => {
        const h = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 0.1, 32), new THREE.MeshStandardMaterial({ color: "#050505", roughness: 0.9 }));
        h.rotation.x = Math.PI / 2;
        h.position.set(cx + hx, hy, 0.72);
        group.add(h);
      };
      hole(0, 0.7, 0.24);
      hole(-0.62, -0.45, 0.17);
      hole(0.62, -0.45, 0.17);
    }
    x += w;
  }
  return { group, width: W, height: H };
}

export function roundedBox(w: number, h: number, d: number, r: number, mat: THREE.Material) {
  const m = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 5, r), mat);
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
}
