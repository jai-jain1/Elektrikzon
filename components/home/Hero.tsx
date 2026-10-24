"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { SHOTS } from "@/data/shots";
import { useT } from "@/lib/i18n";
import { useIsLite, useLang } from "@/lib/prefs";
import { useSettings } from "@/components/providers/Providers";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";
import { ShotImage } from "@/components/media/ShotImage";
import { HeroVideo } from "@/components/home/HeroVideo";

/**
 * Apple-style hero: a large centred headline over black, then the hero
 * photograph rising and scaling to full width as the visitor scrolls.
 */
export function Hero() {
  const t = useT();
  const lang = useLang();
  const lite = useIsLite();
  const s = useSettings();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const textOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.35], [0, -40]);
  const imgScale = useTransform(scrollYProgress, [0, 0.6], [0.88, 1]);
  const imgRadius = useTransform(scrollYProgress, [0, 0.6], [32, 0]);

  const headline = lang === "en" && s.headlines[0] ? s.headlines[0] : t("hero.title");
  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <section ref={ref} id="hero" aria-labelledby="hero-title" className="relative bg-bg pt-28 sm:pt-36">
      <motion.div style={lite ? undefined : { opacity: textOpacity, y: textY }} className="container-site text-center">
        <motion.p
          className="eyebrow"
          initial={lite ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
        >
          {t("hero.eyebrow")}
        </motion.p>
        <motion.h1
          id="hero-title"
          className="mx-auto mt-4 max-w-5xl bg-gradient-to-b from-fg to-fg/55 bg-clip-text pb-2 text-[2.7rem] font-semibold leading-[1.02] tracking-[-0.045em] text-transparent sm:text-7xl lg:text-[6.2rem]"
          initial={lite ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.1, ease }}
        >
          {headline}
        </motion.h1>
        <motion.p
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted sm:text-xl"
          initial={lite ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.25, ease }}
        >
          {t("hero.sub")}
        </motion.p>
        <motion.div
          className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-7"
          initial={lite ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.4, ease }}
        >
          <WhatsAppButton className="btn-primary px-6">{t("hero.ctaQuote")}</WhatsAppButton>
          <Link href="/products" className="group inline-flex min-h-[44px] items-center gap-1 text-[1.05rem] text-electric hover:text-fg">
            {t("hero.ctaBrowse")}
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
              ›
            </span>
          </Link>
        </motion.div>
      </motion.div>

      {/* Hero photograph: scales up to full bleed as you scroll. */}
      <div className="mt-14 sm:mt-20">
        <motion.div
          style={lite ? undefined : { scale: imgScale, borderRadius: imgRadius }}
          className="relative mx-auto aspect-[4/5] w-full overflow-hidden sm:aspect-[16/9]"
        >
          <ShotImage shot={SHOTS.hero} sizes="100vw" priority />
          {/* Optional hero film (public/video/hero.mp4 via CONFIG.heroVideo); off in Lite mode. */}
          {s.heroVideo && !lite && <HeroVideo src={s.heroVideo} poster={SHOTS.hero.src ?? undefined} />}
          <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-bg to-transparent" />
        </motion.div>
      </div>
    </section>
  );
}
