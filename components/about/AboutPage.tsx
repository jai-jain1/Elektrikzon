"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n";
import { useSettings } from "@/components/providers/Providers";
import { PageIntro } from "@/components/ui/PageIntro";
import { Placeholder } from "@/components/ui/Placeholder";
import { ArrowRightIcon } from "@/components/ui/icons";

// Only facts from the owner's brief or Site settings. The story is the
// owner's to write: it stays a placeholder until then.
export function AboutPage() {
  const t = useT();
  const s = useSettings();

  return (
    <>
      <PageIntro eyebrow="about.eyebrow" title="about.title" sub="about.body" />
      <div className="container-site grid gap-14 lg:grid-cols-2">
        <section aria-labelledby="story">
          <h2 id="story" className="text-3xl font-semibold tracking-[-0.02em]">
            {t("about.story")}
          </h2>
          <p className="mt-4 leading-relaxed text-muted">
            <Placeholder label="Shop story in your own words: who started it, when, and what you care about" />
          </p>
          <p className="mt-4 text-sm text-muted">
            {t("why.years")}: <Placeholder label="Years in business" />
          </p>
        </section>
        <section aria-labelledby="how">
          <h2 id="how" className="text-3xl font-semibold tracking-[-0.02em]">
            {t("about.how")}
          </h2>
          <p className="mt-4 leading-relaxed text-muted">{t("about.howBody")}</p>
        </section>
        <section aria-labelledby="lines">
          <h2 id="lines" className="text-3xl font-semibold tracking-[-0.02em]">
            {t("about.lines")}
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {s.strongestLines.map((l) => (
              <li key={l} className="rounded-full border px-3.5 py-1.5 text-sm text-muted hairline">
                {l}
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="brands">
          <h2 id="brands" className="text-3xl font-semibold tracking-[-0.02em]">
            {t("about.brands")}
          </h2>
          <p className="mt-4 text-muted">{s.brandsStocked.length ? s.brandsStocked.join(" · ") : <Placeholder label="Brands stocked" />}</p>
        </section>
      </div>
      <div className="container-site mt-14 flex flex-wrap gap-3">
        <Link href="/contact" className="btn-primary">
          {t("about.visit")}
          <ArrowRightIcon size={16} />
        </Link>
        <Link href="/products" className="btn-ghost">
          {t("hero.ctaBrowse")}
        </Link>
      </div>
    </>
  );
}
