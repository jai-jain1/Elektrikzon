"use client";

import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/types/catalog";
import { CATEGORY_SHOTS, SHOTS } from "@/data/shots";
import { fmt, useT } from "@/lib/i18n";
import { useLang } from "@/lib/prefs";
import { localized } from "@/lib/localize";
import { sanityLoader } from "@/lib/sanity/image";
import { ShotImage } from "@/components/media/ShotImage";
import { Reveal } from "@/components/motion/Reveal";

interface Props {
  categories: Category[];
  counts: Record<string, number>;
}

/**
 * Bento grid of product lines. Editorial categories get tall tiles, technical
 * ones a wide tile, standard ones a regular tile. Photo: the category's cover
 * from the Studio, otherwise the matching Higgsfield shot slot.
 */
export function Collections({ categories, counts }: Props) {
  const t = useT();
  const lang = useLang();

  const countLabel = (slug: string) => {
    const n = counts[slug] ?? 0;
    return n === 1 ? t("col.count1") : fmt(t("col.count"), { n: String(n) });
  };

  const Media = ({ c, sizes }: { c: Category; sizes: string }) =>
    c.coverImage ? (
      <Image
        loader={sanityLoader}
        src={c.coverImage.url}
        alt={c.coverImage.alt}
        fill
        sizes={sizes}
        placeholder={c.coverImage.lqip ? "blur" : "empty"}
        blurDataURL={c.coverImage.lqip}
        className="object-cover transition-transform duration-[1.2s] ease-film group-hover:scale-[1.03]"
      />
    ) : (
      <ShotImage
        shot={CATEGORY_SHOTS[c.slug] ?? SHOTS.lineSwitches}
        sizes={sizes}
        className="transition-transform duration-[1.2s] ease-film group-hover:scale-[1.03]"
      />
    );

  const Text = ({ c, center = true }: { c: Category; center?: boolean }) => (
    <div className={center ? "text-center" : ""}>
      <p className="text-sm text-muted">{countLabel(c.slug)}</p>
      <h3 className="mt-1 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">{localized(lang, c.title, c.titleHi)}</h3>
      {c.description && <p className="mx-auto mt-2 max-w-sm text-base text-muted">{localized(lang, c.description, c.descriptionHi)}</p>}
      <span className="mt-3 inline-flex items-center gap-1 text-[1.02rem] text-electric transition-colors group-hover:text-fg">
        {t("col.view")} <span aria-hidden="true">›</span>
      </span>
    </div>
  );

  return (
    <section id="collections" aria-labelledby="col-title" className="bg-bg py-24 lg:py-32">
      <Reveal className="container-site text-center">
        <p className="eyebrow">{t("col.eyebrow")}</p>
        <h2 id="col-title" className="mt-3 text-4xl font-semibold tracking-[-0.035em] sm:text-6xl">
          {t("col.title")}
        </h2>
      </Reveal>

      <ul className="container-site mt-14 grid gap-4 lg:grid-cols-6">
        {categories.map((c, i) => {
          const href = `/products?category=${c.slug}`;
          if (c.displayStyle === "technical") {
            return (
              <Reveal as="li" key={c.id} delay={0.05 * (i % 3)} className="lg:col-span-6">
                <Link href={href} className="group grid overflow-hidden rounded-[1.75rem] bg-elev lg:grid-cols-2">
                  <div className="flex items-center p-8 sm:p-12">
                    <Text c={c} center={false} />
                  </div>
                  <div className="relative aspect-[4/3] lg:aspect-auto lg:min-h-[22rem]">
                    <Media c={c} sizes="(min-width: 1024px) 50vw, 100vw" />
                  </div>
                </Link>
              </Reveal>
            );
          }
          const tall = c.displayStyle === "editorial";
          return (
            <Reveal as="li" key={c.id} delay={0.05 * (i % 2)} className="lg:col-span-3">
              <Link href={href} className={`group relative flex flex-col overflow-hidden rounded-[1.75rem] bg-elev ${tall ? "aspect-[4/5]" : "aspect-[4/3]"}`}>
                <div className="relative z-10 px-6 pt-10 sm:px-10 sm:pt-12">
                  <Text c={c} />
                </div>
                <div className="relative mt-6 flex-1">
                  <Media c={c} sizes="(min-width: 1024px) 50vw, 100vw" />
                </div>
              </Link>
            </Reveal>
          );
        })}
      </ul>

      <div className="mt-10 text-center">
        <Link href="/products" className="group inline-flex min-h-[44px] items-center gap-1 text-[1.05rem] text-electric hover:text-fg">
          {t("col.all")} <span aria-hidden="true">›</span>
        </Link>
      </div>
    </section>
  );
}
