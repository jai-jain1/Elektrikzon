"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { NAV_ITEMS } from "@/data/navigation";
import { useT } from "@/lib/i18n";
import { LogoMark, Wordmark } from "@/components/ui/Logo";
import { ListIcon, MenuIcon } from "@/components/ui/icons";
import { useQuoteCount } from "@/lib/quote";
import { useUI } from "@/lib/ui";
import { LangToggle, ThemeToggle } from "@/components/ui/Toggles";
import { WhatsAppButton } from "@/components/whatsapp/WhatsAppButton";
import { MobileMenu } from "@/components/layout/MobileMenu";

export function Header() {
  const t = useT();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const quoteCount = useQuoteCount();
  const setQuoteOpen = useUI((u) => u.setQuoteOpen);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the menu whenever the route changes.
  useEffect(() => setOpen(false), [pathname]);

  const closeMenu = useCallback(() => {
    setOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  const isActive = (href: string) => !href.includes("#") && pathname === href;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ease-film ${
          scrolled ? "border-b bg-bg/70 backdrop-blur-2xl backdrop-saturate-150 hairline" : "border-b border-transparent bg-bg/40 backdrop-blur-md"
        }`}
      >
        <div className="container-site flex h-14 items-center justify-between gap-4 lg:h-12">
          <Link href="/" aria-label={t("nav.home")} className="flex items-center gap-2.5 text-fg">
            <LogoMark size={22} />
            <Wordmark className="text-[1.05rem]" />
          </Link>

          <nav aria-label={t("nav.main")} className="hidden xl:block">
            <ul className="flex items-center gap-0.5">
              {NAV_ITEMS.filter((i) => i.primary).map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className="relative rounded-full px-3 py-1.5 text-xs text-fg/75 transition-colors hover:text-fg aria-[current=page]:text-fg"
                  >
                    {t(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-1">
            <LangToggle />
            {/* On phones the theme switch lives in the menu, to keep the bar uncluttered. */}
            <ThemeToggle className="hidden sm:inline-flex" />
            <button
              type="button"
              className="icon-btn relative"
              onClick={() => setQuoteOpen(true)}
              aria-label={`${t("quote.open")}${quoteCount ? ` (${quoteCount})` : ""}`}
            >
              <ListIcon />
              {quoteCount > 0 && (
                <span className="absolute right-0.5 top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent px-1 text-[0.65rem] font-semibold tabular-nums text-on-accent">
                  {quoteCount}
                </span>
              )}
            </button>
            <WhatsAppButton className="btn-primary ml-2 hidden min-h-[30px] px-3.5 text-xs sm:inline-flex" showIcon={false}>{t("header.quote")}</WhatsAppButton>
            <button
              ref={menuButtonRef}
              type="button"
              className="icon-btn xl:hidden"
              aria-label={t("header.openMenu")}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen(true)}
            >
              <MenuIcon size={22} />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={open} onClose={closeMenu} />
    </>
  );
}
