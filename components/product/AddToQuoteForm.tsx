"use client";

import { useId, useState } from "react";
import type { Product } from "@/types/catalog";
import { useT } from "@/lib/i18n";
import { MAX_QTY } from "@/lib/quote";
import { useAddToQuote } from "@/lib/useAddToQuote";
import { MinusIcon, PlusIcon } from "@/components/ui/icons";

/** Finish + quantity + “Add to quote”. Used in quick view and on product pages. */
export function AddToQuoteForm({ product, className = "", onAdded }: { product: Product; className?: string; onAdded?: () => void }) {
  const t = useT();
  const addToQuote = useAddToQuote();
  const [finish, setFinish] = useState<string>("");
  const [qty, setQty] = useState(1);
  const id = useId();

  const clamp = (n: number) => Math.max(1, Math.min(MAX_QTY, Math.round(n) || 1));

  return (
    <form
      className={`space-y-4 ${className}`}
      onSubmit={(e) => {
        e.preventDefault();
        addToQuote(product, { finish: finish || undefined, qty });
        onAdded?.();
      }}
    >
      {product.finishes.length > 0 && (
        <fieldset>
          <legend className="mb-2 text-xs text-muted">{t("product.chooseFinish")}</legend>
          <div className="flex flex-wrap gap-2">
            {["", ...product.finishes].map((f) => (
              <label key={f || "any"} className="cursor-pointer">
                <input
                  type="radio"
                  name={`${id}-finish`}
                  value={f}
                  checked={finish === f}
                  onChange={() => setFinish(f)}
                  className="peer sr-only"
                />
                <span className="inline-flex min-h-[36px] items-center rounded-full border px-3.5 text-xs text-muted transition-colors hairline peer-checked:border-accent peer-checked:text-fg peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-amber">
                  {f || t("quote.finishAny")}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-full border hairline" role="group" aria-label={t("quote.qty")}>
          <button type="button" className="icon-btn h-11 w-11" onClick={() => setQty((q) => clamp(q - 1))} disabled={qty <= 1} aria-label={t("quote.decrease")}>
            <MinusIcon size={16} />
          </button>
          <input
            type="number"
            inputMode="numeric"
            min={1}
            max={MAX_QTY}
            value={qty}
            onChange={(e) => setQty(clamp(Number(e.target.value)))}
            aria-label={t("quote.qty")}
            className="w-12 bg-transparent text-center text-sm tabular-nums text-fg [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
          />
          <button type="button" className="icon-btn h-11 w-11" onClick={() => setQty((q) => clamp(q + 1))} aria-label={t("quote.increase")}>
            <PlusIcon size={16} />
          </button>
        </div>
        <button type="submit" className="btn-primary flex-1">
          <PlusIcon size={16} />
          {t("quote.add")}
        </button>
      </div>
    </form>
  );
}
