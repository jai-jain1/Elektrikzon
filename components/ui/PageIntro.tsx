"use client";

import type { TKey } from "@/data/translations";
import { useT } from "@/lib/i18n";

/** Page header: eyebrow, serif title and intro line. */
export function PageIntro({ eyebrow, title, sub }: { eyebrow: TKey; title: TKey; sub?: TKey }) {
  const t = useT();
  return (
    <div className="relative isolate overflow-hidden">
      <header className="container-site pb-12 pt-28 sm:pt-36">
        <p className="eyebrow">{t(eyebrow)}</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-[-0.02em] sm:text-6xl">{t(title)}</h1>
        {sub && <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">{t(sub)}</p>}
      </header>
    </div>
  );
}

/** Numbered benefit cards. */
export function BenefitGrid({ items }: { items: { title: TKey; body: TKey | React.ReactNode }[] }) {
  const t = useT();
  return (
    <ul className="container-site grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((it, i) => (
        <li key={it.title} className="rounded-2xl border bg-surface/50 p-6 hairline">
          <span className="text-xs tabular-nums text-electric">{String(i + 1).padStart(2, "0")}</span>
          <h2 className="mt-6 text-xl leading-snug sm:text-2xl">{t(it.title)}</h2>
          <div className="mt-3 text-sm leading-relaxed text-muted">{typeof it.body === "string" ? t(it.body as TKey) : it.body}</div>
        </li>
      ))}
    </ul>
  );
}
