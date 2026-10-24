"use client";

import type { ReactNode } from "react";
import { useT } from "@/lib/i18n";
import { useSettings } from "@/components/providers/Providers";
import { OrAdd, Placeholder } from "@/components/ui/Placeholder";
import { BoltIcon, PinIcon, TagIcon, TruckIcon, WhatsAppIcon } from "@/components/ui/icons";

function Item({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <li className="flex gap-3.5 py-5 sm:px-6 sm:first:pl-0 lg:py-7">
      <span className="mt-0.5 shrink-0 text-electric">{icon}</span>
      <div className="min-w-0">
        <p className="text-sm font-medium text-fg">{title}</p>
        <p className="mt-1 text-sm text-muted">{children}</p>
      </div>
    </li>
  );
}

/**
 * Facts only: everything here is either known from the owner’s brief or
 * comes from Site settings. Missing values show [ADD: ...] placeholders.
 */
export function TrustStrip() {
  const t = useT();
  const s = useSettings();

  return (
    <section aria-label={t("trust.label")} className="border-y hairline bg-elev/40">
      <ul className="container-site grid divide-y hairline sm:grid-cols-2 sm:divide-y-0 lg:grid-cols-5 lg:divide-x [&>li]:hairline">
        <Item icon={<BoltIcon />} title={t("trust.trade")}>
          {t("trust.tradeSub")}
        </Item>
        <Item icon={<PinIcon />} title={t("trust.location")}>
          <OrAdd value={s.address} label="Shop address" />
        </Item>
        <Item icon={<TagIcon />} title={t("trust.brands")}>
          {s.brandsStocked.length ? s.brandsStocked.join(" · ") : <Placeholder label="Brands stocked" />}
        </Item>
        <Item icon={<WhatsAppIcon />} title={t("trust.quote")}>
          <OrAdd value={s.quoteResponseTime} label="Quote response time" />
        </Item>
        <Item icon={<TruckIcon />} title={t("trust.delivery")}>
          <OrAdd value={s.deliveryPromise} label="Delivery promise" />
        </Item>
      </ul>
    </section>
  );
}
