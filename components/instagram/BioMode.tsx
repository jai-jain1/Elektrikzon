"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { useT } from "@/lib/i18n";
import { useFocusTrap } from "@/lib/useFocusTrap";
import { useSettings } from "@/components/providers/Providers";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";
import { LogoMark, Wordmark } from "@/components/ui/Logo";
import { LangToggle } from "@/components/ui/Toggles";
import { ArrowRightIcon } from "@/components/ui/icons";

const BIO_HASH = "#ig-bio";

/**
 * Link-in-bio mode: visitors arriving from the Instagram bio link
 * (…/#ig-bio) see big, thumb-friendly quick links first. The source token
 * is already captured, so their quotes show “Ref: EZ-IG-BIO”.
 */
export function BioMode() {
  const t = useT();
  const s = useSettings();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setOpen(window.location.hash === BIO_HASH);
    check();
    window.addEventListener("hashchange", check);
    return () => window.removeEventListener("hashchange", check);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    try {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    } catch {
      /* ignore */
    }
  }, []);

  useFocusTrap(ref, open, close);

  if (!open) return null;

  const link = "group flex min-h-[60px] items-center justify-between rounded-2xl border px-5 text-base hairline hover:border-accent/50";

  return (
    <div
      ref={ref}
      role="dialog"
      aria-modal="true"
      aria-label={t("bio.label")}
      className="fixed inset-0 z-[75] overflow-y-auto bg-bg"
      style={{ background: "radial-gradient(ellipse at 50% -10%, rgb(var(--fg) / 0.08), transparent 55%), rgb(var(--bg))" }}
    >
      <div className="mx-auto flex min-h-full max-w-md flex-col px-5 pb-10 pt-12">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <LogoMark size={34} />
            <Wordmark className="text-2xl" />
          </div>
          <LangToggle />
        </div>
        <p className="mt-3 text-sm text-muted">{t("bio.sub")}</p>

        <nav aria-label={t("bio.label")} className="mt-8 space-y-3">
          <WhatsAppButton className="btn-primary min-h-[60px] w-full text-base">{t("bio.quote")}</WhatsAppButton>
          <Link href="/products" onClick={close} className={link}>
            {t("bio.catalogue")}
            <ArrowRightIcon size={18} className="text-electric" />
          </Link>
          <Link href="/configurator" onClick={close} className={link}>
            {t("bio.configurator")}
            <ArrowRightIcon size={18} className="text-electric" />
          </Link>
          <Link href="/light-lab" onClick={close} className={link}>
            {t("bio.lightlab")}
            <ArrowRightIcon size={18} className="text-electric" />
          </Link>
          <Link href="/contact" onClick={close} className={link}>
            {t("bio.contact")}
            <ArrowRightIcon size={18} className="text-electric" />
          </Link>
          {s.mapsUrl && (
            <a href={s.mapsUrl} target="_blank" rel="noopener noreferrer" className={link}>
              {t("footer.directions")}
              <ArrowRightIcon size={18} className="text-electric" />
            </a>
          )}
        </nav>

        <button type="button" onClick={close} className="mt-auto pt-10 text-sm text-muted underline-offset-4 hover:text-fg hover:underline">
          {t("bio.full")}
        </button>
      </div>
    </div>
  );
}
