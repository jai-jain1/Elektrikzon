"use client";

import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/types/catalog";
import { CATEGORY_SHOTS, SHOTS } from "@/data/shots";
import { useT } from "@/lib/i18n";
import { useLang } from "@/lib/prefs";
import { localized } from "@/lib/localize";
import { sanityLoader } from "@/lib/sanity/image";
import { ShotImage } from "@/components/media/ShotImage";

/** Compact “Shop by category” tiles: a swipe row on phones, a grid on desktop. */
export function CategoryRow({ categories }: { categories: Category[] }) {
  const t = useT();
  const lang = useLang();
  if (!categories.length) return null;

  return (
    <section aria-labelledby="cat-title" className="pt-14 lg:pt-20">
      <h2 id="cat-title" className="container-site text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
        {t("home.catTitle")}
      </h2>
      <ul className="container-site mt-6 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 lg:grid lg:grid-cols-6 lg:overflow-visible">
        {categories.map((c) => (
          <li key={c.id} className="w-[38%] shrink-0 snap-start sm:w-[24%] lg:w-auto">
            <Link href={`/products?category=${c.slug}`} className="group block">
              <div className="relative aspect-square overflow-hidden rounded-2xl bg-elev">
                {c.coverImage ? (
                  <Image
                    loader={sanityLoader}
                    src={c.coverImage.url}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 16vw, 38vw"
                    className="object-cover transition-transform duration-700 ease-film group-hover:scale-[1.04]"
                  />
                ) : (
                  <ShotImage
                    shot={CATEGORY_SHOTS[c.slug] ?? SHOTS.lineSwitches}
                    sizes="(min-width: 1024px) 16vw, 38vw"
                    hideLabel
                    className="transition-transform duration-700 ease-film group-hover:scale-[1.04]"
                  />
                )}
              </div>
              <p className="mt-2.5 text-sm font-medium text-fg group-hover:text-electric">{localized(lang, c.title, c.titleHi)}</p>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
