// Procedural textures shared by the live 3D showroom (hero, Light Lab) and
// the offline render studio. Everything is drawn on a canvas at run time,
// so the site ships no texture files.
import * as THREE from "three";

function canvas(w: number, h = w) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return [c, c.getContext("2d")!] as const;
}

/** Smooth fractal value noise (stacked upscaled random grids), greyscale. */
export function noiseCanvas(size = 512, octaves = [4, 8, 16, 32, 64, 128]) {
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
  return c;
}

export function noiseTexture(size = 1024, octaves = [4, 8, 16, 32, 64, 128, 256], repeat = 1) {
  const t = new THREE.CanvasTexture(noiseCanvas(size, octaves));
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(repeat, repeat);
  return t;
}

/** Tangent-space normal map from a greyscale height canvas (central differences). */
export function normalMapFrom(height: HTMLCanvasElement, strength = 2) {
  const w = height.width;
  const h = height.height;
  const src = height.getContext("2d")!.getImageData(0, 0, w, h).data;
  const [c, ctx] = canvas(w, h);
  const out = ctx.createImageData(w, h);
  const at = (x: number, y: number) => src[(((y + h) % h) * w + ((x + w) % w)) * 4] / 255;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const dx = (at(x + 1, y) - at(x - 1, y)) * strength;
      const dy = (at(x, y + 1) - at(x, y - 1)) * strength;
      const inv = 1 / Math.hypot(dx, dy, 1);
      const i = (y * w + x) * 4;
      out.data[i] = (-dx * inv * 0.5 + 0.5) * 255;
      out.data[i + 1] = (dy * inv * 0.5 + 0.5) * 255;
      out.data[i + 2] = (inv * 0.5 + 0.5) * 255;
      out.data[i + 3] = 255;
    }
  }
  ctx.putImageData(out, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
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

/** Walnut veneer: dark wavy grain running along the texture's height. */
export function walnutTexture(size = 512) {
  const [c, ctx] = canvas(size);
  const g = ctx.createLinearGradient(0, 0, size, 0);
  g.addColorStop(0, "#4a3020");
  g.addColorStop(0.5, "#5b3d29");
  g.addColorStop(1, "#432b1a");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 160; i++) {
    const x0 = Math.random() * size;
    const amp = 3 + Math.random() * 10;
    const freq = 0.006 + Math.random() * 0.01;
    ctx.strokeStyle = `rgba(${24 + Math.random() * 22},${14 + Math.random() * 10},8,${0.14 + Math.random() * 0.3})`;
    ctx.lineWidth = 0.5 + Math.random() * 2;
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
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
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

/**
 * Soft halo that follows a stroked path (drawn by `trace` in a 0..w, 0..h
 * box). Used as an additive decal behind rope and profile lights so the
 * wall around them appears to glow.
 */
export function pathGlowTexture(w: number, h: number, trace: (ctx: CanvasRenderingContext2D) => void) {
  const [c, ctx] = canvas(w, h);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, w, h);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = "#fff";
  const steps = 22;
  const widest = Math.min(w, h) * 0.42;
  for (let i = 0; i < steps; i++) {
    const k = i / (steps - 1);
    ctx.lineWidth = widest * Math.pow(1 - k, 2.2) + 2;
    ctx.globalAlpha = 0.022 + k * 0.05;
    ctx.beginPath();
    trace(ctx);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
