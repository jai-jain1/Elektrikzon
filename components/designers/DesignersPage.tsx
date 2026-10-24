"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n";
import { PageIntro, BenefitGrid } from "@/components/ui/PageIntro";
import { PasteList } from "@/components/designers/PasteList";
import { ArrowRightIcon } from "@/components/ui/icons";

export function DesignersPage() {
  const t = useT();
  return (
    <>
      <PageIntro eyebrow="des.eyebrow" title="des.title" sub="des.sub" />
      <BenefitGrid
        items={[
          { title: "des.b1.title", body: "des.b1.body" },
          { title: "des.b2.title", body: "des.b2.body" },
          { title: "des.b3.title", body: "des.b3.body" },
          { title: "des.b4.title", body: "des.b4.body" },
        ]}
      />
      <div className="container-site mt-16 grid gap-10 lg:grid-cols-[1.6fr_1fr]">
        <PasteList />
        <aside className="space-y-3">
          <h2 className="eyebrow font-sans">{t("des.tools")}</h2>
          <Link href="/#light-lab" className="group flex min-h-[64px] items-center justify-between rounded-2xl border px-5 hairline hover:border-accent/40">
            <span className="font-display text-xl">{t("des.lightlab")}</span>
            <ArrowRightIcon size={18} className="text-electric transition-transform group-hover:translate-x-1" />
          </Link>
          <Link href="/#configurator" className="group flex min-h-[64px] items-center justify-between rounded-2xl border px-5 hairline hover:border-accent/40">
            <span className="font-display text-xl">{t("des.configurator")}</span>
            <ArrowRightIcon size={18} className="text-electric transition-transform group-hover:translate-x-1" />
          </Link>
          <Link href="/products" className="group flex min-h-[64px] items-center justify-between rounded-2xl border px-5 hairline hover:border-accent/40">
            <span className="font-display text-xl">{t("hero.ctaBrowse")}</span>
            <ArrowRightIcon size={18} className="text-electric transition-transform group-hover:translate-x-1" />
          </Link>
        </aside>
      </div>
    </>
  );
}
