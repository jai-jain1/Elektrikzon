"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SHOTS } from "@/data/shots";
import type { TKey } from "@/data/translations";
import { fmt, useT } from "@/lib/i18n";
import { kelvinToRgb, toneFor, TONE_EN } from "@/lib/kelvin";
import { useIsLite } from "@/lib/prefs";
import { useQuote } from "@/lib/quote";
import { allLayers, LAYERS, type LayerKey, type LayerState } from "@/lib/three/layers";
import { useUI } from "@/lib/ui";
import { copyText } from "@/lib/clipboard";
import { ShotImage } from "@/components/media/ShotImage";
import { CopyIcon } from "@/components/ui/icons";

// three.js and the scene load only in the browser.
const ShowroomCanvas = dynamic(() => import("@/components/three/ShowroomCanvas"), { ssr: false });

type RoomKey = "living" | "bedroom" | "kitchen" | "bathroom" | "office";

const ROOMS: { key: RoomKey; en: string }[] = [
  { key: "living", en: "Living room" },
  { key: "bedroom", en: "Bedroom" },
  { key: "kitchen", en: "Kitchen" },
  { key: "bathroom", en: "Bathroom" },
  { key: "office", en: "Office" },
];

const PRESETS: { key: string; kelvin: number; brightness: number; room?: RoomKey }[] = [
  { key: "evening", kelvin: 2700, brightness: 40, room: "living" },
  { key: "reading", kelvin: 3000, brightness: 80, room: "bedroom" },
  { key: "kitchen", kelvin: 4000, brightness: 100, room: "kitchen" },
  { key: "office", kelvin: 5000, brightness: 90, room: "office" },
];

/** Names used in the brief, which is always in English for the shop. */
const LAYER_EN: Record<LayerKey, string> = {
  panel: "panel lights",
  cob: "COB downlights",
  strip: "strip lights",
  profile: "profile lights",
  rope: "rope lights",
};

const MIN_K = 2700;
const MAX_K = 6500;

const pill =
  "inline-flex min-h-[40px] items-center rounded-full border px-4 text-sm text-muted transition-colors hairline peer-checked:border-accent peer-checked:bg-accent/10 peer-checked:text-fg peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-amber";

/**
 * Light Lab: the 3D room with every control exposed. Switch each type of
 * light, slide from warm to cool, dim it, then send the result as a brief.
 * Lite mode and browsers without WebGL get the rendered still, tinted and
 * dimmed with CSS (without the per-light switches).
 */
export function LightLab() {
  const t = useT();
  const lite = useIsLite();
  const add = useQuote((s) => s.add);
  const showToast = useUI((u) => u.showToast);
  const [room, setRoom] = useState<RoomKey>("living");
  const [kelvin, setKelvin] = useState(3000);
  const [brightness, setBrightness] = useState(80);
  const [layers, setLayers] = useState<LayerState>(() => allLayers(true));
  const [mounted, setMounted] = useState(false);
  const [live, setLive] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => setMounted(true), []);
  const onReady = useCallback(() => setLive(true), []);
  const onFail = useCallback(() => setFailed(true), []);

  const still = lite || failed;
  const state = useMemo(() => ({ layers, kelvin, brightness: brightness / 100 }), [layers, kelvin, brightness]);
  const rgb = useMemo(() => kelvinToRgb(kelvin), [kelvin]);
  const tone = toneFor(kelvin);
  const roomEn = ROOMS.find((r) => r.key === room)!.en;
  const roomLabel = t(`room.${room}` as TKey);

  const chosen = LAYERS.filter((k) => layers[k]).map((k) => LAYER_EN[k]);
  const detail = [
    `${kelvin} K (${TONE_EN[tone]}), ${brightness}% brightness.`,
    !still && chosen.length ? `Lights: ${chosen.join(", ")}.` : "",
    brightness < 80 ? "Would like it dimmable." : "",
  ]
    .filter(Boolean)
    .join(" ");
  const brief = `Lighting brief: ${roomEn}\n${detail}`;

  const onCopy = async () => {
    await copyText(brief);
    add({
      kind: "lighting",
      title: `Lighting brief: ${roomEn}`,
      titleHi: `लाइटिंग ब्रीफ़: ${roomLabel}`,
      detail,
    });
    showToast(t("light.copied"));
  };

  const tempTrack = `linear-gradient(90deg, rgb(${kelvinToRgb(MIN_K).join(",")}), rgb(${kelvinToRgb(4000).join(",")}), rgb(${kelvinToRgb(MAX_K).join(",")}))`;
  const brightTrack = "linear-gradient(90deg, #111, rgb(var(--fg)))";
  // The still was rendered at 3000 K: shift it towards the chosen colour and dim it.
  const shift = Math.min(1, Math.max(0, (kelvin - 3000) / 3500));

  return (
    <section id="light-lab" aria-labelledby="light-title" className="scroll-mt-24 py-20 lg:py-28">
      <div className="container-site">
        <div className="max-w-2xl">
          <p className="eyebrow">{t("light.eyebrow")}</p>
          <h2 id="light-title" className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.02em] sm:text-5xl">
            {t("light.title")}
          </h2>
          <p className="mt-5 text-muted">{t("light.sub")}</p>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-14">
          <figure className="lg:sticky lg:top-24 lg:self-start">
            <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-black sm:aspect-[16/10]">
              <ShotImage shot={SHOTS.showroomOn} sizes="(min-width: 1024px) 60vw, 100vw" priority />
              {still && (
                <>
                  <div aria-hidden="true" className="absolute inset-0 transition-opacity duration-500" style={{ background: `rgb(${rgb.join(",")})`, mixBlendMode: "color", opacity: shift * 0.6 }} />
                  <div aria-hidden="true" className="absolute inset-0 bg-black transition-opacity duration-500" style={{ opacity: (1 - brightness / 100) * 0.8 }} />
                </>
              )}
              {mounted && !still && (
                <div className={`absolute inset-0 transition-opacity duration-700 ease-film ${live ? "opacity-100" : "opacity-0"}`}>
                  <ShowroomCanvas state={state} parallax onReady={onReady} onFail={onFail} />
                </div>
              )}
            </div>
            <figcaption className="mt-3 flex flex-wrap justify-between gap-2 text-xs text-muted">
              <span aria-live="polite" className="sr-only">
                {fmt(t("light.alt"), { k: String(kelvin), b: String(brightness) })}
              </span>
              <span aria-hidden="true">
                {kelvin} K · {t(tone)} · {brightness}%
              </span>
              <span>{t("light.note")}</span>
            </figcaption>
          </figure>

          <div className="space-y-7">
            {!still && (
              <fieldset>
                <legend className="eyebrow mb-3 font-sans">{t("light.lights")}</legend>
                <div className="flex flex-wrap gap-2">
                  {LAYERS.map((key) => (
                    <label key={key} className="cursor-pointer">
                      <input type="checkbox" checked={layers[key]} onChange={() => setLayers((prev) => ({ ...prev, [key]: !prev[key] }))} className="peer sr-only" />
                      <span className={pill}>{t(`layer.${key}.long` as TKey)}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            )}

            <div>
              <label htmlFor="ll-temp" className="flex items-baseline justify-between text-sm">
                <span className="eyebrow font-sans">{t("light.temp")}</span>
                <span className="tabular-nums text-fg">
                  {kelvin} K · <span className="text-muted">{t(tone)}</span>
                </span>
              </label>
              <input
                id="ll-temp"
                type="range"
                min={MIN_K}
                max={MAX_K}
                step={100}
                value={kelvin}
                onChange={(e) => setKelvin(Number(e.target.value))}
                aria-valuetext={`${kelvin} K, ${t(tone)}`}
                className="ez-range"
                style={{ ["--track" as string]: tempTrack }}
              />
            </div>

            <div>
              <label htmlFor="ll-bright" className="flex items-baseline justify-between text-sm">
                <span className="eyebrow font-sans">{t("light.bright")}</span>
                <span className="tabular-nums text-fg">{brightness}%</span>
              </label>
              <input
                id="ll-bright"
                type="range"
                min={10}
                max={100}
                step={5}
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                aria-valuetext={`${brightness}%`}
                className="ez-range"
                style={{ ["--track" as string]: brightTrack }}
              />
            </div>

            <fieldset>
              <legend className="eyebrow mb-3 font-sans">{t("light.presets")}</legend>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((p) => (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => {
                      setKelvin(p.kelvin);
                      setBrightness(p.brightness);
                      if (p.room) setRoom(p.room);
                    }}
                    className="inline-flex min-h-[40px] items-center gap-2 rounded-full border px-4 text-sm text-muted transition-colors hairline hover:text-fg"
                  >
                    <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full" style={{ background: `rgb(${kelvinToRgb(p.kelvin).join(",")})` }} />
                    {t(`light.preset.${p.key}` as TKey)}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="eyebrow mb-3 font-sans">{t("light.room")}</legend>
              <div className="flex flex-wrap gap-2">
                {ROOMS.map((r) => (
                  <label key={r.key} className="cursor-pointer">
                    <input type="radio" name="ll-room" checked={room === r.key} onChange={() => setRoom(r.key)} className="peer sr-only" />
                    <span className={pill}>{t(`room.${r.key}` as TKey)}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="rounded-2xl border bg-surface/60 p-5 hairline">
              <p className="eyebrow font-sans">{t("light.briefTitle")}</p>
              <pre className="mt-3 whitespace-pre-wrap font-sans text-sm leading-relaxed text-fg">{brief}</pre>
              <button type="button" onClick={onCopy} className="btn-primary mt-5 w-full">
                <CopyIcon size={16} />
                {t("light.copy")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
