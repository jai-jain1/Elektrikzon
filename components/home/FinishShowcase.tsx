"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CONFIGURATOR_FINISHES } from "@/data/configurator";
import { FINISH_SHOTS } from "@/data/shots";
import { useT } from "@/lib/i18n";
import { useIsLite, useLang } from "@/lib/prefs";
import { newUid } from "@/lib/configurator";
import { ShotImage } from "@/components/media/ShotImage";
import { PlatePreview } from "@/components/configurator/PlatePreview";
import { Reveal } from "@/components/motion/Reveal";

// Fixed demo plate for the finish preview (illustration until photos exist).
const DEMO = ["switch-1way", "switch-1way", "socket"].map((moduleId) => ({ uid: newUid(), moduleId }));

/** Apple-style finish picker: one large stage, swatches underneath. */
export function FinishShowcase() {
  const t = useT();
  const lang = useLang();
  const lite = useIsLite();
  const [id, setId] = useState(CONFIGURATOR_FINISHES[1].id);
  const finish = CONFIGURATOR_FINISHES.find((f) => f.id === id) ?? CONFIGURATOR_FINISHES[0];
  const shot = FINISH_SHOTS[finish.id];
  const label = lang === "hi" ? finish.labelHi : finish.id;

  return (
    <section aria-labelledby="finish-title" className="bg-bg py-24 lg:py-36">
      <Reveal className="container-site text-center">
        <p className="eyebrow">{t("finish.eyebrow")}</p>
        <h2 id="finish-title" className="mx-auto mt-3 max-w-3xl text-4xl font-semibold leading-[1.05] tracking-[-0.035em] sm:text-6xl">
          {t("finish.title")}
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-lg text-muted">{t("finish.sub")}</p>
      </Reveal>

      <Reveal delay={0.1} className="container-site mt-14">
        <div className="relative mx-auto aspect-[4/3] max-w-4xl overflow-hidden rounded-[2rem] bg-elev sm:aspect-[16/9]">
          <AnimatePresence initial={false} mode="popLayout">
            <motion.div
              key={finish.id}
              className="absolute inset-0"
              initial={lite ? false : { opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              {shot?.src ? (
                <ShotImage shot={shot} sizes="(min-width: 1024px) 896px, 100vw" />
              ) : (
                <div
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ background: "radial-gradient(ellipse at 50% 35%, #2a2a2c 0%, #121213 55%, #000 100%)" }}
                >
                  <div className="w-[62%] max-w-md">
                    <PlatePreview size={4} placed={DEMO} finish={finish} />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          <p className="absolute bottom-5 left-0 right-0 text-center text-sm font-medium text-white/80" aria-live="polite">
            {label}
          </p>
        </div>

        <fieldset className="mt-8">
          <legend className="sr-only">{t("finish.pick")}</legend>
          <div className="flex flex-wrap justify-center gap-3">
            {CONFIGURATOR_FINISHES.map((f) => (
              <label key={f.id} className="cursor-pointer" title={lang === "hi" ? f.labelHi : f.id}>
                <input type="radio" name="showcase-finish" checked={id === f.id} onChange={() => setId(f.id)} className="peer sr-only" />
                <span className="sr-only">{lang === "hi" ? f.labelHi : f.id}</span>
                <span
                  aria-hidden="true"
                  className="block h-9 w-9 rounded-full p-[3px] ring-1 ring-transparent transition-shadow peer-checked:ring-fg peer-focus-visible:ring-2 peer-focus-visible:ring-fg"
                >
                  <span
                    className="block h-full w-full rounded-full"
                    style={{
                      background: f.metalness > 0.5 ? `linear-gradient(135deg, #ffffff99, ${f.plate} 45%, #00000066)` : f.plate,
                      boxShadow: "inset 0 0 0 1px rgb(255 255 255 / 0.15)",
                    }}
                  />
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <div className="mt-8 text-center">
          <Link href="/#configurator" className="group inline-flex min-h-[44px] items-center gap-1 text-[1.05rem] text-electric hover:text-fg">
            {t("finish.cta")}
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
              ›
            </span>
          </Link>
          <p className="mt-2 text-xs text-muted">{t("hero.finishNote")}</p>
        </div>
      </Reveal>
    </section>
  );
}
