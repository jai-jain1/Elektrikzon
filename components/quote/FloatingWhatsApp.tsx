"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useQuoteCount } from "@/lib/quote";
import { useUI } from "@/lib/ui";
import { useT } from "@/lib/i18n";
import { useIsLite } from "@/lib/prefs";
import { useFinePointer } from "@/lib/hooks";
import { useSettings } from "@/components/providers/Providers";
import { buildWhatsAppUrl, DEFAULT_QUOTE_MESSAGE } from "@/lib/whatsapp";
import { getSourceToken } from "@/lib/source";
import { CloseIcon, ListIcon, WhatsAppIcon } from "@/components/ui/icons";

const NUDGE_DELAY_MS = 60_000;
const NUDGE_KEY = "ez-nudge-dismissed";

/**
 * Floating button bottom-right. With items in the quote list it opens the
 * list; otherwise it opens WhatsApp directly. Desktop visitors get one
 * gentle nudge after 60 seconds (once per session, never on touch).
 */
export function FloatingWhatsApp() {
  const t = useT();
  const s = useSettings();
  const lite = useIsLite();
  const fine = useFinePointer();
  const count = useQuoteCount();
  const barVisible = useUI((u) => u.barVisible);
  const setQuoteOpen = useUI((u) => u.setQuoteOpen);
  const [nudge, setNudge] = useState(false);
  const [source, setSource] = useState("web");

  useEffect(() => setSource(getSourceToken()), []);

  const direct = buildWhatsAppUrl(s.whatsappNumber, `${DEFAULT_QUOTE_MESSAGE}\nRef: EZ-${source.toUpperCase()}`);

  useEffect(() => {
    if (!fine || count > 0) {
      setNudge(false);
      return;
    }
    try {
      if (window.sessionStorage.getItem(NUDGE_KEY)) return;
    } catch {
      /* ignore */
    }
    const id = window.setTimeout(() => setNudge(true), NUDGE_DELAY_MS);
    return () => window.clearTimeout(id);
  }, [fine, count]);

  const dismiss = () => {
    setNudge(false);
    try {
      window.sessionStorage.setItem(NUDGE_KEY, "1");
    } catch {
      /* ignore */
    }
  };

  const base =
    "relative flex h-14 w-14 items-center justify-center rounded-full bg-accent text-on-accent shadow-[0_12px_32px_-12px_rgb(0_0_0/0.8)] transition-[background-color,transform] duration-300 hover:scale-105 hover:bg-amber";

  return (
    // Hidden while the request-quote bar is up: the bar offers the same actions.
    <div
      aria-hidden={barVisible || undefined}
      className={`fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-4 z-[45] flex flex-col items-end gap-3 transition-[opacity,transform] duration-500 ease-film sm:bottom-6 sm:right-6 ${
        barVisible ? "pointer-events-none translate-y-4 opacity-0 [visibility:hidden]" : "opacity-100"
      }`}
    >
      <AnimatePresence>
        {nudge && (
          <motion.div
            role="status"
            initial={lite ? false : { opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10 }}
            className="relative w-64 rounded-2xl border bg-elev/95 p-4 pr-10 text-sm shadow-2xl backdrop-blur-xl hairline"
          >
            <p className="text-fg">{t("quote.nudge")}</p>
            {direct && (
              <a
                href={direct}
                target="_blank"
                rel="noopener noreferrer"
                onClick={dismiss}
                className="mt-2 inline-flex min-h-[36px] items-center text-sm font-medium text-electric hover:text-amber"
              >
                {t("quote.nudgeCta")}
              </a>
            )}
            <button type="button" onClick={dismiss} className="icon-btn absolute right-1 top-1 h-9 w-9" aria-label={t("quote.dismiss")}>
              <CloseIcon size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {count > 0 ? (
        <button type="button" onClick={() => setQuoteOpen(true)} className={base} aria-label={`${t("quote.open")} (${count})`}>
          <ListIcon size={24} />
          <span className="absolute -right-1 -top-1 flex h-6 min-w-6 items-center justify-center rounded-full bg-fg px-1.5 text-xs font-semibold tabular-nums text-bg">
            {count}
          </span>
        </button>
      ) : direct ? (
        <a
          href={direct}
          target="_blank"
          rel="noopener noreferrer"
          className={base}
          aria-label={t("quote.fab")}
        >
          <WhatsAppIcon size={26} />
        </a>
      ) : (
        <span role="link" aria-disabled="true" title="[ADD: WhatsApp number]" className={`${base} cursor-not-allowed opacity-60`} aria-label={t("quote.fab")}>
          <WhatsAppIcon size={26} />
        </span>
      )}
    </div>
  );
}
