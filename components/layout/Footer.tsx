"use client";

import Link from "next/link";
import { NAV_ITEMS } from "@/data/navigation";
import { useT } from "@/lib/i18n";
import { useSettings } from "@/components/providers/Providers";
import { OrAdd, Placeholder } from "@/components/ui/Placeholder";
import { LogoMark, Wordmark } from "@/components/ui/Logo";
import { LiteToggle } from "@/components/ui/Toggles";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";
import { ClockIcon, InstagramIcon, MailIcon, PhoneIcon, PinIcon, ArrowUpRightIcon } from "@/components/ui/icons";

function ColumnTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="eyebrow mb-4 font-sans">{children}</h2>;
}

export function Footer() {
  const t = useT();
  const s = useSettings();
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-24 border-t hairline">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgb(var(--fg) / 0.22), transparent)" }}
      />

      <div className="container-site py-16 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <p className="max-w-2xl font-display text-[2rem] leading-[1.1] tracking-[-0.015em] sm:text-5xl">
            {t("footer.statement")}
          </p>
          <div className="lg:justify-self-end">
            <WhatsAppButton>{t("hero.ctaQuote")}</WhatsAppButton>
          </div>
        </div>

        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <ColumnTitle>{t("footer.visit")}</ColumnTitle>
            <ul className="space-y-3 text-sm text-muted">
              <li className="flex gap-3">
                <PinIcon size={18} className="mt-0.5 shrink-0 text-electric" />
                <span>
                  <OrAdd value={s.address} label="Shop address" />
                  <br />
                  {s.city}, {s.region}
                  {s.postalCode ? ` ${s.postalCode}` : ""}
                </span>
              </li>
              <li className="flex gap-3">
                <ClockIcon size={18} className="mt-0.5 shrink-0 text-electric" />
                <span>
                  <span className="sr-only">{t("footer.hours")}: </span>
                  <OrAdd value={s.openingHours} label="Opening hours" />
                </span>
              </li>
              <li className="pl-[30px]">
                {s.mapsUrl ? (
                  <a href={s.mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-fg underline-offset-4 hover:underline">
                    {t("footer.directions")} <ArrowUpRightIcon size={14} />
                  </a>
                ) : (
                  <Placeholder label="Google Maps link" />
                )}
              </li>
            </ul>
          </div>

          <div>
            <ColumnTitle>{t("footer.talk")}</ColumnTitle>
            <ul className="space-y-3 text-sm text-muted">
              <li>
                <WhatsAppButton className="inline-flex items-center gap-3 text-fg hover:text-amber [&>svg]:text-electric">
                  {t("footer.whatsapp")}
                </WhatsAppButton>
              </li>
              <li className="flex gap-3">
                <PhoneIcon size={18} className="mt-0.5 shrink-0 text-electric" />
                {s.phone ? (
                  <a href={`tel:${s.phone.replace(/[^\d+]/g, "")}`} className="text-fg hover:text-amber">
                    {s.phone}
                  </a>
                ) : (
                  <Placeholder label="Phone number" />
                )}
              </li>
              <li className="flex gap-3">
                <MailIcon size={18} className="mt-0.5 shrink-0 text-electric" />
                {s.email ? (
                  <a href={`mailto:${s.email}`} className="break-all text-fg hover:text-amber">
                    {s.email}
                  </a>
                ) : (
                  <Placeholder label="Email address" />
                )}
              </li>
            </ul>
          </div>

          <div>
            <ColumnTitle>{t("footer.explore")}</ColumnTitle>
            <ul className="space-y-2.5 text-sm">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-muted transition-colors hover:text-fg">
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <ColumnTitle>{t("footer.follow")}</ColumnTitle>
            <ul className="space-y-3 text-sm text-muted">
              <li className="flex gap-3">
                <InstagramIcon size={18} className="mt-0.5 shrink-0 text-electric" />
                {s.instagramUrl ? (
                  <a href={`${s.instagramUrl}`} target="_blank" rel="noopener noreferrer" className="text-fg hover:text-amber">
                    {s.instagramHandle || t("footer.instagram")}
                  </a>
                ) : (
                  <Placeholder label="Instagram profile URL" />
                )}
              </li>
            </ul>
            <div className="mt-6">
              <LiteToggle />
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t pt-8 text-xs text-muted hairline sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5 text-fg">
            <LogoMark size={22} />
            <Wordmark className="text-base" />
          </div>
          <p>
            {t("footer.gst")}: <OrAdd value={s.gstNumber} label="GSTIN" />
          </p>
          <p>
            © {year} {s.businessName}. {t("footer.rights")}
          </p>
        </div>
      </div>
    </footer>
  );
}
