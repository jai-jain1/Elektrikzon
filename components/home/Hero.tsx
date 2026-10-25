"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SHOTS } from "@/data/shots";
import { useT } from "@/lib/i18n";
import { useIsLite, useLang } from "@/lib/prefs";
import { useSettings } from "@/components/providers/Providers";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";
import { ShotImage } from "@/components/media/ShotImage";
import { HeroVideo } from "@/components/home/HeroVideo";
import { ArrowRightIcon } from "@/components/ui/icons";

/**
 * Full-bleed film hero: the video (Site settings → Hero video, else
 * public/video/hero.mp4) with the headline and two actions over it.
 * Kept shorter than the screen on phones so the offers peek in below.
 */
export function Hero() {
  const t = useT();
  const lang = useLang();
  const lite = useIsLite();
  const s = useSettings();

  const headline = lang === "en" && s.headlines[0] ? s.headlines[0] : t("hero.title");
  const ease = [0.22, 1, 0.36, 1] as const;
  const rise = (delay: number) =>
    lite ? {} : { initial: { opacity: 0, y: 18 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.9, delay, ease } };

  return (
    <section id="hero" aria-labelledby="hero-title" className="relative isolate flex min-h-[520px] items-end overflow-hidden bg-black h-[78svh] sm:h-[86vh]">
      <ShotImage shot={SHOTS.heroRoom} sizes="100vw" priority hideLabel />
      {s.heroVideo && !lite && <HeroVideo src={s.heroVideo} poster={SHOTS.heroRoom.src ?? undefined} />}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/10" />

      <div className="container-site relative w-full pb-12 sm:pb-16">
        <motion.p className="eyebrow text-white/70" {...rise(0)}>
          {t("hero.eyebrow")}
        </motion.p>
        <motion.h1
          id="hero-title"
          className="mt-3 max-w-3xl text-[2.4rem] font-semibold leading-[1.04] tracking-[-0.035em] text-white sm:text-6xl lg:text-7xl"
          {...rise(0.08)}
        >
          {headline}
        </motion.h1>
        <motion.p className="mt-4 max-w-xl text-base leading-relaxed text-white/75 sm:text-lg" {...rise(0.18)}>
          {t("hero.sub")}
        </motion.p>
        <motion.div className="mt-7 flex flex-wrap items-center gap-3" {...rise(0.28)}>
          {/* White pill in both themes: it sits on the dark film. */}
          <Link href="/products" className="btn bg-white px-6 text-black hover:bg-white/85">
            {t("hero.ctaShop")}
            <ArrowRightIcon size={16} />
          </Link>
          <WhatsAppButton className="btn border border-white/30 px-5 text-white backdrop-blur hover:bg-white/10">{t("hero.ctaWhatsApp")}</WhatsAppButton>
        </motion.div>
      </div>
    </section>
  );
}
