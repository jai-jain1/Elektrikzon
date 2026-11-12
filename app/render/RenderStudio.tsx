"use client";

import { useState } from "react";
import * as THREE from "three";
import { SCENES, type SceneDef } from "@/lib/render/scenes";

const SUPERSAMPLE = 1.5;

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
  // Each scene starts from the studio defaults (the showroom changes some of them).
  renderer.setPixelRatio(1);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const built = def.build(renderer);
  const { scene, camera } = built;
  camera.aspect = def.width / def.height;
  camera.updateProjectionMatrix();
  if (built.render) {
    built.render(w, h);
    built.render(w, h);
  } else {
    renderer.compile(scene, camera);
    renderer.render(scene, camera);
    renderer.render(scene, camera);
  }

  // Downsample for clean anti-aliasing, then encode WebP.
  const out = document.createElement("canvas");
  out.width = def.width;
  out.height = def.height;
  const ctx = out.getContext("2d")!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(renderer.domElement, 0, 0, def.width, def.height);
  const dataUrl = out.toDataURL("image/webp", 0.9);

  if (built.dispose) built.dispose();
  else
    scene.traverse((o) => {
      const m = o as THREE.Mesh;
      if (m.isMesh) m.geometry.dispose();
    });
  return { dataUrl, preview: dataUrl };
}

export default function RenderStudio() {
  const [results, setResults] = useState<Result[]>(SCENES.map((s) => ({ id: s.id, file: s.file, status: "pending" })));
  const [busy, setBusy] = useState(false);
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
      <p style={{ color: "#86868b", fontSize: 14 }}>Renders every image slot in data/shots.ts and saves it to public/shots. Development only.</p>
      <button
        type="button"
        disabled={busy}
        onClick={() => run()}
        data-testid="render-all"
        style={{ padding: "10px 18px", borderRadius: 999, background: "#f5f5f7", color: "#000", border: 0, fontWeight: 600, cursor: "pointer" }}
      >
        {busy ? "Rendering…" : "Render all and save"}
      </button>
      <ul style={{ listStyle: "none", padding: 0, marginTop: 24, display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))" }}>
        {results.map((r) => (
          <li key={r.id} data-shot={r.id} data-status={r.status} style={{ background: "#161617", borderRadius: 16, padding: 10 }}>
            <div style={{ aspectRatio: "16 / 10", background: "#0b0b0c", borderRadius: 10, overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
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
