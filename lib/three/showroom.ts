// The live 3D lighting showroom: one minimal room where each family of
// lights we sell (panel, COB, strip, profile, rope) can be switched on and
// off, tinted warm to cool, and dimmed. The same builder drives the hero,
// the Light Lab and the offline render studio (posters), so they all match.
//
// Units are metres. The back wall is the plane z = 0, the camera looks
// along −z from inside the room.
import * as THREE from "three";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { Reflector } from "three/examples/jsm/objects/Reflector.js";
import { kelvinToRgb } from "@/lib/kelvin";
import { glowTexture, noiseCanvas, normalMapFrom, pathGlowTexture, walnutTexture } from "./textures";

import { DEFAULT_STATE, LAYERS, type LayerKey, type Quality, type ShowroomState } from "./layers";

export * from "./layers";

export interface ShowroomView {
  position: [number, number, number];
  target: [number, number, number];
  fov: number;
}

export interface Showroom {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  /** `instant` skips the fade (used for the first frame and for posters). */
  setState(next: ShowroomState, instant?: boolean): void;
  /** Pointer position in −1..1 on both axes, for a slight parallax. */
  setPointer(x: number, y: number): void;
  /** How far the hero has scrolled away, 0..1: the camera pushes in slightly. */
  setScroll(progress: number): void;
  /** Fixed camera for stills; null returns to the responsive framing. */
  setView(view: ShowroomView | null): void;
  resize(width: number, height: number, pixelRatio: number): void;
  setQuality(quality: Quality): void;
  /** Advances the fades by dt seconds. Returns true while anything is still moving. */
  update(dt: number): boolean;
  render(): void;
  dispose(): void;
}

/** A switched light source: its real lights, glowing surfaces and halos. */
interface Emitter {
  layer: LayerKey;
  /** Seconds after its layer is switched on before this one follows. */
  delay: number;
  level: number;
  goal: number;
  wait: number;
  lights: { light: THREE.Light; base: number }[];
  surfaces: { mat: THREE.MeshStandardMaterial; base: number }[];
  halos: { mat: THREE.SpriteMaterial | THREE.MeshBasicMaterial; base: number }[];
}

/** How much each layer lifts the room's bounced light when it is on. */
const BOUNCE: Record<LayerKey, number> = { panel: 0.3, cob: 0.07, strip: 0.1, profile: 0.1, rope: 0.04 };

const WHITE_BALANCE = 4300;
const linear = (k: number) => {
  const [r, g, b] = kelvinToRgb(k);
  return new THREE.Color().setRGB(r / 255, g / 255, b / 255, THREE.SRGBColorSpace);
};

/** Light colour for a colour temperature, as a camera balanced for neutral white would see it. */
export function tintFor(kelvin: number): THREE.Color {
  const c = linear(kelvin);
  const wb = linear(WHITE_BALANCE);
  c.setRGB(c.r / wb.r, c.g / wb.g, c.b / wb.b);
  const max = Math.max(c.r, c.g, c.b);
  c.multiplyScalar(1 / max);
  // Cool whites read as harshly blue on screen at full strength; ease them back.
  return kelvin > WHITE_BALANCE ? c.lerp(new THREE.Color(1, 1, 1), 0.45) : c;
}

let areaLightsReady = false;

export function buildShowroom(renderer: THREE.WebGLRenderer, opts: { quality: Quality }): Showroom {
  if (!areaLightsReady) {
    RectAreaLightUniformsLib.init();
    areaLightsReady = true;
  }
  let quality = opts.quality;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#020203");
  const camera = new THREE.PerspectiveCamera(38, 16 / 9, 0.1, 60);

  const textures: THREE.Texture[] = [];
  const keep = <T extends THREE.Texture>(t: T) => {
    textures.push(t);
    return t;
  };
  const glow = keep(glowTexture(128));

  /* ------------------------------ materials ------------------------------ */

  const grain = keep(normalMapFrom(noiseCanvas(512), 3));
  grain.repeat.set(16, 3);
  const wallMat = new THREE.MeshStandardMaterial({ color: "#8f8982", roughness: 0.93, normalMap: grain, normalScale: new THREE.Vector2(0.22, 0.22) });
  const nicheMat = new THREE.MeshStandardMaterial({ color: "#6f6963", roughness: 0.95 });
  const floorMat = new THREE.MeshStandardMaterial({ color: "#2e2b29", roughness: 0.34, transparent: true, opacity: 0.8 });
  const slabMat = new THREE.MeshStandardMaterial({ color: "#d6d2cb", roughness: 0.95 });
  const wood = keep(walnutTexture(512));
  wood.repeat.set(1, 3);
  const fluteMat = new THREE.MeshStandardMaterial({ map: wood, roughness: 0.52 });
  const boardMat = new THREE.MeshStandardMaterial({ color: "#2a1c13", roughness: 0.7 });
  const stoneMat = new THREE.MeshStandardMaterial({ color: "#161617", roughness: 0.3 });
  const ceramicMat = new THREE.MeshStandardMaterial({ color: "#cdc6ba", roughness: 0.55 });
  const darkMat = new THREE.MeshStandardMaterial({ color: "#2c2b2b", roughness: 0.4 });
  const trimMat = new THREE.MeshStandardMaterial({ color: "#f4f2ee", roughness: 0.5 });
  const cupMat = new THREE.MeshStandardMaterial({ color: "#0b0b0c", roughness: 0.6 });

  const add = <T extends THREE.Object3D>(o: T) => {
    scene.add(o);
    return o;
  };
  const mesh = (geo: THREE.BufferGeometry, mat: THREE.Material, x = 0, y = 0, z = 0) => {
    const m = new THREE.Mesh(geo, mat);
    m.position.set(x, y, z);
    return add(m);
  };

  /* ------------------------------ the room ------------------------------ */

  const W = 14; // wall width
  const SLAB = 2.62; // underside of the false ceiling
  const GAP = 0.3; // cove slot between the wall and the false ceiling

  const wall = mesh(new THREE.PlaneGeometry(W, 3.3), wallMat, 0, 1.65, 0);
  wall.receiveShadow = true;

  const floor = mesh(new THREE.PlaneGeometry(W, 15), floorMat, 0, 0, 7.5);
  floor.rotation.x = -Math.PI / 2;
  floor.receiveShadow = true;
  // Polished floor: a mirror just under a slightly see-through floor.
  const mirror = add(new Reflector(new THREE.PlaneGeometry(W, 15), { textureWidth: 1024, textureHeight: 1024, color: 0x9a9a9a, clipBias: 0.002 }));
  mirror.rotation.x = -Math.PI / 2;
  mirror.position.set(0, -0.003, 7.5);

  // False ceiling, held off the wall to leave the cove slot.
  mesh(new THREE.BoxGeometry(W, 0.12, 14), slabMat, 0, SLAB + 0.06, GAP + 7);

  // Fluted walnut panelling behind the console.
  const FLUTE = 0.07;
  const fluteCount = 46;
  const fluteWidth = fluteCount * FLUTE;
  mesh(new THREE.BoxGeometry(fluteWidth + 0.04, SLAB, 0.012), boardMat, 0, SLAB / 2, 0.006);
  const flutes = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.031, 0.031, SLAB, 10, 1, true, -Math.PI / 2, Math.PI), fluteMat, fluteCount);
  const m4 = new THREE.Matrix4();
  for (let i = 0; i < fluteCount; i++) {
    m4.makeTranslation(-fluteWidth / 2 + FLUTE / 2 + i * FLUTE, SLAB / 2, 0.012);
    flutes.setMatrixAt(i, m4);
  }
  flutes.receiveShadow = true;
  add(flutes);

  // Floating console with a few quiet objects that catch the light.
  const consoleTop = mesh(new THREE.BoxGeometry(2.7, 0.07, 0.42), stoneMat, 0, 0.56, 0.24);
  consoleTop.castShadow = true;
  consoleTop.receiveShadow = true;
  const lathe = (points: [number, number][], mat: THREE.Material, x: number, z = 0.24) => {
    const m = mesh(new THREE.LatheGeometry(points.map(([r, y]) => new THREE.Vector2(r, y)), 48), mat, x, 0.595, z);
    m.castShadow = true;
    m.receiveShadow = true;
    return m;
  };
  lathe(
    [
      [0, 0],
      [0.07, 0],
      [0.115, 0.08],
      [0.125, 0.2],
      [0.085, 0.33],
      [0.045, 0.4],
      [0.05, 0.46],
      [0.04, 0.46],
    ],
    ceramicMat,
    -0.85,
  );
  lathe(
    [
      [0, 0],
      [0.06, 0],
      [0.17, 0.07],
      [0.19, 0.1],
      [0.175, 0.1],
      [0.05, 0.02],
      [0, 0.02],
    ],
    darkMat,
    0.3,
  );
  const book = (w: number, h: number, mat: THREE.Material, y: number, turn: number) => {
    const b = mesh(new THREE.BoxGeometry(w, h, 0.2), mat, 0.9, 0.595 + y, 0.24);
    b.rotation.y = turn;
    b.castShadow = true;
    b.receiveShadow = true;
  };
  book(0.3, 0.035, darkMat, 0.0175, 0.08);
  book(0.26, 0.03, ceramicMat, 0.05, -0.1);
  const orb = mesh(new THREE.SphereGeometry(0.055, 32, 24), ceramicMat, 0.88, 0.595 + 0.12, 0.25);
  orb.castShadow = true;

  /* ------------------------------ emitters ------------------------------ */

  const emitters: Emitter[] = [];
  const emitter = (layer: LayerKey, delay = 0): Emitter => {
    const e: Emitter = { layer, delay, level: 1, goal: 1, wait: 0, lights: [], surfaces: [], halos: [] };
    emitters.push(e);
    return e;
  };
  /** A diffuser that looks like plain white plastic when off and glows when on. */
  const lamp = (e: Emitter, base: number) => {
    const mat = new THREE.MeshStandardMaterial({ color: "#e9e6df", roughness: 0.6, emissive: "#ffffff", emissiveIntensity: 0 });
    e.surfaces.push({ mat, base });
    return mat;
  };
  const light = <T extends THREE.Light>(e: Emitter, l: T, base: number) => {
    e.lights.push({ light: l, base });
    return add(l);
  };
  /** Camera-facing halo around a ceiling fixture. */
  const halo = (e: Emitter, x: number, y: number, z: number, size: number, base: number) => {
    const mat = new THREE.SpriteMaterial({ map: glow, blending: THREE.AdditiveBlending, depthWrite: false, depthTest: false, opacity: 0 });
    const s = new THREE.Sprite(mat);
    s.scale.set(size, size, 1);
    s.position.set(x, y, z);
    s.renderOrder = 5;
    e.halos.push({ mat, base });
    add(s);
  };
  /** Flat additive wash painted on a surface (wall or ceiling) around a light. */
  const wash = (e: Emitter, map: THREE.Texture, w: number, h: number, base: number) => {
    const mat = new THREE.MeshBasicMaterial({ map, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false, opacity: 0 });
    e.halos.push({ mat, base });
    const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat);
    m.renderOrder = 4;
    return add(m);
  };
  const faceDown = (o: THREE.Object3D) => {
    o.rotation.x = Math.PI / 2;
    return o;
  };

  // STRIP: a hidden LED strip in the cove slot grazing the wall, and one under the console.
  {
    const e = emitter("strip");
    const cove = light(e, new THREE.RectAreaLight("#fff", 1, 13, 0.1), 13);
    cove.position.set(0, SLAB + 0.1, GAP / 2);
    cove.rotation.x = -Math.PI / 2;
    const under = light(emitter("strip", 0.12), new THREE.RectAreaLight("#fff", 1, 2.5, 0.03), 26);
    under.position.set(0, 0.515, 0.27);
    under.rotation.x = -Math.PI / 2;
  }

  // COB: three recessed spots washing the panelling in scallops.
  [-1.07, 0, 1.07].forEach((x, i) => {
    const e = emitter("cob", i * 0.09);
    const z = 0.4;
    faceDown(mesh(new THREE.RingGeometry(0.034, 0.05, 48), trimMat, x, SLAB - 0.0006, z));
    faceDown(mesh(new THREE.CircleGeometry(0.034, 32), cupMat, x, SLAB - 0.0004, z));
    faceDown(mesh(new THREE.CircleGeometry(0.021, 32), lamp(e, 9), x, SLAB - 0.0008, z));
    halo(e, x, SLAB - 0.01, z, 0.3, 0.55);
    const s = light(e, new THREE.SpotLight("#fff", 1, 0, 0.5, 0.6, 2), 30);
    s.position.set(x, SLAB - 0.02, z);
    s.target.position.set(x, 0.5, 0.05);
    add(s.target);
    s.shadow.mapSize.set(1024, 1024);
    s.shadow.bias = -0.0006;
    s.shadow.radius = 5;
    s.shadow.camera.near = 0.3;
    s.shadow.camera.far = 4;
    s.userData.shadow = true;
  });

  // PANEL: four slim round panels in the field of the ceiling.
  {
    const spots: [number, number][] = [
      [-0.85, 1.6],
      [0.85, 1.6],
      [-0.85, 3.2],
      [0.85, 3.2],
    ];
    spots.forEach(([x, z], i) => {
      const e = emitter("panel", i * 0.05);
      faceDown(mesh(new THREE.RingGeometry(0.1, 0.116, 64), trimMat, x, SLAB - 0.0006, z));
      faceDown(mesh(new THREE.CircleGeometry(0.1, 48), lamp(e, 2.3), x, SLAB - 0.0008, z));
      halo(e, x, SLAB - 0.01, z, 0.44, 0.22);
      if (i === 0) {
        // One wide downward light stands in for all four panels.
        const s = light(e, new THREE.SpotLight("#fff", 1, 0, 1.45, 0.5, 2), 40);
        s.position.set(0, SLAB - 0.02, 2.4);
        s.target.position.set(0, 0, 2.4);
        add(s.target);
      }
    });
  }

  // PROFILE: a line of light running down the wall and on across the ceiling, each side of the panelling.
  {
    const line = keep(pathGlowTexture(64, 256, (ctx) => {
      ctx.moveTo(32, 26);
      ctx.lineTo(32, 230);
    }));
    [-1.92, 1.92].forEach((x, i) => {
      const e = emitter("profile", i * 0.1);
      const mat = lamp(e, 5.5);
      mesh(new THREE.BoxGeometry(0.03, SLAB, 0.006), mat, x, SLAB / 2, 0.004);
      mesh(new THREE.BoxGeometry(0.03, 0.006, 4.4), mat, x, SLAB - 0.002, GAP + 2.2);
      wash(e, line, 0.5, SLAB + 0.4, 0.34).position.set(x, SLAB / 2, 0.014);
      const onCeiling = wash(e, line, 0.42, 4.8, 0.24);
      onCeiling.position.set(x, SLAB - 0.004, GAP + 2.2);
      onCeiling.rotation.x = Math.PI / 2;
      const down = light(e, new THREE.RectAreaLight("#fff", 1, 0.03, 4.4), 46);
      down.position.set(x, SLAB - 0.01, GAP + 2.2);
      down.rotation.x = -Math.PI / 2;
      const out = light(e, new THREE.RectAreaLight("#fff", 1, 0.03, SLAB), 26);
      out.position.set(x, SLAB / 2, 0.02);
      out.rotation.y = Math.PI;
      out.userData.highOnly = true;
    });
  }

  // ROPE: two arched niches outlined in flexible rope light.
  {
    const AW = 0.95; // arch width
    const AH = 1.75; // height of the straight sides
    const total = AH + AW / 2;
    const outline: THREE.Vector3[] = [];
    for (let i = 0; i <= 10; i++) outline.push(new THREE.Vector3(-AW / 2, 0.03 + (AH - 0.03) * (i / 10), 0));
    for (let i = 1; i <= 24; i++) {
      const a = Math.PI - (i / 24) * Math.PI;
      outline.push(new THREE.Vector3((Math.cos(a) * AW) / 2, AH + (Math.sin(a) * AW) / 2, 0));
    }
    for (let i = 1; i <= 10; i++) outline.push(new THREE.Vector3(AW / 2, AH - (AH - 0.03) * (i / 10), 0));
    const curve = new THREE.CatmullRomCurve3(outline);

    const shape = new THREE.Shape();
    shape.moveTo(-AW / 2, 0);
    shape.lineTo(-AW / 2, AH);
    shape.absarc(0, AH, AW / 2, Math.PI, 0, true);
    shape.lineTo(AW / 2, 0);
    shape.closePath();

    // Glow decal: the arch drawn into a canvas that covers a little more than the niche.
    const PW = AW + 1.7;
    const PH = total + 1.1;
    const y0 = -0.45;
    const ch = 256;
    const cw = Math.round((ch * PW) / PH);
    const k = ch / PH;
    const archGlow = keep(pathGlowTexture(cw, ch, (ctx) => {
      const X = (x: number) => cw / 2 + x * k;
      const Y = (y: number) => ch - (y - y0) * k;
      ctx.moveTo(X(-AW / 2), Y(0));
      ctx.lineTo(X(-AW / 2), Y(AH));
      ctx.arc(X(0), Y(AH), (AW / 2) * k, Math.PI, 0, false);
      ctx.lineTo(X(AW / 2), Y(0));
    }));

    [-2.78, 2.78].forEach((x, i) => {
      const e = emitter("rope", i * 0.12);
      mesh(new THREE.ShapeGeometry(shape, 32), nicheMat, x, 0, 0.003);
      mesh(new THREE.TubeGeometry(curve, 140, 0.012, 8), lamp(e, 4.2), x, 0, 0.02);
      wash(e, archGlow, PW, PH, 0.85).position.set(x, y0 + PH / 2, 0.012);
      const p = light(e, new THREE.PointLight("#fff", 1, 5, 2), 1);
      p.position.set(x, 1.2, 0.8);
      // A plinth and one object inside each niche.
      const plinth = mesh(new THREE.BoxGeometry(0.3, 0.86, 0.26), nicheMat, x, 0.43, 0.16);
      plinth.receiveShadow = true;
      if (i === 0) mesh(new THREE.SphereGeometry(0.15, 40, 28), ceramicMat, x, 0.86 + 0.15, 0.16);
      else mesh(new THREE.LatheGeometry([[0, 0], [0.07, 0], [0.11, 0.12], [0.06, 0.34], [0.045, 0.42], [0.06, 0.46]].map(([r, y]) => new THREE.Vector2(r, y)), 40), darkMat, x, 0.86, 0.16);
    });
  }

  // Room light that is never switched: faint moonlight so the dark room still reads,
  // plus a hemisphere light standing in for light bouncing off the surfaces.
  const moon = add(new THREE.DirectionalLight("#7d93c4", 0.42));
  moon.position.set(5, 4, 9);
  add(new THREE.AmbientLight("#222a40", 0.6));
  const bounce = add(new THREE.HemisphereLight("#ffffff", "#ffffff", 0));

  /* ------------------------------ state ------------------------------ */

  let state: ShowroomState = { ...DEFAULT_STATE, layers: { ...DEFAULT_STATE.layers } };
  const tint = tintFor(state.kelvin);
  const tintGoal = tint.clone();
  const soft = new THREE.Color();
  let bright = state.brightness;
  let brightGoal = bright;
  const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
  const scroll = { v: 0, t: 0 };
  let view: ShowroomView | null = null;

  const apply = () => {
    const hi = quality === "high";
    // Glowing surfaces stay closer to white than the light they throw.
    soft.copy(tint).lerp(new THREE.Color(1, 1, 1), 0.45);
    let lift = 0;
    for (const e of emitters) {
      const v = e.level;
      for (const l of e.lights) {
        l.light.color.copy(tint);
        l.light.intensity = l.light.userData.highOnly && !hi ? 0 : l.base * v * bright;
      }
      for (const s of e.surfaces) {
        s.mat.emissive.copy(soft);
        s.mat.emissiveIntensity = s.base * v * (0.3 + 0.7 * bright);
      }
      // With bloom on, the halos only need to hint; without it they carry the glow.
      for (const h of e.halos) {
        h.mat.color.copy(tint);
        h.mat.opacity = h.base * v * bright * (hi ? 0.6 : 1);
      }
    }
    for (const key of LAYERS) {
      const group = emitters.filter((e) => e.layer === key);
      lift += BOUNCE[key] * (group.reduce((sum, e) => sum + e.level, 0) / group.length);
    }
    // Light off the floor reaches the ceiling more than light from above reaches the floor.
    bounce.groundColor.copy(soft);
    bounce.color.copy(soft).multiplyScalar(0.55);
    bounce.intensity = lift * bright;
  };

  const placeCamera = () => {
    if (view) {
      camera.fov = view.fov;
      camera.position.set(...view.position);
      camera.lookAt(...view.target);
    } else {
      // Wide screens sit close and level; tall screens step back, widen the lens and tilt
      // down, so the wall sits in the upper part with the polished floor below it.
      const t = THREE.MathUtils.smoothstep(camera.aspect, 0.62, 1.55);
      const mix = THREE.MathUtils.lerp;
      camera.fov = mix(66, 37, t);
      // Far enough back that both rope-lit niches stay in frame.
      const fit = 3.55 / (Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * camera.aspect);
      const dist = THREE.MathUtils.clamp(fit, 5.6, 11.5) * (1 - scroll.v * 0.14);
      camera.position.set(pointer.x * 0.4, mix(1.55, 1.4, t) + pointer.y * 0.14 + scroll.v * 0.1, dist);
      camera.lookAt(pointer.x * 0.05, mix(-1, 1.2, t), 0);
    }
    camera.updateProjectionMatrix();
  };

  /* ------------------------------ rendering ------------------------------ */

  let composer: EffectComposer | null = null;
  const size = new THREE.Vector2(1, 1);
  let ratio = 1;

  // The reflection is soft and dim, so it can be drawn smaller than the screen.
  const sizeMirror = () => {
    const k = quality === "high" ? 1.5 : 2;
    mirror.getRenderTarget().setSize(Math.max(1, Math.round((size.x * ratio) / k)), Math.max(1, Math.round((size.y * ratio) / k)));
  };

  const setupPipeline = () => {
    composer?.dispose();
    composer = null;
    const hi = quality === "high";
    renderer.shadowMap.enabled = hi;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    scene.traverse((o) => {
      if (o.userData.shadow) (o as THREE.SpotLight).castShadow = hi;
    });
    sizeMirror();
    if (hi) {
      const target = new THREE.WebGLRenderTarget(size.x * ratio, size.y * ratio, { type: THREE.HalfFloatType, samples: 4 });
      composer = new EffectComposer(renderer, target);
      composer.setPixelRatio(ratio);
      composer.setSize(size.x, size.y);
      composer.addPass(new RenderPass(scene, camera));
      composer.addPass(new UnrealBloomPass(new THREE.Vector2(size.x * ratio, size.y * ratio), 0.3, 0.7, 0.92));
      composer.addPass(new OutputPass());
    }
  };

  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  setupPipeline();
  apply();
  placeCamera();

  return {
    scene,
    camera,
    setState(next, instant = false) {
      state = { ...next, layers: { ...next.layers } };
      tintGoal.copy(tintFor(THREE.MathUtils.clamp(next.kelvin, 2200, 7500)));
      brightGoal = THREE.MathUtils.clamp(next.brightness, 0.1, 1);
      if (instant) {
        tint.copy(tintGoal);
        bright = brightGoal;
        for (const e of emitters) {
          e.goal = e.level = state.layers[e.layer] ? 1 : 0;
          e.wait = 0;
        }
        apply();
      }
    },
    setPointer(x, y) {
      pointer.tx = THREE.MathUtils.clamp(x, -1, 1);
      pointer.ty = THREE.MathUtils.clamp(y, -1, 1);
    },
    setScroll(progress) {
      scroll.t = THREE.MathUtils.clamp(progress, 0, 1);
    },
    setView(next) {
      view = next;
      placeCamera();
    },
    resize(width, height, pixelRatio) {
      size.set(Math.max(1, width), Math.max(1, height));
      ratio = pixelRatio;
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(size.x, size.y, false);
      composer?.setPixelRatio(pixelRatio);
      composer?.setSize(size.x, size.y);
      sizeMirror();
      camera.aspect = size.x / size.y;
      placeCamera();
    },
    setQuality(next) {
      if (next === quality) return;
      quality = next;
      setupPipeline();
      apply();
    },
    update(dt) {
      let moving = false;
      const ease = 1 - Math.exp(-dt / 0.13);
      for (const e of emitters) {
        const goal = state.layers[e.layer] ? 1 : 0;
        if (goal !== e.goal) {
          e.goal = goal;
          e.wait = goal ? e.delay : e.delay * 0.4;
        }
        if (e.wait > 0) {
          e.wait -= dt;
          moving = true;
        } else if (Math.abs(e.goal - e.level) > 0.003) {
          e.level += (e.goal - e.level) * ease;
          moving = true;
        } else {
          e.level = e.goal;
        }
      }
      const slow = 1 - Math.exp(-dt / 0.22);
      if (Math.abs(tint.r - tintGoal.r) + Math.abs(tint.g - tintGoal.g) + Math.abs(tint.b - tintGoal.b) > 0.004) {
        tint.lerp(tintGoal, slow);
        moving = true;
      } else {
        tint.copy(tintGoal);
      }
      if (Math.abs(bright - brightGoal) > 0.003) {
        bright += (brightGoal - bright) * slow;
        moving = true;
      } else {
        bright = brightGoal;
      }
      if (Math.abs(pointer.tx - pointer.x) + Math.abs(pointer.ty - pointer.y) > 0.002) {
        pointer.x += (pointer.tx - pointer.x) * slow;
        pointer.y += (pointer.ty - pointer.y) * slow;
        moving = true;
      }
      if (Math.abs(scroll.t - scroll.v) > 0.001) {
        scroll.v += (scroll.t - scroll.v) * (1 - Math.exp(-dt / 0.12));
        moving = true;
      }
      apply();
      placeCamera();
      return moving;
    },
    render() {
      if (composer) composer.render();
      else renderer.render(scene, camera);
    },
    dispose() {
      composer?.dispose();
      mirror.dispose();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
        const mats = Array.isArray(m.material) ? m.material : m.material ? [m.material] : [];
        mats.forEach((mat) => mat.dispose());
      });
      textures.forEach((t) => t.dispose());
    },
  };
}
