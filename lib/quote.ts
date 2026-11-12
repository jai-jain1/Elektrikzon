"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { safeJSONStorage } from "@/lib/storage";

/**
 * Quote basket. Lives only in the visitor’s browser (localStorage) and is
 * sent only as a WhatsApp message. Never sent to Sanity or any server.
 */
export type QuoteKind = "product" | "lighting";

export interface QuoteItem {
  /** Unique per line: product id + chosen option, or a generated id. */
  key: string;
  kind: QuoteKind;
  productId?: string;
  title: string;
  titleHi?: string;
  /** Extra line for lighting briefs. */
  detail?: string;
  /** What the customer chose, e.g. "Warm white, Black". */
  option?: string;
  qty: number;
  /** Price per unit for online orders (selling or offer price), when the product has one. */
  unitPrice?: number;
  /** Campaign whose offer price applies, for the order message. */
  offerCampaign?: string;
}

export type NewQuoteItem = Omit<QuoteItem, "key" | "qty"> & { qty?: number };

export const MAX_QTY = 999;

const lineKey = (i: NewQuoteItem) =>
  i.kind === "product" && i.productId ? `p:${i.productId}:${i.option ?? ""}` : `${i.kind}:${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

interface QuoteState {
  items: QuoteItem[];
  add: (item: NewQuoteItem) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
}

export const useQuote = create<QuoteState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) => {
        const key = lineKey(item);
        const qty = Math.max(1, Math.min(MAX_QTY, item.qty ?? 1));
        const existing = get().items.find((i) => i.key === key);
        if (existing) {
          // Keep the latest price (an offer may have started or ended).
          set({ items: get().items.map((i) => (i.key === key ? { ...i, qty: Math.min(MAX_QTY, i.qty + qty), unitPrice: item.unitPrice, offerCampaign: item.offerCampaign } : i)) });
        } else {
          set({ items: [...get().items, { ...item, key, qty }] });
        }
      },
      setQty: (key, qty) =>
        set({ items: get().items.map((i) => (i.key === key ? { ...i, qty: Math.max(1, Math.min(MAX_QTY, Math.round(qty) || 1)) } : i)) }),
      remove: (key) => set({ items: get().items.filter((i) => i.key !== key) }),
      clear: () => set({ items: [] }),
    }),
    {
      name: "ez-quote",
      storage: safeJSONStorage,
      skipHydration: true,
      version: 2,
      // v1 lists could hold switch-plate lines and a "finish"; keep what still applies.
      migrate: (persisted) => {
        const old = (persisted as { items?: (QuoteItem & { finish?: string; kind: string })[] } | null)?.items ?? [];
        return {
          items: old
            .filter((i) => i.kind === "product" || i.kind === "lighting")
            .map(({ finish, ...i }) => ({ ...i, option: i.option ?? finish })),
        };
      },
    },
  ),
);

/** Bag total when every line has an online price; null otherwise. */
export function bagTotal(items: QuoteItem[]): number | null {
  if (!items.length || items.some((i) => typeof i.unitPrice !== "number")) return null;
  return items.reduce((sum, i) => sum + (i.unitPrice as number) * i.qty, 0);
}

/** Number of lines in the basket (shown on badges). */
export function useQuoteCount() {
  return useQuote((s) => s.items.length);
}
