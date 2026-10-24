"use client";

import { useState } from "react";
import * as THREE from "three";
import { HERO_SCENE, HERO_VIDEO, heroFrame, SCENES, type SceneDef } from "@/lib/render/scenes";

const SUPERSAMPLE = 1.5;
const VIDEO_TYPE = "video/mp4;codecs=avc1.640028";

/**
 * Records the hero loop: renders each frame deterministically, pushes it
 * into a canvas stream at a steady 30 fps and encodes H.264 MP4.
 */
async function recordHeroVideo(onProgress: (p: number) => void): Promise<{ blob: Blob; ms: number }> {
  const { width, height, seconds, fps } = HERO_VIDEO;
  const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
  renderer.setPixelRatio(1);
  renderer.setSize(width, height, false);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = HERO_SCENE.exposure ?? 1;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  // Keep the canvas in the document so the browser composites it for capture.
  const canvas = renderer.domElement;
  Object.assign(canvas.style, { position: "fixed", right: "8px", bottom: "8px", width: "320px", height: "180px", zIndex: "10", borderRadius: "8px" });
  document.body.appendChild(canvas);

  const built = HERO_SCENE.build(renderer);
  built.camera.aspect = width / height;
  built.camera.updateProjectionMatrix();
  heroFrame(built, 0);
  renderer.compile(built.scene, built.camera);
  renderer.render(built.scene, built.camera);

  const stream = canvas.captureStream(0);
  const track = stream.getVideoTracks()[0] as CanvasCaptureMediaStreamTrack;
  const rec = new MediaRecorder(stream, { mimeType: VIDEO_TYPE, videoBitsPerSecond: 4_500_000 });
  const chunks: Blob[] = [];
  rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
  const stopped = new Promise<void>((resolve) => (rec.onstop = () => resolve()));

  const frames = seconds * fps;
  const frameMs = 1000 / fps;
  rec.start();
  const t0 = performance.now();
  for (let i = 0; i < frames; i++) {
    heroFrame(built, i / frames);
    renderer.render(built.scene, built.camera);
    track.requestFrame();
    onProgress((i + 1) / frames);
    const due = t0 + (i + 1) * frameMs;
    while (performance.now() < due) await new Promise((r) => setTimeout(r, 2));
  }
  const ms = performance.now() - t0;
  rec.stop();
  await stopped;
  track.stop();
  canvas.remove();
  renderer.dispose();
  return { blob: new Blob(chunks, { type: "video/mp4" }), ms };
}

interface Result {
  id: string;
  file: string;
  url?: string;
  status: "pending" | "rendering" | "saved" | "error";
  note?: string;
}

async function renderOne(renderer: THREE.WebGLRenderer, def: SceneDef): Promise<{ dataUrl: string; preview: string }> {
  const w = Math.round(def.width * SUPERSAMPLE);
  const h = Math.round(def.height * SUPERSAMPLE);
  renderer.setSize(w, h, false);
  renderer.toneMappingExposure = def.exposure ?? 1;
  const { scene, camera } = def.build(renderer);
  camera.aspect = def.width / def.height;
  camera.updateProjectionMatrix();
  renderer.compile(scene, camera);
  renderer.render(scene, camera);
  renderer.render(scene, camera);

  // Downsample for clean anti-aliasing, then encode WebP.
  const out = document.createElement("canvas");
  out.width = def.width;
  out.height = def.height;
  const ctx = out.getContext("2d")!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(renderer.domElement, 0, 0, def.width, def.height);
  const dataUrl = out.toDataURL("image/webp", 0.9);

  scene.traverse((o) => {
    const m = o as THREE.Mesh;
    if (m.isMesh) {
      m.geometry.dispose();
    }
  });
  return { dataUrl, preview: dataUrl };
}

export default function RenderStudio() {
  const [results, setResults] = useState<Result[]>(SCENES.map((s) => ({ id: s.id, file: s.file, status: "pending" })));
  const [busy, setBusy] = useState(false);
  const [video, setVideo] = useState<{ status: string; url?: string }>({ status: "idle" });

  const runVideo = async () => {
    setBusy(true);
    setVideo({ status: "recording 0%" });
    try {
      const { blob, ms } = await recordHeroVideo((p) => setVideo({ status: `recording ${Math.round(p * 100)}%` }));
      const res = await fetch(`/api/dev/save-video?file=${HERO_VIDEO.file}`, { method: "POST", body: blob });
      const json = await res.json();
      setVideo({
        status: res.ok ? `saved ${Math.round(json.bytes / 1024)} KB in ${(ms / 1000).toFixed(1)} s` : `error: ${json.message}`,
        url: URL.createObjectURL(blob),
      });
    } catch (e) {
      setVideo({ status: `error: ${String(e)}` });
    }
    setBusy(false);
  };

  const update = (id: string, patch: Partial<Result>) => setResults((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const run = async (ids?: string[]) => {
    setBusy(true);
    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setPixelRatio(1);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    for (const def of SCENES.filter((s) => !ids || ids.includes(s.id))) {
      update(def.id, { status: "rendering" });
      await new Promise((r) => setTimeout(r, 30));
      try {
        const { dataUrl, preview } = await renderOne(renderer, def);
        const res = await fetch("/api/dev/save-shot", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ file: def.file, data: dataUrl }),
        });
        const json = await res.json();
        update(def.id, { status: res.ok ? "saved" : "error", url: preview, note: res.ok ? `${Math.round(json.bytes / 1024)} KB` : json.message });
      } catch (e) {
        update(def.id, { status: "error", note: String(e) });
      }
    }
    renderer.dispose();
    setBusy(false);
  };

  return (
    <main style={{ background: "#000", color: "#f5f5f7", minHeight: "100vh", padding: 24, fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ fontSize: 22, margin: 0 }}>ElektrikZone render studio</h1>
      <p style={{ color: "#86868b", fontSize: 14 }}>Renders every photography slot and saves it to public/shots. Development only.</p>
      <button
        type="button"
        disabled={busy}
        onClick={() => run()}
        data-testid="render-all"
        style={{ padding: "10px 18px", borderRadius: 999, background: "#f5f5f7", color: "#000", border: 0, fontWeight: 600, cursor: "pointer" }}
      >
        {busy ? "Rendering…" : "Render all and save"}
      </button>
      <button
        type="button"
        disabled={busy}
        onClick={runVideo}
        data-testid="render-video"
        style={{ marginLeft: 12, padding: "10px 18px", borderRadius: 999, background: "none", color: "#f5f5f7", border: "1px solid #444", fontWeight: 600, cursor: "pointer" }}
      >
        Record hero video ({HERO_VIDEO.seconds} s loop)
      </button>
      <span data-testid="video-status" style={{ marginLeft: 12, fontSize: 13, color: "#86868b" }}>
        {video.status}
      </span>
      {video.url && <video src={video.url} autoPlay muted loop playsInline style={{ display: "block", marginTop: 16, width: 480, borderRadius: 12 }} />}
      <ul style={{ listStyle: "none", padding: 0, marginTop: 24, display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
        {results.map((r) => (
          <li key={r.id} data-shot={r.id} data-status={r.status} style={{ background: "#161617", borderRadius: 16, padding: 10 }}>
            <div style={{ aspectRatio: "4 / 3", background: "#0b0b0c", borderRadius: 10, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {/* eslint-disable-next-line @next/next/no-img-element -- local data-URL preview */}
              {r.url ? <img src={r.url} alt={r.id} style={{ width: "100%", height: "100%", objectFit: "contain" }} /> : <span style={{ color: "#555", fontSize: 12 }}>{r.status}</span>}
            </div>
            <p style={{ margin: "8px 4px 0", fontSize: 13, display: "flex", justifyContent: "space-between", gap: 8 }}>
              <span>{r.file}</span>
              <span style={{ color: r.status === "error" ? "#ff6b6b" : "#86868b" }}>{r.note ?? r.status}</span>
            </p>
            <button type="button" disabled={busy} onClick={() => run([r.id])} style={{ marginTop: 6, fontSize: 12, background: "none", color: "#a1a1a6", border: "1px solid #333", borderRadius: 999, padding: "4px 10px", cursor: "pointer" }}>
              Re-render
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
