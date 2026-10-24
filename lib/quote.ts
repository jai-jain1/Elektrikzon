"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { safeJSONStorage } from "@/lib/storage";

/**
 * Quote basket. Lives only in the visitor’s browser (localStorage) and is
 * sent only as a WhatsApp message. Never sent to Sanity or any server.
 */
export type QuoteKind = "product" | "config" | "lighting";

export interface QuoteItem {
  /** Unique per line: product id + finish, or a generated id. */
  key: string;
  kind: QuoteKind;
  productId?: string;
  title: string;
  titleHi?: string;
  /** Extra line for configurator plates and lighting briefs. */
  detail?: string;
  finish?: string;
  finishOptions?: string[];
  qty: number;
  /** Price per unit for online orders (selling or offer price), when the product has one. */
  unitPrice?: number;
  /** Campaign whose offer price applies, for the order message. */
  offerCampaign?: string;
}

export type NewQuoteItem = Omit<QuoteItem, "key" | "qty"> & { qty?: number };

export const MAX_QTY = 999;

const lineKey = (i: NewQuoteItem) =>
  i.kind === "product" && i.productId ? `p:${i.productId}:${i.finish ?? ""}` : `${i.kind}:${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

interface QuoteState {
  items: QuoteItem[];
  add: (item: NewQuoteItem) => void;
  setQty: (key: string, qty: number) => void;
  setFinish: (key: string, finish: string | undefined) => void;
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
      setFinish: (key, finish) => {
        const items = get().items;
        const item = items.find((i) => i.key === key);
        if (!item || item.kind !== "product") return;
        const newKey = `p:${item.productId}:${finish ?? ""}`;
        const clash = items.find((i) => i.key === newKey && i.key !== key);
        if (clash) {
          // Merge into the existing line with that finish.
          set({
            items: items
              .filter((i) => i.key !== key)
              .map((i) => (i.key === newKey ? { ...i, qty: Math.min(MAX_QTY, i.qty + item.qty) } : i)),
          });
        } else {
          set({ items: items.map((i) => (i.key === key ? { ...i, finish, key: newKey } : i)) });
        }
      },
      remove: (key) => set({ items: get().items.filter((i) => i.key !== key) }),
      clear: () => set({ items: [] }),
    }),
    { name: "ez-quote", storage: safeJSONStorage, skipHydration: true, version: 1 },
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
