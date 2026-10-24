"use client";

import { useCallback } from "react";
import type { Product } from "@/types/catalog";
import { useQuote } from "@/lib/quote";
import { useUI } from "@/lib/ui";
import { useT } from "@/lib/i18n";

/** Adds a product line to the quote list and confirms with a toast. */
export function useAddToQuote() {
  const add = useQuote((s) => s.add);
  const showToast = useUI((u) => u.showToast);
  const t = useT();

  return useCallback(
    (product: Product, opts: { finish?: string; qty?: number } = {}) => {
      add({
        kind: "product",
        productId: product.id,
        title: product.name,
        titleHi: product.nameHi,
        finish: opts.finish,
        finishOptions: product.finishes.length ? product.finishes : undefined,
        qty: opts.qty,
      });
      showToast(t("quote.added"));
    },
    [add, showToast, t],
  );
}
