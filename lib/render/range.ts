// Studio renders for the homepage range tiles: one per type of light.
// Generic, unbranded fittings modelled from typical proportions (centimetres).
import * as THREE from "three";
import { roundedBox } from "./kit";
import { cam, emissive, finalize, glowing, halo, part, pool, stage, type Built, type SceneDef } from "./stage";

const W = 1200;
const H = 900;
const WARM = "#ffe6c4";

const white = () => new THREE.MeshPhysicalMaterial({ color: "#f2f1ed", roughness: 0.42, clearcoat: 0.25 });
const black = () => new THREE.MeshStandardMaterial({ color: "#0e0e0f", roughness: 0.5 });
const alu = () => new THREE.MeshPhysicalMaterial({ color: "#b4b7bc", metalness: 1, roughness: 0.32 });
const darkCast = () => new THREE.MeshPhysicalMaterial({ color: "#232427", metalness: 0.75, roughness: 0.45 });

const shot = (id: string, build: (r: THREE.WebGLRenderer) => Built): SceneDef => ({ id, file: `${id}.webp`, width: W, height: H, build });

function canvasTexture(w: number, h: number, draw: (ctx: CanvasRenderingContext2D) => void) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  draw(c.getContext("2d")!);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 8;
  return t;
}

const lathe = (points: [number, number][], mat: THREE.Material) => part(new THREE.LatheGeometry(points.map(([x, y]) => new THREE.Vector2(x, y)), 96), mat);

/* ------------------------------ panel lights ------------------------------ */

const rangePanel = shot("range-panel", (r) => {
  const scene = stage(r);
  const frame = white();
  const lit = emissive("#fff3e0", 1.15);
  const tilt = 1.12;

  const round = new THREE.Group();
  round.add(part(new THREE.CylinderGeometry(9, 9, 1.1, 128), frame));
  const disc = part(new THREE.CircleGeometry(7.9, 96), lit, 0, 0.56, 0);
  disc.rotation.x = -Math.PI / 2;
  round.add(disc);
  round.rotation.x = tilt;
  round.position.set(-8, 9 * Math.sin(tilt) + 0.3, 3);

  const square = new THREE.Group();
  square.add(roundedBox(17, 1.1, 17, 0.45, frame));
  const pane = part(new THREE.PlaneGeometry(14.9, 14.9), lit, 0, 0.56, 0);
  pane.rotation.x = -Math.PI / 2;
  square.add(pane);
  square.rotation.x = tilt;
  const turned = new THREE.Group();
  turned.add(square);
  turned.rotation.y = -0.4;
  turned.position.set(10.5, 8.5 * Math.sin(tilt) + 0.3, -8);

  scene.add(round, turned);
  scene.add(halo(WARM, 34, 0.08, -8, 9.5, 7), halo(WARM, 34, 0.06, 10, 9, -4));
  scene.add(pool(WARM, 54, 34, 0.24, -6, 17), pool(WARM, 46, 30, 0.14, 15, 6));
  return glowing(r, finalize(scene), cam(26, W, H, [0, 27, 98], [1, 7.6, 0]), 0.22);
});

/* ------------------------------ COB downlights ------------------------------ */

/** A deep recessed COB spot. Built along y: the bezel faces +y, the heat sink runs to −y. */
function cobFitting(lit: boolean, body: THREE.Material = darkCast()) {
  const g = new THREE.Group();
  g.add(
    lathe(
      [
        [3.25, 0],
        [3.4, 0.45],
        [4.7, 0.45],
        [4.8, 0.3],
        [4.8, 0],
        [3.25, 0],
      ],
      white(),
    ),
  );
  // Anti-glare cone down to the chip
  g.add(
    lathe(
      [
        [3.25, 0.4],
        [1.25, -3],
      ],
      new THREE.MeshPhysicalMaterial({ color: "#101011", roughness: 0.22, clearcoat: 0.6, side: THREE.DoubleSide }),
    ),
  );
  const holder = part(new THREE.CircleGeometry(1.25, 48), black(), 0, -3, 0);
  holder.rotation.x = -Math.PI / 2;
  const chip = part(new THREE.CircleGeometry(0.82, 48), lit ? emissive("#ffe2b0", 6) : new THREE.MeshStandardMaterial({ color: "#e3c350", roughness: 0.6 }), 0, -2.98, 0);
  chip.rotation.x = -Math.PI / 2;
  g.add(holder, chip);
  // Housing and heat-sink fins
  g.add(part(new THREE.CylinderGeometry(3.3, 3.3, 4.6, 64, 1, true), body, 0, -2.3, 0));
  const back = part(new THREE.CircleGeometry(3.3, 64), body, 0, -4.6, 0);
  back.rotation.x = Math.PI / 2;
  g.add(back);
  for (let i = 0; i < 22; i++) {
    const a = (i / 22) * Math.PI * 2;
    const fin = part(new THREE.BoxGeometry(0.16, 3.4, 1.3), body, Math.cos(a) * 3.95, -2.7, Math.sin(a) * 3.95);
    fin.rotation.y = Math.PI / 2 - a;
    g.add(fin);
  }
  return g;
}

const rangeCob = shot("range-cob", (r) => {
  const scene = stage(r);
  // One fitting resting on its heat sink, face tilted up towards the camera, lit.
  const tilt = 0.55;
  const front = cobFitting(true);
  front.rotation.x = tilt;
  front.position.set(-6, 6.2, 2);
  // One lying on its fins, showing the heat sink.
  const side = cobFitting(false, alu());
  side.rotation.set(0, -0.78, -Math.PI / 2);
  side.position.set(13, 4.7, -6);

  scene.add(front, side);
  scene.add(halo(WARM, 16, 0.3, -6, 5.4, 0.8), pool(WARM, 44, 40, 0.2, -6, 4));
  return glowing(r, finalize(scene), cam(26, W, H, [-1, 27, 62], [3, 4, -1]), 0.3);
});

/* ------------------------------ strip lights ------------------------------ */

/** A flat ribbon lying along a curve (the flexible LED strip). */
function ribbon(curve: THREE.Curve<THREE.Vector3>, width: number, segments: number) {
  const pos: number[] = [];
  const uv: number[] = [];
  const idx: number[] = [];
  const up = new THREE.Vector3(0, 1, 0);
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const p = curve.getPointAt(t);
    const side = new THREE.Vector3().crossVectors(up, curve.getTangentAt(t)).normalize().multiplyScalar(width / 2);
    pos.push(p.x - side.x, p.y, p.z - side.z, p.x + side.x, p.y, p.z + side.z);
    uv.push(0, t, 1, t);
    if (i < segments) {
      const a = i * 2;
      idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3);
    }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

const rangeStrip = shot("range-strip", (r) => {
  const scene = stage(r);
  const pcb = new THREE.MeshStandardMaterial({ color: "#f4f2ec", roughness: 0.5, side: THREE.DoubleSide });

  // The reel, standing on its edge
  const reel = new THREE.Group();
  const flangeMat = new THREE.MeshPhysicalMaterial({ color: "#f6f5f1", roughness: 0.45, clearcoat: 0.2 });
  [-0.66, 0.66].forEach((z) => {
    const flange = part(new THREE.CylinderGeometry(8.6, 8.6, 0.16, 96), flangeMat, 0, 0, z);
    flange.rotation.x = Math.PI / 2;
    reel.add(flange);
  });
  const wound = part(new THREE.CylinderGeometry(6.7, 6.7, 1.1, 96), pcb);
  wound.rotation.x = Math.PI / 2;
  reel.add(wound);
  // Hub hole and a moulded ring on the face
  reel.add(part(new THREE.CircleGeometry(1.5, 48), black(), 0, 0, 0.75));
  reel.add(part(new THREE.TorusGeometry(4.6, 0.09, 10, 96), flangeMat, 0, 0, 0.74));
  reel.position.set(-10, 8.62, -6);
  reel.rotation.y = 0.5;
  scene.add(reel);

  // The loose end, running towards the camera, lit
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-5.2, 2.6, -3.6),
    new THREE.Vector3(-1, 0.12, -0.5),
    new THREE.Vector3(8, 0.12, 4),
    new THREE.Vector3(7, 0.12, 13),
    new THREE.Vector3(-6, 0.12, 17),
    new THREE.Vector3(-18, 0.12, 23),
  ]);
  scene.add(part(ribbon(curve, 1, 240), pcb));
  const count = 78;
  const leds = new THREE.InstancedMesh(new THREE.BoxGeometry(0.32, 0.14, 0.32), emissive(WARM, 5), count);
  const m4 = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const one = new THREE.Vector3(1, 1, 1);
  for (let i = 0; i < count; i++) {
    const t = 0.05 + (i / (count - 1)) * 0.94;
    const p = curve.getPointAt(t);
    const tan = curve.getTangentAt(t);
    q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.atan2(tan.x, tan.z));
    m4.compose(new THREE.Vector3(p.x, p.y + 0.08, p.z), q, one);
    leds.setMatrixAt(i, m4);
    if (i % 5 === 2) scene.add(pool(WARM, 10, 10, 0.34, p.x, p.z), halo(WARM, 4.2, 0.3, p.x, p.y + 0.5, p.z));
  }
  scene.add(leds);
  return glowing(r, finalize(scene), cam(28, W, H, [3, 32, 70], [-3, 4.2, 4]), 0.3);
});

/* ------------------------------ rope lights ------------------------------ */

const rangeRope = shot("range-rope", (r) => {
  const scene = stage(r);
  const glow = "#ffcf96";
  // LEDs seen through the tube: bright spots on a dim amber sleeve.
  const dots = (repeat: number) => {
    const t = canvasTexture(64, 16, (ctx) => {
      ctx.fillStyle = "#6b3a12";
      ctx.fillRect(0, 0, 64, 16);
      const g = ctx.createRadialGradient(32, 8, 0, 32, 8, 22);
      g.addColorStop(0, "#fff6e4");
      g.addColorStop(0.35, "#ffc27a");
      g.addColorStop(1, "rgba(107,58,18,0)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 64, 16);
    });
    t.repeat.set(repeat, 1);
    return new THREE.MeshStandardMaterial({ color: "#f7ead6", roughness: 0.35, emissive: "#ffffff", emissiveMap: t, emissiveIntensity: 2.3 });
  };

  for (let i = 0; i < 8; i++) {
    const R = 8.6 + (((i * 37) % 10) / 10) * 1.4;
    const ring = part(new THREE.TorusGeometry(R, 0.55, 20, 180), dots(Math.round((2 * Math.PI * R) / 2.3)));
    ring.rotation.set(Math.PI / 2 + (((i * 53) % 7) - 3) * 0.012, 0, i * 0.7);
    ring.position.set((((i * 29) % 5) - 2) * 0.25, 0.56 + (i % 4) * 0.98 + Math.floor(i / 4) * 0.12, (((i * 17) % 5) - 2) * 0.25);
    scene.add(ring);
  }
  // The free end with its cap
  const tail = new THREE.CatmullRomCurve3([new THREE.Vector3(8.6, 0.56, 4.6), new THREE.Vector3(14.5, 0.56, 9), new THREE.Vector3(11, 0.56, 16.5), new THREE.Vector3(1, 0.56, 19.5)]);
  scene.add(part(new THREE.TubeGeometry(tail, 120, 0.55, 16), dots(18)));
  const cap = part(new THREE.CylinderGeometry(0.72, 0.72, 1.7, 24), white(), 0.3, 0.56, 19.6);
  cap.rotation.z = Math.PI / 2;
  cap.rotation.y = 0.28;
  scene.add(cap);

  scene.add(halo(glow, 56, 0.1, 0, 4, 1), pool(glow, 74, 56, 0.34, 1, 4));
  return glowing(r, finalize(scene), cam(28, W, H, [0, 33, 60], [1, 2.2, 4]), 0.32);
});

/* ------------------------------ profile lights ------------------------------ */

/** An aluminium channel with a frosted diffuser (or open, showing the LED strip). Runs along z. */
function profileLight(length: number, body: THREE.Material, mode: "lit" | "open") {
  const g = new THREE.Group();
  const u = new THREE.Shape();
  u.moveTo(-0.85, 0);
  u.lineTo(0.85, 0);
  u.lineTo(0.85, 1.1);
  u.lineTo(0.66, 1.1);
  u.lineTo(0.66, 0.2);
  u.lineTo(-0.66, 0.2);
  u.lineTo(-0.66, 1.1);
  u.lineTo(-0.85, 1.1);
  u.closePath();
  const channel = new THREE.ExtrudeGeometry(u, { depth: length, bevelEnabled: false });
  channel.translate(0, 0, -length / 2);
  g.add(part(channel, body));
  if (mode === "lit") {
    g.add(part(new THREE.BoxGeometry(1.32, 0.14, length - 0.1), emissive("#fff1dc", 1.45), 0, 1, 0));
  } else {
    g.add(part(new THREE.BoxGeometry(1, 0.05, length - 0.6), new THREE.MeshStandardMaterial({ color: "#f4f2ec", roughness: 0.5 }), 0, 0.23, 0));
    const chips = new THREE.MeshStandardMaterial({ color: "#f0d267", roughness: 0.5 });
    for (let z = -length / 2 + 0.9; z < length / 2 - 0.6; z += 1.1) g.add(part(new THREE.BoxGeometry(0.28, 0.1, 0.28), chips, 0, 0.3, z));
  }
  const capMat = new THREE.MeshStandardMaterial({ color: "#8d9095", roughness: 0.6 });
  [-1, 1].forEach((e) => g.add(part(new THREE.BoxGeometry(1.74, 1.14, 0.18), capMat, 0, 0.56, e * (length / 2 + 0.09))));
  return g;
}

const rangeProfile = shot("range-profile", (r) => {
  const scene = stage(r, 0.6);
  const place = (g: THREE.Group, x: number, z: number, turn: number, length: number, lit: boolean) => {
    g.position.set(x, 0, z);
    g.rotation.y = turn;
    scene.add(g);
    if (lit) scene.add(pool(WARM, 14, length + 14, 0.34, x, z, turn));
  };
  place(profileLight(46, alu(), "lit"), -3, 7, 0.52, 46, true);
  place(profileLight(42, new THREE.MeshPhysicalMaterial({ color: "#141415", metalness: 0.7, roughness: 0.4 }), "lit"), 4, -8, -0.36, 42, true);
  place(profileLight(17, alu(), "open"), 17, 15, 1.22, 17, false);
  return glowing(r, finalize(scene), cam(26, W, H, [0, 50, 78], [2, 0.4, 3]), 0.28);
});

/* ------------------------------ track and spot lights ------------------------------ */

const rangeTrack = shot("range-track", (r) => {
  const scene = stage(r);
  const body = white();
  const rail = roundedBox(58, 1.7, 3.2, 0.25, body);
  rail.position.set(0, 26, 0);
  scene.add(rail);

  const head = (x: number, rx: number, rz: number) => {
    const g = new THREE.Group();
    g.add(part(new THREE.BoxGeometry(6, 1.9, 2.6), body, 0, -0.95, 0));
    g.add(part(new THREE.CylinderGeometry(0.55, 0.55, 2.8, 24), body, 0, -3.2, 0));
    const pivot = new THREE.Group();
    pivot.position.y = -4.6;
    pivot.rotation.set(rx, 0, rz);
    const can = new THREE.Group();
    can.position.y = -4.75;
    can.add(part(new THREE.CylinderGeometry(2.7, 2.7, 9.5, 64, 1, true), body));
    const top = part(new THREE.CircleGeometry(2.7, 64), body, 0, 4.75, 0);
    top.rotation.x = -Math.PI / 2;
    can.add(top);
    can.add(part(new THREE.CylinderGeometry(2.0, 2.62, 1.5, 48, 1, true), new THREE.MeshPhysicalMaterial({ color: "#0d0d0e", roughness: 0.25, clearcoat: 0.5, side: THREE.DoubleSide }), 0, -4, 0));
    const lens = part(new THREE.CircleGeometry(2.0, 48), emissive(WARM, 5.5), 0, -3.25, 0);
    lens.rotation.x = Math.PI / 2;
    can.add(lens);
    pivot.add(can);
    g.add(pivot);
    g.position.set(x, 25.15, 0);
    return g;
  };
  scene.add(head(-13, -0.35, -0.25), head(13, -0.3, 0.3));
  scene.add(halo(WARM, 16, 0.4, -15.5, 12.4, 3.6), halo(WARM, 16, 0.4, 15.9, 12.3, 3.1));
  scene.add(pool(WARM, 34, 30, 0.5, -18.6, 7.7), pool(WARM, 34, 30, 0.5, 19.8, 6.5));
  return glowing(r, finalize(scene), cam(30, W, H, [0, 15, 62], [0, 13.6, 0]), 0.34);
});

/* ------------------------------ outdoor and flood lights ------------------------------ */

const rangeFlood = shot("range-flood", (r) => {
  const scene = stage(r);
  const cast = darkCast();
  // The LED array behind the glass: rows of lensed chips
  const array = canvasTexture(512, 340, (ctx) => {
    ctx.fillStyle = "#1a1408";
    ctx.fillRect(0, 0, 512, 340);
    for (let y = 0; y < 6; y++) {
      for (let x = 0; x < 10; x++) {
        const cx = 34 + x * 49.3;
        const cy = 34 + y * 54.4;
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, 22);
        g.addColorStop(0, "#ffffff");
        g.addColorStop(0.3, "#ffe7bd");
        g.addColorStop(1, "rgba(120,80,20,0)");
        ctx.fillStyle = g;
        ctx.fillRect(cx - 24, cy - 24, 48, 48);
      }
    }
  });

  const lamp = new THREE.Group();
  lamp.add(roundedBox(24, 17, 4.6, 0.9, cast));
  lamp.add(part(new THREE.PlaneGeometry(20.8, 13.8), new THREE.MeshStandardMaterial({ color: "#fff6e6", emissive: "#ffffff", emissiveMap: array, emissiveIntensity: 2.2, roughness: 0.3 }), 0, 0, 2.32));
  for (let i = 0; i < 11; i++) lamp.add(part(new THREE.BoxGeometry(0.5, 14.6, 2.2), cast, -10 + i * 2, 0, -3.2));
  lamp.rotation.x = -0.3;

  const unit = new THREE.Group();
  unit.add(lamp);
  const steel = new THREE.MeshPhysicalMaterial({ color: "#2c2d30", metalness: 0.8, roughness: 0.4 });
  [-1, 1].forEach((s) => {
    unit.add(part(new THREE.BoxGeometry(0.4, 12.4, 3), steel, s * 12.7, -6, 0));
    const bolt = part(new THREE.CylinderGeometry(0.7, 0.7, 0.7, 20), alu(), s * 13.1, 0, 0);
    bolt.rotation.z = Math.PI / 2;
    unit.add(bolt);
  });
  unit.add(part(new THREE.BoxGeometry(25.8, 0.4, 3), steel, 0, -12.2, 0));
  unit.position.set(-2, 12.45, 0);
  unit.rotation.y = 0.42;
  scene.add(unit);

  scene.add(halo(WARM, 46, 0.1, 2, 14, 8), pool(WARM, 80, 60, 0.3, 12, 26));
  return glowing(r, finalize(scene), cam(28, W, H, [-10, 26, 98], [1, 9.5, 0]), 0.26);
});

/* ------------------------------ drivers and accessories ------------------------------ */

const rangeDriver = shot("range-driver", (r) => {
  const scene = stage(r, 0.9);
  // Perforated steel case
  const mesh = canvasTexture(512, 256, (ctx) => {
    ctx.fillStyle = "#b7babf";
    ctx.fillRect(0, 0, 512, 256);
    ctx.fillStyle = "#17181a";
    for (let y = 0; y < 17; y++) {
      for (let x = 0; x < 33; x++) {
        ctx.beginPath();
        ctx.arc(8 + x * 16 + (y % 2) * 8, 8 + y * 15, 4.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  });
  const supply = new THREE.Group();
  supply.add(roundedBox(21, 4.4, 10.5, 0.15, new THREE.MeshPhysicalMaterial({ map: mesh, metalness: 0.85, roughness: 0.38 })));
  // Blank rating label (lines only, no text)
  const label = part(
    new THREE.PlaneGeometry(8.4, 4.6),
    new THREE.MeshStandardMaterial({
      roughness: 0.7,
      map: canvasTexture(256, 140, (ctx) => {
        ctx.fillStyle = "#f3f2ee";
        ctx.fillRect(0, 0, 256, 140);
        ctx.fillStyle = "#9a9a9a";
        [22, 44, 66, 88, 110].forEach((y, i) => ctx.fillRect(16, y, 224 - i * 34, 6));
      }),
    }),
    -4.4,
    2.215,
    0.6,
  );
  label.rotation.x = -Math.PI / 2;
  supply.add(label);
  // Terminal block with its screws and a power indicator
  supply.add(part(new THREE.BoxGeometry(2.6, 2.5, 9.4), black(), 11.7, -0.6, 0));
  for (let i = 0; i < 7; i++) supply.add(part(new THREE.CylinderGeometry(0.42, 0.42, 0.3, 16), alu(), 11.7, 0.75, -3.6 + i * 1.2));
  const led = part(new THREE.CircleGeometry(0.2, 20), emissive("#6dff9c", 4), 9.4, 2.215, 4.2);
  led.rotation.x = -Math.PI / 2;
  supply.add(led);
  supply.position.set(-3.5, 2.2, -3);
  supply.rotation.y = 0.42;
  scene.add(supply);

  // A compact constant-current driver with its leads
  const driver = new THREE.Group();
  driver.add(roundedBox(9.6, 2.6, 4.2, 0.4, white()));
  const lead = (colour: string, from: [number, number, number], to: [number, number, number]) => {
    const mid = new THREE.Vector3((from[0] + to[0]) / 2, 0.25 - 1.3, (from[2] + to[2]) / 2 + 1.2);
    const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(...from), mid, new THREE.Vector3(...to)]);
    driver.add(part(new THREE.TubeGeometry(curve, 40, 0.13, 8), new THREE.MeshStandardMaterial({ color: colour, roughness: 0.5 })));
  };
  lead("#b3261e", [4.8, 0, 0.5], [11.5, -1.15, 2.5]);
  lead("#151515", [4.8, 0, -0.5], [11.8, -1.15, -1]);
  lead("#2b55c4", [-4.8, 0, 0.5], [-11, -1.15, 3]);
  lead("#6b3f1c", [-4.8, 0, -0.5], [-11.5, -1.15, -0.5]);
  driver.position.set(7, 1.3, 13);
  driver.rotation.y = -0.3;
  scene.add(driver);

  return glowing(r, finalize(scene), cam(28, W, H, [0, 27, 54], [1.5, 1.4, 3]), 0.25);
});

export const RANGE_SCENES: SceneDef[] = [rangePanel, rangeCob, rangeStrip, rangeRope, rangeProfile, rangeTrack, rangeFlood, rangeDriver];
