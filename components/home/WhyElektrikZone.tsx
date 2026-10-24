"use client";

import type { TKey } from "@/data/translations";
import { useT } from "@/lib/i18n";
import { Placeholder } from "@/components/ui/Placeholder";

const REASONS = [1, 2, 3, 4] as const;

/** Reasons that are true by how the site and shop work; no invented stats. */
export function WhyElektrikZone() {
  const t = useT();
  return (
    <section aria-labelledby="why-title" className="container-site py-20 lg:py-28">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.6fr]">
        <div>
          <p className="eyebrow">{t("why.eyebrow")}</p>
          <h2 id="why-title" className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.02em] sm:text-5xl">
            {t("why.title")}
          </h2>
          <p className="mt-6 text-sm text-muted">
            {t("why.years")}: <Placeholder label="Years in business" />
          </p>
        </div>
        <ol className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
          {REASONS.map((n) => (
            <li key={n} className="border-t pt-6 hairline">
              <span className="font-display text-4xl font-semibold text-electric">{String(n).padStart(2, "0")}</span>
              <h3 className="mt-4 text-2xl leading-snug">{t(`why.${n}.title` as TKey)}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{t(`why.${n}.body` as TKey)}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
