"use client";

import Link from "next/link";
import type { Product } from "@/types/catalog";
import { fmt, useT } from "@/lib/i18n";
import { useLang } from "@/lib/prefs";
import { localized } from "@/lib/localize";
import { useAddToQuote } from "@/lib/useAddToQuote";
import { ProductImage } from "@/components/product/ProductImage";
import { PriceLine } from "@/components/product/PriceLine";
import { SampleTag } from "@/components/product/SampleTag";
import { FinishDots } from "@/components/product/FinishDots";
import { EyeIcon, PlusIcon } from "@/components/ui/icons";

interface Props {
  product: Product;
  onQuickView?: (product: Product) => void;
  priority?: boolean;
}

/** Catalogue card in the style of an Apple Store tile: quiet, photo first. */
export function ProductCard({ product, onQuickView, priority }: Props) {
  const t = useT();
  const lang = useLang();
  const addToQuote = useAddToQuote();

  const name = localized(lang, product.name, product.nameHi);
  const category = localized(lang, product.category.title, product.category.titleHi);
  const sub = product.subcategory ? localized(lang, product.subcategory.title, product.subcategory.titleHi) : null;
  const href = `/products/${product.id}`;

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-[1.375rem] bg-elev transition-[transform,box-shadow] duration-500 ease-film hover:-translate-y-0.5 hover:shadow-[0_24px_60px_-30px_rgb(0_0_0/0.9)]">
      <Link href={href} className="relative m-2 block aspect-square overflow-hidden rounded-[1rem] bg-surface" tabIndex={-1} aria-hidden="true">
        <ProductImage
          image={product.images[0]}
          sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 50vw"
          priority={priority}
          className="transition-transform duration-700 ease-film group-hover:scale-[1.04]"
        />
        {product.sample && <SampleTag className="absolute left-3 top-3" />}
      </Link>

      <div className="flex flex-1 flex-col px-4 pb-4 pt-2 sm:px-5 sm:pb-5">
        <p className="truncate text-xs text-muted">
          {category}
          {sub ? ` · ${sub}` : ""}
        </p>
        <h3 className="mt-1.5 text-base font-semibold leading-snug tracking-[-0.015em] sm:text-lg">
          <Link href={href} className="hover:underline hover:underline-offset-4">
            {name}
          </Link>
        </h3>
        {product.brand && <p className="mt-0.5 text-xs text-muted">{product.brand.name}</p>}
        <div className="mt-3 flex min-h-[14px] items-center">
          <FinishDots finishes={product.finishes} />
        </div>
        <PriceLine mrp={product.mrp} className="mt-3" />

        <div className="mt-auto flex items-center gap-2 pt-4">
          <button
            type="button"
            onClick={() => addToQuote(product)}
            className="btn-primary min-h-[40px] flex-1 px-3 text-[0.8rem]"
            aria-label={fmt(t("quote.addNamed"), { name })}
          >
            <PlusIcon size={16} />
            {t("quote.add")}
          </button>
          {onQuickView && (
            <button
              type="button"
              onClick={() => onQuickView(product)}
              className="icon-btn h-10 w-10 bg-surface"
              aria-label={fmt(t("product.quickViewOf"), { name })}
              title={t("product.quickView")}
            >
              <EyeIcon size={18} />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
