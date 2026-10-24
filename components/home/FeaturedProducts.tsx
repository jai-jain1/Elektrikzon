"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import type { Product } from "@/types/catalog";
import { useT } from "@/lib/i18n";
import { ProductCard } from "@/components/product/ProductCard";
import { QuickView } from "@/components/product/QuickView";
import { ArrowRightIcon } from "@/components/ui/icons";

/** Products with “Feature on the homepage” switched on. Hidden when there are none. */
export function FeaturedProducts({ products }: { products: Product[] }) {
  const t = useT();
  const [quick, setQuick] = useState<Product | null>(null);
  const close = useCallback(() => setQuick(null), []);

  if (!products.length) return null;

  return (
    <section aria-labelledby="featured-title" className="py-16 lg:py-24">
      <div className="container-site flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow">{t("featured.eyebrow")}</p>
          <h2 id="featured-title" className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.02em] sm:text-5xl">
            {t("featured.title")}
          </h2>
        </div>
        <Link href="/products" className="inline-flex min-h-[44px] items-center gap-2 text-sm text-fg hover:text-amber">
          {t("col.all")}
          <ArrowRightIcon size={16} />
        </Link>
      </div>

      {/* Swipe row on phones, grid on desktop. */}
      <ul className="container-site mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 lg:grid lg:grid-cols-4 lg:overflow-visible">
        {products.map((p) => (
          <li key={p.id} className="w-[72%] shrink-0 snap-start sm:w-[42%] lg:w-auto">
            <ProductCard product={p} onQuickView={setQuick} />
          </li>
        ))}
      </ul>
      <QuickView product={quick} onClose={close} />
    </section>
  );
}
