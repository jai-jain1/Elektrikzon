"use client";

import { useCallback } from "react";
import { effectivePrice, type Product } from "@/types/catalog";
import { useQuote } from "@/lib/quote";
import { useUI } from "@/lib/ui";
import { useT } from "@/lib/i18n";

/**
 * Adds a product line to the bag / quote list and confirms with a toast.
 * Products with a selling (or offer) price carry it, so the bag can total
 * them and offer UPI checkout.
 */
export function useAddToQuote() {
  const add = useQuote((s) => s.add);
  const showToast = useUI((u) => u.showToast);
  const t = useT();

  return useCallback(
    (product: Product, opts: { finish?: string; qty?: number } = {}) => {
      const unitPrice = effectivePrice(product);
      add({
        kind: "product",
        productId: product.id,
        title: product.name,
        titleHi: product.nameHi,
        finish: opts.finish,
        finishOptions: product.finishes.length ? product.finishes : undefined,
        qty: opts.qty,
        unitPrice,
        offerCampaign: product.offer?.price ? product.offer.campaignTitle : undefined,
      });
      showToast(typeof unitPrice === "number" ? t("bag.added") : t("quote.added"));
    },
    [add, showToast, t],
  );
}
