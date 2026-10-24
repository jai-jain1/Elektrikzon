"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import type { Product } from "@/types/catalog";
import { useT } from "@/lib/i18n";
import { useIsLite, useLang } from "@/lib/prefs";
import { localized } from "@/lib/localize";
import { useFocusTrap } from "@/lib/useFocusTrap";
import { ProductImage } from "@/components/product/ProductImage";
import { PriceLine } from "@/components/product/PriceLine";
import { SampleTag } from "@/components/product/SampleTag";
import { AddToQuoteForm } from "@/components/product/AddToQuoteForm";
import { SpecTable } from "@/components/product/SpecTable";
import { ArrowRightIcon, CloseIcon } from "@/components/ui/icons";

/** Product quick view dialog (opened from catalogue cards). */
export function QuickView({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const t = useT();
  const lang = useLang();
  const lite = useIsLite();
  const ref = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState<Product | null>(product);

  // Keep content during the exit animation.
  useEffect(() => {
    if (product) setCurrent(product);
  }, [product]);

  const close = useCallback(() => onClose(), [onClose]);
  useFocusTrap(ref, !!product, close);

  const p = product ?? current;
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  // Portal to <body>: <main> is its own stacking context, so the dialog
  // must live outside it to cover the header and floating buttons.
  return createPortal(
    <AnimatePresence>
      {product && p && (
        <div className="fixed inset-0 z-[66] flex items-end justify-center sm:items-center sm:p-6" key="quick-view">
          <motion.div
            aria-hidden="true"
            className="absolute inset-0 bg-black/65 backdrop-blur-sm"
            initial={lite ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: lite ? 0 : 0.2 } }}
            onClick={close}
          />
          <motion.div
            ref={ref}
            role="dialog"
            aria-modal="true"
            aria-labelledby="qv-title"
            initial={lite ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={lite ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative grid max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-t-3xl border bg-bg hairline sm:grid-cols-2 sm:rounded-3xl"
          >
            <button
              type="button"
              onClick={close}
              aria-label={t("product.close")}
              className="icon-btn absolute right-3 top-3 z-10 bg-bg/70 backdrop-blur"
            >
              <CloseIcon size={20} />
            </button>

            <div className="relative aspect-[4/3] sm:aspect-auto sm:min-h-[28rem]">
              <ProductImage image={p.images[0]} sizes="(min-width: 640px) 45vw, 100vw" />
              {p.sample && <SampleTag className="absolute left-4 top-4" />}
            </div>

            <div className="flex flex-col p-6 sm:p-8">
              <p className="text-[0.7rem] uppercase tracking-[0.14em] text-muted">
                {localized(lang, p.category.title, p.category.titleHi)}
                {p.subcategory ? ` · ${localized(lang, p.subcategory.title, p.subcategory.titleHi)}` : ""}
              </p>
              <h2 id="qv-title" className="mt-2 pr-10 text-3xl leading-tight">
                {localized(lang, p.name, p.nameHi)}
              </h2>
              {p.brand && <p className="mt-1 text-sm text-muted">{p.brand.name}</p>}
              <PriceLine mrp={p.mrp} className="mt-4" />
              {p.description && (
                <p className="mt-4 text-sm leading-relaxed text-muted">{localized(lang, p.description, p.descriptionHi)}</p>
              )}

              {p.specs.length > 0 && <SpecTable specs={p.specs.slice(0, 4)} className="mt-5" />}

              <AddToQuoteForm product={p} className="mt-6" onAdded={close} />

              <Link href={`/products/${p.id}`} onClick={close} className="mt-5 inline-flex min-h-[44px] items-center gap-2 text-sm text-fg hover:text-amber">
                {t("product.details")}
                <ArrowRightIcon size={16} />
              </Link>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
