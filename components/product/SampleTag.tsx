"use client";

import { useT } from "@/lib/i18n";

export function SampleTag({ className = "" }: { className?: string }) {
  const t = useT();
  return (
    <span
      className={`inline-flex items-center rounded-full border border-dashed px-2.5 py-1 text-[0.65rem] font-medium uppercase tracking-[0.14em] text-fg ${className}`}
      style={{ borderColor: "rgb(var(--fg) / 0.35)", background: "rgb(var(--bg) / 0.7)" }}
    >
      {t("product.sample")}
    </span>
  );
}
