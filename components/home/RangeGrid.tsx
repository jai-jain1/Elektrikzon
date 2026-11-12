"use client";

import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/types/catalog";
import { RANGE_SHOTS } from "@/data/shots";
import { fmt, useT } from "@/lib/i18n";
import { useLang } from "@/lib/prefs";
import { localized } from "@/lib/localize";
import { sanityLoader } from "@/lib/sanity/image";
import { ShotImage } from "@/components/media/ShotImage";
import { Tilt } from "@/components/motion/Tilt";
import { Reveal } from "@/components/motion/Reveal";

interface Props {
  categories: Category[];
  counts: Record<string, number>;
}

const SIZES = "(min-width: 1024px) 24vw, 50vw";

/**
 * “Shop by type of light”: one tile per category. The image is the
 * category's cover photo from the Studio, or the 3D render for the eight
 * built-in types.
 */
export function RangeGrid({ categories, counts }: Props) {
  const t = useT();
  const lang = useLang();
  if (!categories.length) return null;

  return (
    <section aria-labelledby="range-title" className="py-14 lg:py-24">
      <div className="container-site">
        <p className="eyebrow">{t("home.rangeEyebrow")}</p>
        <h2 id="range-title" className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.02em] sm:text-5xl">
          {t("home.catTitle")}
        </h2>
      </div>
      <ul className="container-site mt-8 grid grid-cols-2 gap-3 sm:gap-4 lg:mt-12 lg:grid-cols-4">
        {categories.map((c, i) => {
          const n = counts[c.slug] ?? 0;
          const shot = RANGE_SHOTS[c.slug];
          return (
            <Reveal key={c.id} as="li" delay={(i % 4) * 0.05}>
              <Link href={`/products?category=${c.slug}`} className="group block h-full overflow-hidden rounded-[1.375rem] bg-elev">
                <Tilt className="relative aspect-[4/3] overflow-hidden rounded-[1.375rem] bg-black">
                  {c.coverImage ? (
                    <Image
                      loader={sanityLoader}
                      src={c.coverImage.url}
                      alt={c.coverImage.alt}
                      fill
                      sizes={SIZES}
                      placeholder={c.coverImage.lqip ? "blur" : "empty"}
                      blurDataURL={c.coverImage.lqip}
                      className="object-cover transition-transform duration-700 ease-film group-hover:scale-[1.05]"
                    />
                  ) : shot ? (
                    <ShotImage shot={shot} sizes={SIZES} className="transition-transform duration-700 ease-film group-hover:scale-[1.05]" />
                  ) : (
                    <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgb(255_255_255/0.14),transparent_65%)]" />
                  )}
                </Tilt>
                <div className="px-4 pb-4 pt-3 sm:px-5 sm:pb-5">
                  <h3 className="text-base font-semibold leading-snug tracking-[-0.015em] sm:text-lg">{localized(lang, c.title, c.titleHi)}</h3>
                  {c.description && <p className="mt-1 hidden text-sm leading-snug text-muted sm:line-clamp-2">{localized(lang, c.description, c.descriptionHi)}</p>}
                  <p className="mt-1.5 text-xs text-muted">{n === 1 ? t("col.count1") : fmt(t("col.count"), { n: String(n) })}</p>
                </div>
              </Link>
            </Reveal>
          );
        })}
      </ul>
    </section>
  );
}
