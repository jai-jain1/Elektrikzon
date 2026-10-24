"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { NAV_ITEMS } from "@/data/navigation";
import { useT } from "@/lib/i18n";
import { useIsLite } from "@/lib/prefs";
import { CloseIcon } from "@/components/ui/icons";
import { LiteToggle, LangToggle, ThemeToggle } from "@/components/ui/Toggles";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";
import { LogoMark, Wordmark } from "@/components/ui/Logo";

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

export function MobileMenu({ open, onClose }: { open: boolean; onClose: () => void }) {
  const t = useT();
  const lite = useIsLite();
  const panelRef = useRef<HTMLDivElement>(null);

  // Scroll lock, Escape to close, focus trap.
  useEffect(() => {
    if (!open) return;
    const panel = panelRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const first = panel?.querySelector<HTMLElement>(FOCUSABLE);
    first?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab" || !panel) return;
      const items = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (!items.length) return;
      const firstEl = items[0];
      const lastEl = items[items.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="mobile-menu"
          id="mobile-menu"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={t("header.menu")}
          className="fixed inset-0 z-[55] flex flex-col overflow-y-auto overflow-x-hidden bg-bg xl:hidden"
          initial={lite ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={lite ? { opacity: 0, transition: { duration: 0 } } : { opacity: 0 }}
          transition={{ duration: 0.35, ease }}
        >

          <div className="container-site flex h-16 shrink-0 items-center justify-between">
            <Link href="/" onClick={onClose} aria-label={t("nav.home")} className="flex items-center gap-2.5 text-fg">
              <LogoMark />
              <Wordmark />
            </Link>
            <button type="button" className="icon-btn" aria-label={t("header.closeMenu")} onClick={onClose}>
              <CloseIcon size={22} />
            </button>
          </div>

          <nav aria-label={t("nav.main")} className="container-site relative flex-1 pb-6 pt-6">
            <ul className="space-y-1">
              {NAV_ITEMS.map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={lite ? false : { opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.04, duration: 0.5, ease }}
                >
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className="group flex items-baseline gap-4 border-b py-3.5 font-display text-[1.9rem] leading-tight text-fg hairline"
                  >
                    <span className="font-sans text-xs tabular-nums text-electric">{String(i + 1).padStart(2, "0")}</span>
                    <span className="transition-transform duration-300 ease-film group-hover:translate-x-1">{t(item.key)}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </nav>

          <div className="container-site relative shrink-0 space-y-4 pb-8">
            <WhatsAppButton className="btn-primary w-full">{t("header.quote")}</WhatsAppButton>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <LiteToggle />
              <div className="flex items-center">
                <LangToggle />
                <ThemeToggle />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
