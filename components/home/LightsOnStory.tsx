"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { SHOTS } from "@/data/shots";
import { useT } from "@/lib/i18n";
import { useIsLite } from "@/lib/prefs";
import { ShotImage } from "@/components/media/ShotImage";

function Line({ p, range, children, last }: { p: MotionValue<number>; range: [number, number, number, number]; children: React.ReactNode; last?: boolean }) {
  const opacity = useTransform(p, range, [0, 1, 1, last ? 1 : 0]);
  const y = useTransform(p, [range[0], range[1]], [30, 0]);
  return (
    <motion.p style={{ opacity, y }} className="absolute inset-x-0 mx-auto max-w-4xl px-4 text-center text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-white sm:text-6xl lg:text-7xl">
      {children}
    </motion.p>
  );
}

/**
 * Pinned scroll sequence: a dark room slowly crossfades to the same room
 * with its lights on, while three lines of copy take turns.
 */
export function LightsOnStory() {
  const t = useT();
  const lite = useIsLite();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const lit = useTransform(p, [0.28, 0.62], [0, 1]);
  const zoom = useTransform(p, [0, 1], [1.08, 1]);
  const ctaOpacity = useTransform(p, [0.78, 0.9], [0, 1]);

  if (lite) {
    return (
      <section aria-label={t("story.label")} className="relative">
        <div className="relative aspect-[4/5] w-full sm:aspect-[16/9]">
          <ShotImage shot={SHOTS.roomOn} sizes="100vw" tone="lit" />
          <div aria-hidden="true" className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-4 text-center">
            <p className="text-3xl font-semibold tracking-[-0.03em] text-white sm:text-5xl">{t("story.1")}</p>
            <p className="text-3xl font-semibold tracking-[-0.03em] text-white sm:text-5xl">{t("story.2")}</p>
            <Link href="/products?category=lighting" className="btn-primary mt-4">
              {t("story.cta")}
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section aria-label={t("story.label")} className="relative">
      <div ref={ref} className="relative h-[300vh]">
        <div className="sticky top-0 h-[100svh] overflow-hidden">
          <motion.div style={{ scale: zoom }} className="absolute inset-0">
            <ShotImage shot={SHOTS.roomOff} sizes="100vw" hideLabel={false} />
            <motion.div style={{ opacity: lit }} className="absolute inset-0">
              <ShotImage shot={SHOTS.roomOn} sizes="100vw" tone="lit" />
            </motion.div>
          </motion.div>
          {/* Legibility veil */}
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/10 to-black/60" />

          <div className="absolute inset-0 flex items-center">
            <div className="relative h-[40%] w-full">
              <Line p={p} range={[0.02, 0.1, 0.24, 0.32]}>
                {t("story.1")}
              </Line>
              <Line p={p} range={[0.34, 0.44, 0.58, 0.66]}>
                {t("story.2")}
              </Line>
              <Line p={p} range={[0.68, 0.78, 1, 1]} last>
                {t("story.3")}
              </Line>
            </div>
          </div>
          <motion.div style={{ opacity: ctaOpacity }} className="absolute inset-x-0 bottom-[14%] flex justify-center">
            <Link href="/products?category=lighting" className="btn-primary px-6">
              {t("story.cta")}
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
