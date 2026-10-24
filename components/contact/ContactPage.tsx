"use client";

import type { ReactNode } from "react";
import { useT } from "@/lib/i18n";
import { useSettings } from "@/components/providers/Providers";
import { PageIntro } from "@/components/ui/PageIntro";
import { OrAdd, Placeholder } from "@/components/ui/Placeholder";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";
import { ShopQR } from "@/components/contact/ShopQR";
import { ArrowUpRightIcon, ClockIcon, MailIcon, PhoneIcon, PinIcon, TruckIcon, WhatsAppIcon } from "@/components/ui/icons";

function Card({ icon, title, children }: { icon: ReactNode; title: string; children: ReactNode }) {
  return (
    <div className="rounded-2xl border bg-surface/50 p-6 hairline">
      <div className="flex items-center gap-3 text-electric">
        {icon}
        <h2 className="eyebrow font-sans">{title}</h2>
      </div>
      <div className="mt-4 text-sm leading-relaxed text-muted">{children}</div>
    </div>
  );
}

export function ContactPage() {
  const t = useT();
  const s = useSettings();

  return (
    <>
      <PageIntro eyebrow="contact.eyebrow" title="contact.title" sub="contact.sub" />
      <div className="container-site grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card icon={<WhatsAppIcon />} title={t("footer.whatsapp")}>
          <WhatsAppButton>{t("hero.ctaQuote")}</WhatsAppButton>
          {s.whatsappNumber ? (
            <p className="mt-3 font-mono text-fg">+{s.whatsappNumber}</p>
          ) : (
            <p className="mt-3">
              <Placeholder label="WhatsApp number" />
            </p>
          )}
        </Card>
        <Card icon={<PhoneIcon />} title={t("footer.call")}>
          {s.phone ? (
            <a href={`tel:${s.phone.replace(/[^\d+]/g, "")}`} className="text-lg text-fg hover:text-amber">
              {s.phone}
            </a>
          ) : (
            <Placeholder label="Phone number" />
          )}
        </Card>
        <Card icon={<MailIcon />} title={t("footer.email")}>
          {s.email ? (
            <a href={`mailto:${s.email}`} className="break-all text-lg text-fg hover:text-amber">
              {s.email}
            </a>
          ) : (
            <Placeholder label="Email address" />
          )}
        </Card>
        <Card icon={<PinIcon />} title={t("contact.visit")}>
          <p className="text-fg">
            <OrAdd value={s.address} label="Shop address" />
          </p>
          <p>
            {s.city}, {s.region} {s.postalCode}
          </p>
          {s.mapsUrl ? (
            <a href={s.mapsUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-[44px] items-center gap-1.5 text-fg hover:text-amber">
              {t("contact.map")}
              <ArrowUpRightIcon size={14} />
            </a>
          ) : (
            <p className="mt-3">
              <Placeholder label="Google Maps link" />
            </p>
          )}
        </Card>
        <Card icon={<ClockIcon />} title={t("contact.hours")}>
          <p className="text-fg">
            <OrAdd value={s.openingHours} label="Opening hours" />
          </p>
        </Card>
        <Card icon={<TruckIcon />} title={t("contact.areas")}>
          <p className="text-fg">{s.deliveryAreas.length ? s.deliveryAreas.join(", ") : <Placeholder label="Delivery areas" />}</p>
          <p className="mt-2">
            <OrAdd value={s.deliveryPromise} label="Delivery promise" />
          </p>
        </Card>
      </div>

      <div className="container-site mt-10 grid gap-6 lg:grid-cols-2">
        <ShopQR />
        <div className="rounded-3xl border p-6 text-sm text-muted hairline sm:p-8">
          <p>
            {t("footer.gst")}: <OrAdd value={s.gstNumber} label="GSTIN" />
          </p>
          <p className="mt-4">{t("quote.privacy")}</p>
        </div>
      </div>
    </>
  );
}
