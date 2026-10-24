"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, type MotionValue } from "framer-motion";
import type { TKey } from "@/data/translations";
import { fmt, useT } from "@/lib/i18n";
import { useIsLite } from "@/lib/prefs";
import { useMediaQuery } from "@/lib/hooks";
import { SHOTS } from "@/data/shots";
import { ShotImage } from "@/components/media/ShotImage";

const STEPS = [
  { key: "plan", href: "/designers", shot: SHOTS.filmPlan },
  { key: "wire", href: "/products?category=technical-supply", shot: SHOTS.filmWire },
  { key: "protect", href: "/products?category=technical-supply&subcategory=mcbs-and-distribution", shot: SHOTS.filmProtect },
  { key: "finish", href: "/#configurator", shot: SHOTS.filmFinish },
] as const;

function StepText({ i, active }: { i: number; active: boolean }) {
  const t = useT();
  const s = STEPS[i];
  const k = (part: string) => `film.${s.key}.${part}` as TKey;
  return (
    <div className={`transition-opacity duration-500 ${active ? "opacity-100" : "opacity-30"}`}>
      <p className="text-sm text-muted">{fmt(t("film.step"), { n: String(i + 1) })}</p>
      <h3 className="mt-1 text-3xl font-semibold leading-tight tracking-[-0.03em] sm:text-5xl">{t(k("title"))}</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-muted sm:mt-3 sm:text-base">{t(k("body"))}</p>
      <Link href={s.href} tabIndex={active ? 0 : -1} className="group mt-4 inline-flex min-h-[44px] items-center gap-1 text-[1.02rem] text-electric hover:text-fg">
        {t(k("cta"))} <span aria-hidden="true">›</span>
      </Link>
    </div>
  );
}

/** “From wall to switch”: a pinned scroll sequence (static cards in Lite mode). */
export function ScrollFilm() {
  const t = useT();
  const lite = useIsLite();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [step, setStep] = useState(0);

  const isDesktop = useMediaQuery("(min-width: 1024px)");

  useMotionValueEvent(scrollYProgress, "change", (v) => setStep(Math.min(3, Math.floor(v * 4))));

  const alt = fmt(t("film.alt"), { steps: STEPS.map((s) => t(`film.${s.key}.title` as TKey)).join(", ") });

  // Rendered in two places (phone / desktop); only one copy carries the id.
  const header = (withId = true) => (
    <div className="max-w-2xl">
      <p className="eyebrow">{t("film.eyebrow")}</p>
      <h2 id={withId ? "film-title" : undefined} className="mt-3 text-4xl font-semibold leading-[1.05] tracking-[-0.035em] sm:text-6xl">
        {t("film.title")}
      </h2>
    </div>
  );

  if (lite) {
    return (
      <section aria-labelledby="film-title" className="container-site py-20 lg:py-28">
        {header()}
        <ol className="mt-12 grid gap-10 md:grid-cols-2">
          {STEPS.map((s, i) => (
            <li key={s.key} className="grid gap-5">
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem]">
                <ShotImage shot={s.shot} sizes="(min-width: 768px) 45vw, 100vw" />
              </div>
              <StepText i={i} active />
            </li>
          ))}
        </ol>
        <p className="mt-10 text-xs text-muted">{t("film.safety")}</p>
      </section>
    );
  }

  return (
    <section aria-labelledby="film-title" className="relative">
      {/* Phones: the heading scrolls in above the pinned frame so the frame fits the screen. */}
      <div className="container-site pt-20 lg:hidden">{header(!isDesktop)}</div>
      {/* Tall scroll track; the inner frame stays pinned while it scrolls. */}
      <div ref={ref} className="relative h-[320vh]">
        <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden pb-6 pt-20 lg:py-20">
          <div className="container-site grid items-center gap-5 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
            <div className="space-y-4 lg:space-y-6">
              <div className="hidden lg:block">{header(isDesktop)}</div>
              {/* Step titles as a compact index; only the current step's text is shown,
                  so the pinned frame fits short screens too. */}
              <ol className="grid grid-cols-4 gap-2">
                {STEPS.map((s, i) => (
                  <li
                    key={s.key}
                    aria-current={i === step ? "step" : undefined}
                    className={`text-xs transition-colors sm:text-sm ${i === step ? "text-fg" : "text-muted/60"}`}
                  >
                    <span className="tabular-nums text-muted">{String(i + 1).padStart(2, "0")}</span>{" "}
                    {t(`film.${s.key}.title` as TKey)}
                  </li>
                ))}
              </ol>
              <Progress p={scrollYProgress} step={step} />
              <div aria-live="polite" className="min-h-[11rem] lg:min-h-[13rem]">
                <StepText i={step} active />
              </div>
            </div>
            <div className="relative mx-auto h-[36svh] w-full max-w-md overflow-hidden rounded-[1.75rem] bg-elev lg:h-[74svh]">
              <p className="sr-only">{alt}</p>
              <AnimatePresence initial={false}>
                <motion.div
                  key={step}
                  className="absolute inset-0"
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                >
                  <ShotImage shot={STEPS[step].shot} sizes="(min-width: 1024px) 28rem, 100vw" />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          <p className="container-site mt-6 text-[0.7rem] text-muted">{t("film.safety")}</p>
        </div>
      </div>
    </section>
  );
}

function Progress({ p, step }: { p: MotionValue<number>; step: number }) {
  const [v, setV] = useState(0);
  useMotionValueEvent(p, "change", setV);
  return (
    <div className="flex items-center gap-2" aria-hidden="true">
      {STEPS.map((s, i) => (
        <span key={s.key} className="h-1 flex-1 overflow-hidden rounded-full bg-fg/10">
          <span
            className="block h-full rounded-full bg-fg"
            style={{ width: `${Math.max(0, Math.min(1, v * 4 - i)) * 100}%`, opacity: i <= step ? 1 : 0.4 }}
          />
        </span>
      ))}
    </div>
  );
}
