"use client";

import { useT } from "@/lib/i18n";

export function CatalogueIntro() {
  const t = useT();
  return (
    <header className="container-site pb-8 pt-28 sm:pt-36">
      <p className="eyebrow">{t("cat.eyebrow")}</p>
      <h1 className="mt-4 text-4xl font-semibold leading-[1.05] tracking-[-0.02em] sm:text-6xl">{t("cat.title")}</h1>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">{t("cat.sub")}</p>
    </header>
  );
}
