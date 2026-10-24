"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n";
import { useSettings } from "@/components/providers/Providers";
import { PageIntro, BenefitGrid } from "@/components/ui/PageIntro";
import { OrAdd, Placeholder } from "@/components/ui/Placeholder";
import { TradeAccountForm } from "@/components/contractors/TradeAccountForm";
import { ArrowRightIcon } from "@/components/ui/icons";

export function ContractorsPage() {
  const t = useT();
  const s = useSettings();
  return (
    <>
      <PageIntro eyebrow="con.eyebrow" title="con.title" sub="con.sub" />
      <BenefitGrid
        items={[
          { title: "con.b1.title", body: "con.b1.body" },
          { title: "con.b2.title", body: "con.b2.body" },
          {
            title: "con.b3.title",
            body: (
              <>
                <OrAdd value={s.deliveryPromise} label="Delivery promise" />
                <br />
                <span className="mt-2 inline-block">
                  {t("con.areas")}: {s.deliveryAreas.length ? s.deliveryAreas.join(", ") : <Placeholder label="Delivery areas" />}
                </span>
              </>
            ),
          },
          { title: "trust.quote", body: <OrAdd value={s.quoteResponseTime} label="Quote response time" /> },
        ]}
      />
      <div className="container-site mt-8">
        <Link href="/products?category=technical-supply" className="inline-flex min-h-[44px] items-center gap-2 text-sm text-fg hover:text-amber">
          {t("con.browse")}
          <ArrowRightIcon size={16} />
        </Link>
      </div>
      <div className="container-site mt-12 max-w-4xl">
        <TradeAccountForm />
      </div>
    </>
  );
}
