"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import type { Product } from "@/types/catalog";
import { useT } from "@/lib/i18n";
import { ProductCard } from "@/components/product/ProductCard";
import { QuickView } from "@/components/product/QuickView";
import { ArrowRightIcon } from "@/components/ui/icons";

/** Homepage product grid: two columns on phones so shoppers see more at once. */
export function HomeProducts({ products }: { products: Product[] }) {
  const t = useT();
  const [quick, setQuick] = useState<Product | null>(null);
  const close = useCallback(() => setQuick(null), []);
  if (!products.length) return null;

  return (
    <section aria-labelledby="home-products-title" className="py-14 lg:py-20">
      <div className="container-site flex items-end justify-between gap-4">
        <h2 id="home-products-title" className="text-2xl font-semibold tracking-[-0.02em] sm:text-3xl">
          {t("home.prodTitle")}
        </h2>
        <Link href="/products" className="hidden min-h-[44px] items-center gap-2 text-sm text-fg hover:text-electric sm:inline-flex">
          {t("col.all")}
          <ArrowRightIcon size={16} />
        </Link>
      </div>
      <ul className="container-site mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {products.map((p) => (
          <li key={p.id}>
            <ProductCard product={p} onQuickView={setQuick} />
          </li>
        ))}
      </ul>
      <div className="container-site mt-8 text-center">
        <Link href="/products" className="btn-ghost w-full sm:w-auto">
          {t("col.all")}
          <ArrowRightIcon size={16} />
        </Link>
      </div>
      <QuickView product={quick} onClose={close} />
    </section>
  );
}
