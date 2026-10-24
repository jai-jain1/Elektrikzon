"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import type { TKey } from "@/data/translations";
import { useT } from "@/lib/i18n";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";
import { ArrowRightIcon, CompassIcon, HelmetIcon, HomeIcon, StoreIcon } from "@/components/ui/icons";

interface Audience {
  key: "home" | "design" | "contract" | "resell";
  icon: ReactNode;
  href?: string;
}

const AUDIENCES: Audience[] = [
  { key: "home", icon: <HomeIcon size={26} />, href: "/products" },
  { key: "design", icon: <CompassIcon size={26} />, href: "/designers" },
  { key: "contract", icon: <HelmetIcon size={26} />, href: "/contractors" },
  { key: "resell", icon: <StoreIcon size={26} /> },
];

const ctaClass =
  "mt-auto inline-flex min-h-[44px] items-center gap-2 pt-6 text-sm font-medium text-fg transition-colors group-hover:text-amber";

export function WhoWeSupply() {
  const t = useT();
  const k = (a: Audience, part: string) => `who.${a.key}.${part}` as TKey;

  return (
    <section id="who-we-supply" aria-labelledby="who-title" className="container-site py-20 lg:py-28">
      <div className="max-w-2xl">
        <p className="eyebrow">{t("who.eyebrow")}</p>
        <h2 id="who-title" className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.02em] sm:text-5xl">
          {t("who.title")}
        </h2>
      </div>

      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {AUDIENCES.map((a, i) => (
          <li
            key={a.key}
            className="group relative flex flex-col overflow-hidden rounded-2xl border bg-surface/60 p-6 transition-[border-color,transform] duration-500 ease-film hairline hover:-translate-y-1 hover:border-accent/40 lg:p-7"
          >

            <div className="flex items-center justify-between">
              <span className="text-electric">{a.icon}</span>
              <span className="text-xs tabular-nums text-muted">{String(i + 1).padStart(2, "0")}</span>
            </div>
            <h3 className="mt-8 text-2xl leading-tight">{t(k(a, "title"))}</h3>
            <p className="mt-3 text-sm leading-relaxed text-muted">{t(k(a, "body"))}</p>

            {a.href ? (
              <Link href={a.href} className={`${ctaClass} after:absolute after:inset-0`}>
                {t(k(a, "cta"))}
                <ArrowRightIcon size={16} />
              </Link>
            ) : (
              <WhatsAppButton message={t("who.resell.message")} className={ctaClass} showIcon>
                {t(k(a, "cta"))}
              </WhatsAppButton>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
