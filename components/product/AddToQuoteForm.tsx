"use client";

import { useId, useState } from "react";
import { effectivePrice, type Product } from "@/types/catalog";
import { useT } from "@/lib/i18n";
import { MAX_QTY } from "@/lib/quote";
import { LIGHT_COLOUR_KEY, LIGHT_SWATCH } from "@/lib/lighting";
import { useAddToQuote } from "@/lib/useAddToQuote";
import { MinusIcon, PlusIcon } from "@/components/ui/icons";

interface Choice {
  value: string;
  label: string;
  swatch?: string;
}

function ChoiceGroup({ name, legend, choices, value, onChange }: { name: string; legend: string; choices: Choice[]; value: string; onChange: (v: string) => void }) {
  return (
    <fieldset>
      <legend className="mb-2 text-xs text-muted">{legend}</legend>
      <div className="flex flex-wrap gap-2">
        {choices.map((c) => (
          <label key={c.value || "any"} className="cursor-pointer">
            <input type="radio" name={name} value={c.value} checked={value === c.value} onChange={() => onChange(c.value)} className="peer sr-only" />
            <span className="inline-flex min-h-[36px] items-center gap-2 rounded-full border px-3.5 text-xs text-muted transition-colors hairline peer-checked:border-accent peer-checked:text-fg peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-amber">
              {c.swatch && <span aria-hidden="true" className="h-3 w-3 rounded-full" style={{ background: c.swatch, boxShadow: "inset 0 0 0 1px rgb(var(--line) / 0.3)" }} />}
              {c.label}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

/**
 * Light colour + body colour + quantity + “Add”. Used in quick view and on
 * product pages. A choice is only asked for when there is more than one;
 * a single available colour is added to the line automatically.
 */
export function AddToQuoteForm({ product, className = "", onAdded }: { product: Product; className?: string; onAdded?: () => void }) {
  const t = useT();
  const addToQuote = useAddToQuote();
  const [light, setLight] = useState("");
  const [body, setBody] = useState("");
  const [qty, setQty] = useState(1);
  const id = useId();

  const clamp = (n: number) => Math.max(1, Math.min(MAX_QTY, Math.round(n) || 1));
  const any: Choice = { value: "", label: t("product.any") };
  const lights = product.lightColours;
  const bodies = product.bodyColours;

  return (
    <form
      className={`space-y-4 ${className}`}
      onSubmit={(e) => {
        e.preventDefault();
        // Always in English: this text goes into the WhatsApp message the shop reads.
        const option = [light || (lights.length === 1 ? lights[0] : ""), body || (bodies.length === 1 ? bodies[0] : "")].filter(Boolean).join(", ");
        addToQuote(product, { option: option || undefined, qty });
        onAdded?.();
      }}
    >
      {lights.length > 1 && (
        <ChoiceGroup
          name={`${id}-light`}
          legend={t("product.chooseLight")}
          value={light}
          onChange={setLight}
          choices={[any, ...lights.map((c) => ({ value: c, label: t(LIGHT_COLOUR_KEY[c]), swatch: LIGHT_SWATCH[c] }))]}
        />
      )}
      {bodies.length > 1 && (
        <ChoiceGroup name={`${id}-body`} legend={t("product.chooseBody")} value={body} onChange={setBody} choices={[any, ...bodies.map((c) => ({ value: c, label: c }))]} />
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
          {t(typeof effectivePrice(product) === "number" ? "bag.add" : "quote.add")}
        </button>
      </div>
    </form>
  );
}
