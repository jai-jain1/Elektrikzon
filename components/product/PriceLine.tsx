"use client";

import { useT } from "@/lib/i18n";

const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

/** Never a trade price: “Request trade price”, plus MRP only when the product has one. */
export function PriceLine({ mrp, className = "" }: { mrp?: number; className?: string }) {
  const t = useT();
  return (
    <p className={`text-sm ${className}`}>
      {typeof mrp === "number" && (
        <span className="mr-2 text-muted">
          {t("product.mrp")} {inr.format(mrp)}
        </span>
      )}
      <span className="font-medium text-fg">{t("product.tradePrice")}</span>
    </p>
  );
}
