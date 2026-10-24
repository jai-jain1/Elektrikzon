"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useT } from "@/lib/i18n";
import { useIsLite } from "@/lib/prefs";
import { useQuoteCount } from "@/lib/quote";
import { useUI } from "@/lib/ui";
import { useSettings } from "@/components/providers/Providers";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";
import { OrAdd } from "@/components/ui/Placeholder";
import { ListIcon } from "@/components/ui/icons";

const TRADE_PRICE_MESSAGE = "Hello ElektrikZone, I’d like a trade price. My list:";

/**
 * Slim “Request trade price” bar pinned to the bottom of the screen.
 * Appears once the visitor scrolls past the first screen, hides over the
 * footer. With items in the quote list, it opens the list instead.
 */
export function QuoteBar() {
  const t = useT();
  const s = useSettings();
  const lite = useIsLite();
  const count = useQuoteCount();
  const setQuoteOpen = useUI((u) => u.setQuoteOpen);
  const setBarVisible = useUI((u) => u.setBarVisible);
  const [pastHero, setPastHero] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setPastHero(window.scrollY > window.innerHeight * 0.8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    const footer = document.querySelector("footer");
    let io: IntersectionObserver | null = null;
    if (footer && typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(([e]) => setFooterVisible(e.isIntersecting));
      io.observe(footer);
    }
    return () => {
      window.removeEventListener("scroll", onScroll);
      io?.disconnect();
    };
  }, []);

  const show = pastHero && !footerVisible;

  useEffect(() => setBarVisible(show), [show, setBarVisible]);

  return (
    <AnimatePresence>
      {show && (
        <motion.aside
          aria-label={t("quotebar.cta")}
          initial={lite ? false : { y: 96, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={lite ? { opacity: 0, transition: { duration: 0 } } : { y: 96, opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6"
        >
          <div className="mx-auto flex max-w-3xl items-center gap-3 rounded-full border bg-elev/90 py-2 pl-5 pr-2 shadow-[0_20px_60px_-20px_rgb(0_0_0/0.7)] backdrop-blur-xl hairline">
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-[0.8rem] leading-snug text-fg sm:truncate sm:text-sm">{t("quotebar.text")}</p>
              <p className="hidden truncate text-xs text-muted sm:block">
                {t("quotebar.reply")}: <OrAdd value={s.quoteResponseTime} label="Quote response time" />
              </p>
            </div>
            {count > 0 ? (
              <button type="button" onClick={() => setQuoteOpen(true)} className="btn-primary shrink-0 px-4">
                <ListIcon size={18} />
                {t("quote.view")}
                <span className="tabular-nums">({count})</span>
              </button>
            ) : (
              <WhatsAppButton message={TRADE_PRICE_MESSAGE} className="btn-primary shrink-0 px-4">
                <span className="hidden min-[400px]:inline">{t("quotebar.cta")}</span>
                <span className="min-[400px]:hidden">{t("footer.whatsapp")}</span>
              </WhatsAppButton>
            )}
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
