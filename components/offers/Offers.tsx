"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import type { Campaign, Lang, Product } from "@/types/catalog";
import { SHOTS } from "@/data/shots";
import { fmt, useT } from "@/lib/i18n";
import { useLang } from "@/lib/prefs";
import { localized } from "@/lib/localize";
import { ProductImage } from "@/components/product/ProductImage";
import { ProductCard } from "@/components/product/ProductCard";
import { QuickView } from "@/components/product/QuickView";
import { ShotImage } from "@/components/media/ShotImage";
import { OrAdd } from "@/components/ui/Placeholder";
import { ArrowRightIcon } from "@/components/ui/icons";

/** “24 October” in the shop’s time zone. */
function formatDay(iso: string, lang: Lang) {
  return new Intl.DateTimeFormat(lang === "hi" ? "hi-IN" : "en-IN", { day: "numeric", month: "long", timeZone: "Asia/Kolkata" }).format(
    new Date(iso),
  );
}

/** The campaign’s products in the order set in Sanity (missing ones skipped). */
export function campaignProducts(campaign: Campaign, products: Product[]): Product[] {
  const byId = new Map(products.map((p) => [p.id, p]));
  return campaign.items.map((i) => byId.get(i.productId)).filter((p): p is Product => !!p);
}

/** Sanity image, or the rendered festive shot until one is uploaded. */
function CampaignImage({ campaign, sizes, priority }: { campaign: Campaign; sizes: string; priority?: boolean }) {
  if (campaign.image) return <ProductImage image={campaign.image} sizes={sizes} priority={priority} />;
  return <ShotImage shot={SHOTS.campaignLights} sizes={sizes} priority={priority} />;
}

function ProductRow({ products }: { products: Product[] }) {
  const [quick, setQuick] = useState<Product | null>(null);
  const close = useCallback(() => setQuick(null), []);
  return (
    <>
      {/* Swipe row on phones, grid on desktop. */}
      <ul className="container-site mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 lg:grid lg:grid-cols-4 lg:overflow-visible">
        {products.map((p) => (
          <li key={p.id} className="w-[72%] shrink-0 snap-start sm:w-[42%] lg:w-auto">
            <ProductCard product={p} onQuickView={setQuick} />
          </li>
        ))}
      </ul>
      <QuickView product={quick} onClose={close} />
    </>
  );
}

/** Homepage section for the first running campaign marked “Show on homepage”. */
export function CampaignBanner({ campaign, products }: { campaign: Campaign | undefined; products: Product[] }) {
  const t = useT();
  const lang = useLang();
  if (!campaign) return null;
  const items = campaignProducts(campaign, products).slice(0, 4);
  const title = localized(lang, campaign.title, campaign.titleHi);
  const href = `/offers/${campaign.slug}`;

  return (
    <section aria-labelledby="campaign-title" className="py-16 lg:py-24">
      <div className="container-site">
        <Link href={href} className="group relative block aspect-[4/5] overflow-hidden rounded-3xl bg-elev sm:aspect-[21/9]">
          <CampaignImage campaign={campaign} sizes="(min-width: 1280px) 1200px, 100vw" />
          <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent sm:bg-gradient-to-r sm:from-black/80 sm:via-black/40" />
          <div className="absolute inset-x-0 bottom-0 p-6 sm:inset-y-0 sm:right-auto sm:flex sm:max-w-xl sm:flex-col sm:justify-center sm:p-12">
            <p className="eyebrow text-white/70">{localized(lang, campaign.eyebrow, campaign.eyebrowHi) || t("offers.eyebrow")}</p>
            <h2 id="campaign-title" className="mt-3 text-3xl font-semibold leading-tight tracking-[-0.02em] text-white sm:text-5xl">
              {title}
            </h2>
            {campaign.description && (
              <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-white/75 sm:text-base">
                {localized(lang, campaign.description, campaign.descriptionHi)}
              </p>
            )}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              {/* Always a white pill: the banner sits on a dark photo in both themes. */}
              <span className="btn bg-white text-black transition-colors group-hover:bg-white/85">
                {t("offers.shop")}
                <ArrowRightIcon size={16} />
              </span>
              {campaign.endsAt && <span className="text-xs text-white/70">{fmt(t("offers.ends"), { date: formatDay(campaign.endsAt, lang) })}</span>}
            </div>
          </div>
        </Link>
      </div>
      {items.length > 0 && <ProductRow products={items} />}
    </section>
  );
}

/** /offers: every running campaign. */
export function OffersIndex({ campaigns }: { campaigns: Campaign[] }) {
  const t = useT();
  const lang = useLang();

  return (
    <div className="pb-24">
      <header className="container-site pb-10 pt-28 sm:pt-36">
        <p className="eyebrow">{t("offers.eyebrow")}</p>
        <h1 className="mt-4 text-4xl font-semibold leading-[1.05] tracking-[-0.02em] sm:text-6xl">{t("offers.title")}</h1>
      </header>

      {campaigns.length === 0 ? (
        <div className="container-site">
          <p className="max-w-xl text-muted">{t("offers.none")}</p>
          <Link href="/products" className="btn-ghost mt-6">
            {t("quote.browse")}
          </Link>
        </div>
      ) : (
        <ul className="container-site grid gap-6 md:grid-cols-2">
          {campaigns.map((c) => (
            <li key={c.id}>
              <Link href={`/offers/${c.slug}`} className="group block overflow-hidden rounded-3xl border bg-surface/50 hairline">
                <div className="relative aspect-[16/9] overflow-hidden bg-elev">
                  <CampaignImage campaign={c} sizes="(min-width: 768px) 50vw, 100vw" />
                </div>
                <div className="p-6">
                  <p className="eyebrow">{localized(lang, c.eyebrow, c.eyebrowHi) || t("offers.eyebrow")}</p>
                  <h2 className="mt-2 text-2xl font-semibold leading-tight">{localized(lang, c.title, c.titleHi)}</h2>
                  <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
                    <span className="inline-flex items-center gap-1.5 text-fg">
                      {t("offers.shop")}
                      <ArrowRightIcon size={15} />
                    </span>
                    {c.endsAt && <span>{fmt(t("offers.ends"), { date: formatDay(c.endsAt, lang) })}</span>}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** /offers/[slug]: one campaign, running or ended. */
export function CampaignPage({ campaign, products }: { campaign: Campaign; products: Product[] }) {
  const t = useT();
  const lang = useLang();
  const items = campaignProducts(campaign, products);
  const note = localized(lang, campaign.offerNote, campaign.offerNoteHi);

  return (
    <div className="pb-24">
      <div className="relative isolate min-h-[60vh] overflow-hidden">
        <CampaignImage campaign={campaign} sizes="100vw" priority />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-bg via-black/40 to-black/20" />
        <header className="container-site relative flex min-h-[60vh] flex-col justify-end pb-10 pt-28">
          <p className="eyebrow text-white/70">{localized(lang, campaign.eyebrow, campaign.eyebrowHi) || t("offers.eyebrow")}</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-[-0.02em] text-white sm:text-6xl">
            {localized(lang, campaign.title, campaign.titleHi)}
          </h1>
          {campaign.description && (
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
              {localized(lang, campaign.description, campaign.descriptionHi)}
            </p>
          )}
          {campaign.active && campaign.endsAt && (
            <p className="mt-5 text-sm text-white/70">{fmt(t("offers.ends"), { date: formatDay(campaign.endsAt, lang) })}</p>
          )}
        </header>
      </div>

      <div className="container-site mt-8 space-y-3">
        {!campaign.active && <p className="rounded-xl border bg-elev px-4 py-3 text-sm text-muted hairline">{t("offers.ended")}</p>}
        <p className="text-sm text-muted">
          <OrAdd value={note} label="Offer terms, e.g. while stocks last" />
        </p>
      </div>

      {items.length > 0 && (
        <section aria-labelledby="offer-products" className="mt-12">
          <h2 id="offer-products" className="container-site text-2xl font-semibold">
            {t("offers.products")}
          </h2>
          <ProductRow products={items} />
        </section>
      )}

      <div className="container-site mt-10">
        <Link href="/offers" className="inline-flex min-h-[44px] items-center gap-2 text-sm text-fg hover:text-amber">
          {t("offers.all")}
          <ArrowRightIcon size={16} />
        </Link>
      </div>
    </div>
  );
}
