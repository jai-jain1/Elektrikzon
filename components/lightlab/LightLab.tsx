"use client";

import { useMemo, useState } from "react";
import type { TKey } from "@/data/translations";
import { fmt, useT } from "@/lib/i18n";
import { kelvinToRgb, toneFor, TONE_EN } from "@/lib/kelvin";
import { useQuote } from "@/lib/quote";
import { useUI } from "@/lib/ui";
import { copyText } from "@/lib/clipboard";
import { RoomScene } from "@/components/lightlab/RoomScene";
import { CopyIcon } from "@/components/ui/icons";

export type RoomKey = "living" | "bedroom" | "kitchen" | "bathroom" | "office";

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

/** Product types worth discussing for a room (suggestions, not product claims). */
const IDEAS: Record<RoomKey, string[]> = {
  living: ["cove strip light", "downlights", "pendant"],
  bedroom: ["cove strip light", "downlights", "bedside switch"],
  kitchen: ["panel or downlights", "under-cabinet strip"],
  bathroom: ["downlights", "mirror light"],
  office: ["panel lights", "desk-area downlights"],
};

const MIN_K = 2700;
const MAX_K = 6500;

export function LightLab() {
  const t = useT();
  const add = useQuote((s) => s.add);
  const showToast = useUI((u) => u.showToast);
  const [room, setRoom] = useState<RoomKey>("living");
  const [kelvin, setKelvin] = useState(3000);
  const [brightness, setBrightness] = useState(70);

  const rgb = useMemo(() => kelvinToRgb(kelvin), [kelvin]);
  const tone = toneFor(kelvin);
  const roomEn = ROOMS.find((r) => r.key === room)!.en;
  const roomLabel = t(`room.${room}` as TKey);

  const ideas = [...IDEAS[room], ...(brightness < 80 ? ["dimmer"] : [])];
  const detail = `${kelvin} K (${TONE_EN[tone]}), ${brightness}% brightness. Ideas to discuss: ${ideas.join(", ")}.`;
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

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-14">
          <figure>
            <div
              className="relative aspect-[16/10] overflow-hidden rounded-3xl border hairline"
              style={{ boxShadow: `0 40px 120px -50px rgb(${rgb.join(",")} / ${0.2 + (brightness / 100) * 0.5})`, transition: "box-shadow 450ms" }}
            >
              <RoomScene room={room} rgb={rgb} brightness={brightness} />
            </div>
            <figcaption className="mt-3 flex flex-wrap justify-between gap-2 text-xs text-muted">
              <span aria-live="polite" className="sr-only">
                {fmt(t("light.alt"), { room: roomLabel, k: String(kelvin), b: String(brightness) })}
              </span>
              <span aria-hidden="true">
                {roomLabel} · {kelvin} K · {t(tone)} · {brightness}%
              </span>
              <span>{t("light.note")}</span>
            </figcaption>
          </figure>

          <div className="space-y-7">
            <fieldset>
              <legend className="eyebrow mb-3 font-sans">{t("light.room")}</legend>
              <div className="flex flex-wrap gap-2">
                {ROOMS.map((r) => (
                  <label key={r.key} className="cursor-pointer">
                    <input type="radio" name="ll-room" checked={room === r.key} onChange={() => setRoom(r.key)} className="peer sr-only" />
                    <span className="inline-flex min-h-[40px] items-center rounded-full border px-4 text-sm text-muted transition-colors hairline peer-checked:border-accent peer-checked:bg-accent/10 peer-checked:text-fg peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-amber">
                      {t(`room.${r.key}` as TKey)}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

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
