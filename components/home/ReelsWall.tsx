"use client";

import Image from "next/image";
import type { Product, Reel } from "@/types/catalog";
import { fmt, useT } from "@/lib/i18n";
import { sanityLoader } from "@/lib/sanity/image";
import { useAddToQuote } from "@/lib/useAddToQuote";
import { useSettings } from "@/components/providers/Providers";
import { ArrowUpRightIcon, InstagramIcon, PlusIcon } from "@/components/ui/icons";

/**
 * Reels Wall from Sanity. Covers are Sanity images; the reel itself opens on
 * Instagram (no embeds, so no third-party requests). Hidden when empty.
 */
export function ReelsWall({ reels, products }: { reels: Reel[]; products: Product[] }) {
  const t = useT();
  const s = useSettings();
  const addToQuote = useAddToQuote();

  if (!reels.length) return null;
  const byId = new Map(products.map((p) => [p.id, p]));

  return (
    <section id="reels" aria-labelledby="reels-title" className="scroll-mt-24 py-20 lg:py-28">
      <div className="container-site flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow">{t("reels.eyebrow")}</p>
          <h2 id="reels-title" className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.02em] sm:text-5xl">
            {t("reels.title")}
          </h2>
        </div>
        {s.instagramUrl && (
          <a href={s.instagramUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-[44px] items-center gap-2 text-sm hover:text-amber">
            <InstagramIcon size={18} />
            {t("reels.follow")}
          </a>
        )}
      </div>

      <ul className="container-site mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4">
        {reels.map((r, i) => {
          const linked = r.productIds.map((id) => byId.get(id)).filter((p): p is Product => !!p);
          return (
            <li key={r.id} id={`ig-reel${i + 1}`} className="w-[70%] shrink-0 snap-start sm:w-[42%] lg:w-[23%]">
              <a
                href={r.postUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block aspect-[4/5] overflow-hidden rounded-2xl border hairline"
              >
                <Image
                  loader={sanityLoader}
                  src={r.cover.url}
                  alt={r.cover.alt}
                  fill
                  sizes="(min-width: 1024px) 23vw, 70vw"
                  placeholder={r.cover.lqip ? "blur" : "empty"}
                  blurDataURL={r.cover.lqip}
                  className="object-cover transition-transform duration-700 ease-film group-hover:scale-[1.04]"
                />
                <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 text-[#F4EDE2]">
                  <span className="font-display text-lg leading-snug">{r.title}</span>
                  <ArrowUpRightIcon size={18} />
                </span>
                <span className="sr-only">{t("reels.watch")}</span>
              </a>
              {r.caption && <p className="mt-3 line-clamp-2 text-sm text-muted">{r.caption}</p>}
              {linked.length > 0 && (
                <button
                  type="button"
                  onClick={() => linked.forEach((p) => addToQuote(p))}
                  className="mt-3 inline-flex min-h-[40px] items-center gap-2 rounded-full border px-4 text-sm hairline hover:border-accent hover:text-fg"
                >
                  <PlusIcon size={14} />
                  {linked.length === 1 ? t("reels.shop1") : fmt(t("reels.shop"), { n: String(linked.length) })}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
