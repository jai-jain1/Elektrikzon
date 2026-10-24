"use client";

import { effectivePrice, type Product } from "@/types/catalog";
import { fmt, useT } from "@/lib/i18n";
import { useLang } from "@/lib/prefs";
import { localized } from "@/lib/localize";
import { formatINR } from "@/lib/money";

type Priceable = Pick<Product, "price" | "mrp" | "offer">;

/**
 * Price display. With a selling (or campaign offer) price: “₹1,299”, the
 * higher MRP or regular price struck through, and the campaign label.
 * Without one: “Request trade price” (plus MRP when the product has it).
 */
export function PriceLine({ product, className = "", large = false }: { product: Priceable; className?: string; large?: boolean }) {
  const t = useT();
  const lang = useLang();
  const now = effectivePrice(product);

  if (typeof now !== "number") {
    return (
      <p className={`text-sm ${className}`}>
        {typeof product.mrp === "number" && (
          <span className="mr-2 text-muted">
            {t("product.mrp")} {formatINR(product.mrp)}
          </span>
        )}
        <span className="font-medium text-fg">{t("product.tradePrice")}</span>
      </p>
    );
  }

  // What to strike through: the regular price during an offer, otherwise the MRP.
  const was = product.offer?.price && product.price && product.price > now ? product.price : product.mrp && product.mrp > now ? product.mrp : undefined;
  const offerLabel = product.offer?.price ? fmt(t("price.offer"), { campaign: localized(lang, product.offer.campaignTitle, product.offer.campaignTitleHi) }) : null;

  return (
    <div className={className}>
      <p className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <span className={`font-semibold tracking-[-0.01em] text-fg ${large ? "text-2xl" : "text-base"}`}>{formatINR(now)}</span>
        {was && (
          <>
            <s className="text-sm text-muted">{formatINR(was)}</s>
            <span className="text-xs text-electric">{fmt(t("price.save"), { amount: formatINR(was - now) })}</span>
          </>
        )}
      </p>
      {offerLabel && <p className="mt-0.5 text-xs text-muted">{offerLabel}</p>}
    </div>
  );
}
