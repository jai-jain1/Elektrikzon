"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Product } from "@/types/catalog";
import { fmt, useT } from "@/lib/i18n";
import { useLang } from "@/lib/prefs";
import { localized } from "@/lib/localize";
import { buildProductMessage } from "@/lib/quote-message";
import { getSourceToken } from "@/lib/source";
import { ProductImage } from "@/components/product/ProductImage";
import { PriceLine } from "@/components/product/PriceLine";
import { SampleTag } from "@/components/product/SampleTag";
import { SpecTable } from "@/components/product/SpecTable";
import { AddToQuoteForm } from "@/components/product/AddToQuoteForm";
import { ShareButton } from "@/components/product/ShareButton";
import { FinishDots } from "@/components/product/FinishDots";
import { ProductCard } from "@/components/product/ProductCard";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";
import { ArrowLeftIcon, InstagramIcon } from "@/components/ui/icons";
import { copyText } from "@/lib/clipboard";
import { buildCaption } from "@/lib/caption";
import { useUI } from "@/lib/ui";

export function ProductDetail({ product, related }: { product: Product; related: Product[] }) {
  const t = useT();
  const lang = useLang();
  const [active, setActive] = useState(0);
  const [source, setSource] = useState("web");
  const showToast = useUI((u) => u.showToast);

  useEffect(() => setSource(getSourceToken()), []);

  const name = localized(lang, product.name, product.nameHi);
  const category = localized(lang, product.category.title, product.category.titleHi);
  const description = localized(lang, product.description, product.descriptionHi);
  const image = product.images[active] ?? product.images[0];

  return (
    <div className="container-site pb-10 pt-24 sm:pt-32">
      <nav aria-label="Breadcrumb" className="text-xs text-muted">
        <ol className="flex flex-wrap items-center gap-1.5">
          <li>
            <Link href="/products" className="inline-flex min-h-[32px] items-center gap-1.5 hover:text-fg">
              <ArrowLeftIcon size={14} />
              {t("product.back")}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li>
            <Link href={`/products?category=${product.category.slug}`} className="hover:text-fg">
              {category}
            </Link>
          </li>
          <li aria-hidden="true">/</li>
          <li aria-current="page" className="text-fg">
            {name}
          </li>
        </ol>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-16">
        {/* Gallery */}
        <div>
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border hairline">
            <ProductImage image={image} sizes="(min-width: 1024px) 50vw, 100vw" priority />
            {product.sample && <SampleTag className="absolute left-4 top-4" />}
          </div>
          {product.images.length > 1 && (
            <ul className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <li key={img.url} className="shrink-0">
                  <button
                    type="button"
                    onClick={() => setActive(i)}
                    aria-label={fmt(t("product.photo"), { n: String(i + 1) })}
                    aria-current={i === active}
                    className={`relative block h-20 w-16 overflow-hidden rounded-xl border-2 transition-colors ${i === active ? "border-accent" : "border-transparent"}`}
                  >
                    <ProductImage image={img} sizes="64px" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Details */}
        <div>
          <p className="text-[0.7rem] uppercase tracking-[0.14em] text-muted">
            {category}
            {product.subcategory ? ` · ${localized(lang, product.subcategory.title, product.subcategory.titleHi)}` : ""}
          </p>
          <h1 className="mt-3 text-4xl font-semibold leading-[1.05] tracking-[-0.02em] sm:text-5xl">{name}</h1>
          {product.brand && <p className="mt-2 text-sm text-muted">{product.brand.name}</p>}
          <PriceLine mrp={product.mrp} className="mt-5 text-base" />
          {product.inStockNote && <p className="mt-2 text-sm text-muted">{product.inStockNote}</p>}
          {description && <p className="mt-6 max-w-prose leading-relaxed text-muted">{description}</p>}

          <AddToQuoteForm product={product} className="mt-8" />

          <div className="mt-4 flex flex-wrap gap-2">
            <WhatsAppButton message={buildProductMessage(product.name, product.id, source)} className="btn-ghost flex-1">
              {t("product.ask")}
            </WhatsAppButton>
            <ShareButton title={product.name} path={`/products/${product.id}`} />
            <button
              type="button"
              className="btn-ghost"
              onClick={async () => {
                const url = `${window.location.origin}/products/${product.id}#ig-post`;
                if (await copyText(buildCaption(product, url))) showToast(t("caption.copied"));
              }}
            >
              <InstagramIcon size={17} />
              {t("caption.copy")}
            </button>
          </div>

          <div className="mt-10 space-y-8">
            {product.specs.length > 0 && (
              <section aria-labelledby="specs-title">
                <h2 id="specs-title" className="eyebrow mb-3 font-sans">
                  {t("product.specs")}
                </h2>
                <SpecTable specs={product.specs} />
              </section>
            )}
            {product.finishes.length > 0 && (
              <section aria-labelledby="finishes-title">
                <h2 id="finishes-title" className="eyebrow mb-3 font-sans">
                  {t("product.finishes")}
                </h2>
                <div className="flex flex-wrap items-center gap-3 text-sm text-muted">
                  <FinishDots finishes={product.finishes} />
                  <span>{product.finishes.join(", ")}</span>
                </div>
              </section>
            )}
            {product.use.length > 0 && (
              <section aria-labelledby="uses-title">
                <h2 id="uses-title" className="eyebrow mb-3 font-sans">
                  {t("product.uses")}
                </h2>
                <p className="text-sm text-muted">{product.use.join(", ")}</p>
              </section>
            )}
            <p className="text-xs text-muted">
              {t("product.id")}: <span className="font-mono text-fg">{product.id}</span>
            </p>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related-title" className="mt-24">
          <h2 id="related-title" className="text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
            {fmt(t("product.related"), { category })}
          </h2>
          <ul className="mt-8 grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-4">
            {related.map((p) => (
              <li key={p.id}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
