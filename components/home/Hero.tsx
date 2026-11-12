"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { getImageProps } from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SHOTS, type Shot } from "@/data/shots";
import type { TKey } from "@/data/translations";
import { useT } from "@/lib/i18n";
import { useIsLite, useLang } from "@/lib/prefs";
import { allLayers, LAYERS, type LayerKey, type LayerState } from "@/lib/three/layers";
import { TONES } from "@/lib/kelvin";
import { useSettings } from "@/components/providers/Providers";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";
import { ArrowRightIcon } from "@/components/ui/icons";

// three.js and the scene load only in the browser, after the page is interactive.
const ShowroomCanvas = dynamic(() => import("@/components/three/ShowroomCanvas"), { ssr: false });

/** Order and timing (ms) in which the lights come on once the 3D room is ready. */
const INTRO: [LayerKey, number][] = [
  ["cob", 350],
  ["strip", 800],
  ["profile", 1250],
  ["panel", 1700],
  ["rope", 2150],
];

/** Wide render on landscape screens, tall render on portrait ones. */
function Poster({ wide, tall, alt, className }: { wide: Shot; tall: Shot; alt: string; className: string }) {
  const common = { alt, sizes: "100vw", quality: 80, priority: true };
  const {
    props: { srcSet: wideSet },
  } = getImageProps({ ...common, src: wide.src, width: wide.width, height: wide.height });
  const {
    props: { srcSet: tallSet, ...img },
  } = getImageProps({ ...common, src: tall.src, width: tall.width, height: tall.height });
  return (
    <picture>
      <source media="(min-aspect-ratio: 1/1)" srcSet={wideSet} />
      <source srcSet={tallSet} />
      {/* eslint-disable-next-line @next/next/no-img-element -- art-directed <picture>; props come from next/image */}
      <img {...img} alt={alt} aria-hidden={alt ? undefined : true} className={`absolute inset-0 h-full w-full object-cover ${className}`} />
    </picture>
  );
}

interface DockProps {
  layers: LayerState;
  kelvin: number;
  onToggle: (key: LayerKey) => void;
  onKelvin: (kelvin: number) => void;
}

/** The hero's switch panel: one switch per type of light, and the light colour. */
function LightDock({ layers, kelvin, onToggle, onKelvin }: DockProps) {
  const t = useT();
  const dot = TONES.find((tone) => tone.kelvin === kelvin)?.dot ?? TONES[0].dot;
  return (
    <div className="rounded-3xl border border-white/10 bg-black/45 p-3.5 backdrop-blur-xl sm:p-4 lg:w-[22rem]">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-medium text-white/70">{t("hero.dock")}</p>
        <div role="radiogroup" aria-label={t("hero.tone")} className="flex rounded-full border border-white/15 p-0.5">
          {TONES.map((tone) => (
            <button
              key={tone.key}
              type="button"
              role="radio"
              aria-checked={kelvin === tone.kelvin}
              title={`${tone.kelvin} K`}
              onClick={() => onKelvin(tone.kelvin)}
              className="min-h-[28px] rounded-full px-2.5 text-[0.7rem] text-white/60 transition-colors aria-checked:bg-white aria-checked:text-black"
            >
              {t(`tone.${tone.key}` as TKey)}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-3 grid grid-cols-5 gap-1.5">
        {LAYERS.map((key) => (
          <button
            key={key}
            type="button"
            aria-pressed={layers[key]}
            onClick={() => onToggle(key)}
            className="flex h-14 flex-col items-center justify-center gap-1.5 rounded-2xl border border-white/10 text-[0.7rem] text-white/55 transition-colors duration-300 hover:border-white/30 aria-pressed:border-white/25 aria-pressed:bg-white/10 aria-pressed:text-white"
          >
            <span
              aria-hidden="true"
              className="h-2 w-2 rounded-full transition-[background-color,box-shadow] duration-300"
              style={layers[key] ? { background: dot, boxShadow: `0 0 10px 1px ${dot}` } : { background: "rgb(255 255 255 / 0.22)" }}
            />
            {t(`layer.${key}` as TKey)}
          </button>
        ))}
      </div>
    </div>
  );
}

/**
 * The hero is a live 3D room. It starts dark, then each type of light we sell
 * comes on in turn; visitors can switch them and change the light colour.
 * Lite mode, slow devices and browsers without WebGL get the rendered still.
 */
export function Hero() {
  const t = useT();
  const lang = useLang();
  const lite = useIsLite();
  const s = useSettings();
  const [layers, setLayers] = useState<LayerState>(() => allLayers(false));
  const [kelvin, setKelvin] = useState<number>(TONES[0].kelvin);
  const [mount3d, setMount3d] = useState(false);
  const [live, setLive] = useState(false);
  const [failed, setFailed] = useState(false);
  const [timedOut, setTimedOut] = useState(false);
  const timers = useRef<number[]>([]);
  const started = useRef(false);

  const still = lite || failed;
  const showLit = still || timedOut;

  useEffect(() => {
    if (still) return;
    const list = timers.current;
    list.push(window.setTimeout(() => setMount3d(true), 60));
    // Never leave a slow device in the dark: after 4 s show the lit still instead.
    list.push(
      window.setTimeout(() => {
        if (started.current) return;
        started.current = true;
        setTimedOut(true);
        setLayers(allLayers(true));
      }, 4000),
    );
    return () => {
      list.forEach((id) => window.clearTimeout(id));
      list.length = 0;
    };
  }, [still]);

  const onReady = useCallback(() => {
    setLive(true);
    if (started.current) return;
    started.current = true;
    INTRO.forEach(([key, ms]) => timers.current.push(window.setTimeout(() => setLayers((prev) => ({ ...prev, [key]: true })), ms)));
  }, []);
  const onFail = useCallback(() => setFailed(true), []);

  const state = useMemo(() => ({ layers, kelvin, brightness: 1 }), [layers, kelvin]);
  const headline = lang === "en" && s.headlines[0] ? s.headlines[0] : t("hero.title");

  return (
    <section id="hero" aria-labelledby="hero-title" className="relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-black">
      <Poster wide={SHOTS.showroomOff} tall={SHOTS.showroomOffTall} alt="" className="" />
      <Poster
        wide={SHOTS.showroomOn}
        tall={SHOTS.showroomOnTall}
        alt={SHOTS.showroomOn.alt}
        className={`transition-opacity duration-[1400ms] ease-film ${showLit ? "opacity-100" : "opacity-0"}`}
      />
      <noscript>
        <style>{`#hero picture img { opacity: 1 !important; }`}</style>
      </noscript>
      {mount3d && !still && (
        <div className={`absolute inset-0 transition-opacity duration-700 ease-film ${live ? "opacity-100" : "opacity-0"}`}>
          <ShowroomCanvas state={state} parallax scrollLinked onReady={onReady} onFail={onFail} />
        </div>
      )}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgb(0_0_0/0.92)_0%,rgb(0_0_0/0.55)_30%,transparent_58%)] lg:bg-[linear-gradient(to_top,rgb(0_0_0/0.8)_0%,transparent_45%)]"
      />

      <div className="container-site relative grid gap-6 pb-7 pt-24 sm:pb-10 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-10 lg:pb-12">
        <div>
          <p className="eyebrow text-[0.8rem] text-white/70 sm:text-[0.95rem]">{t("hero.eyebrow")}</p>
          <h1 id="hero-title" className="mt-3 max-w-2xl text-[2.5rem] font-semibold leading-[1.03] tracking-[-0.035em] text-white sm:text-6xl lg:text-7xl">
            {headline}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg">{t("hero.sub")}</p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {/* White pill in both themes: the hero is always a dark room. */}
            <Link href="/products" className="btn bg-white px-6 text-black hover:bg-white/85">
              {t("hero.ctaShop")}
              <ArrowRightIcon size={16} />
            </Link>
            <WhatsAppButton className="btn border border-white/30 px-5 text-white backdrop-blur hover:bg-white/10">{t("hero.ctaWhatsApp")}</WhatsAppButton>
          </div>
        </div>
        {/* The switches only make sense once the live room is running. */}
        {live && !still && (
          <LightDock
            layers={layers}
            kelvin={kelvin}
            onToggle={(key) => setLayers((prev) => ({ ...prev, [key]: !prev[key] }))}
            onKelvin={setKelvin}
          />
        )}
      </div>
    </section>
  );
}
