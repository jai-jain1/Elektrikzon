"use client";

import Link from "next/link";
import { useCallback, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useQuote, MAX_QTY } from "@/lib/quote";
import { useUI } from "@/lib/ui";
import { fmt, useT } from "@/lib/i18n";
import { useIsLite, useLang } from "@/lib/prefs";
import { localized } from "@/lib/localize";
import { useFocusTrap } from "@/lib/useFocusTrap";
import { buildQuoteMessage } from "@/lib/quote-message";
import { getSourceToken } from "@/lib/source";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { copyText } from "@/lib/clipboard";
import { useSettings } from "@/components/providers/Providers";
import { Placeholder } from "@/components/ui/Placeholder";
import { CloseIcon, CopyIcon, MinusIcon, PlusIcon, TrashIcon, WhatsAppIcon } from "@/components/ui/icons";

/** Slide-in quote basket with the WhatsApp message builder. */
export function QuoteDrawer() {
  const t = useT();
  const lang = useLang();
  const lite = useIsLite();
  const s = useSettings();
  const open = useUI((u) => u.quoteOpen);
  const setOpen = useUI((u) => u.setQuoteOpen);
  const showToast = useUI((u) => u.showToast);
  const { items, setQty, setFinish, remove, clear } = useQuote();
  const [name, setName] = useState("");
  const [area, setArea] = useState("");
  const [showPreview, setShowPreview] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), [setOpen]);
  useFocusTrap(panelRef, open, close);

  const message = useMemo(
    () => (open ? buildQuoteMessage(items, { name, area, source: getSourceToken() }) : ""),
    [open, items, name, area],
  );
  const href = buildWhatsAppUrl(s.whatsappNumber, message);

  const onCopy = async () => {
    if (await copyText(message)) showToast(t("quote.copied"));
  };

  const count = items.length;
  const ease = [0.22, 1, 0.36, 1] as const;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[65]" key="quote-drawer">
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={lite ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: lite ? 0 : 0.25 } }}
            onClick={close}
            aria-hidden="true"
          />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="quote-title"
            className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l bg-bg shadow-2xl hairline"
            initial={lite ? false : { x: "100%" }}
            animate={{ x: 0 }}
            exit={lite ? { opacity: 0, transition: { duration: 0 } } : { x: "100%", transition: { duration: 0.3, ease } }}
            transition={{ duration: 0.45, ease }}
          >
            <header className="flex items-center justify-between border-b px-5 py-4 hairline">
              <div>
                <h2 id="quote-title" className="text-2xl leading-tight">
                  {t("quote.title")}
                </h2>
                <p className="text-xs text-muted">{count === 1 ? t("quote.item1") : fmt(t("quote.items"), { n: String(count) })}</p>
              </div>
              <button type="button" className="icon-btn" onClick={close} aria-label={t("quote.close")}>
                <CloseIcon size={22} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {count === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-sm text-muted">{t("quote.empty")}</p>
                  <Link href="/products" onClick={close} className="btn-ghost mt-6">
                    {t("quote.browse")}
                  </Link>
                </div>
              ) : (
                <ol className="space-y-3">
                  {items.map((item, i) => {
                    const title = localized(lang, item.title, item.titleHi);
                    return (
                      <li key={item.key} className="rounded-xl border bg-surface/60 p-4 hairline">
                        <div className="flex items-start gap-3">
                          <span className="mt-0.5 text-xs tabular-nums text-electric">{String(i + 1).padStart(2, "0")}</span>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-fg">{title}</p>
                            {item.productId && <p className="mt-0.5 text-[0.7rem] text-muted">ID: {item.productId}</p>}
                            {item.detail && <p className="mt-1 text-xs leading-relaxed text-muted">{item.detail}</p>}
                          </div>
                          <button
                            type="button"
                            onClick={() => remove(item.key)}
                            className="icon-btn -mr-2 -mt-2 h-9 w-9 text-muted hover:text-fg"
                            aria-label={fmt(t("quote.remove"), { name: title })}
                          >
                            <TrashIcon size={17} />
                          </button>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-3 pl-7">
                          {item.kind !== "lighting" && (
                            <div className="flex items-center rounded-full border hairline" role="group" aria-label={`${t("quote.qty")}: ${title}`}>
                              <button
                                type="button"
                                className="icon-btn h-9 w-9"
                                onClick={() => setQty(item.key, item.qty - 1)}
                                disabled={item.qty <= 1}
                                aria-label={t("quote.decrease")}
                              >
                                <MinusIcon size={15} />
                              </button>
                              <input
                                type="number"
                                inputMode="numeric"
                                min={1}
                                max={MAX_QTY}
                                value={item.qty}
                                onChange={(e) => setQty(item.key, Number(e.target.value))}
                                aria-label={t("quote.qty")}
                                className="w-12 bg-transparent text-center text-sm tabular-nums text-fg [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                              />
                              <button
                                type="button"
                                className="icon-btn h-9 w-9"
                                onClick={() => setQty(item.key, item.qty + 1)}
                                aria-label={t("quote.increase")}
                              >
                                <PlusIcon size={15} />
                              </button>
                            </div>
                          )}
                          {item.kind === "product" && item.finishOptions && item.finishOptions.length > 0 && (
                            <label className="flex items-center gap-2 text-xs text-muted">
                              {t("quote.finish")}
                              <select
                                value={item.finish ?? ""}
                                onChange={(e) => setFinish(item.key, e.target.value || undefined)}
                                className="min-h-[36px] rounded-full border bg-bg px-3 text-xs text-fg hairline"
                              >
                                <option value="">{t("quote.finishAny")}</option>
                                {item.finishOptions.map((f) => (
                                  <option key={f} value={f}>
                                    {f}
                                  </option>
                                ))}
                              </select>
                            </label>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ol>
              )}

              {count > 0 && (
                <div className="mt-6 space-y-3">
                  <label className="block text-xs text-muted">
                    {t("quote.name")}
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
                      maxLength={80}
                      className="mt-1.5 block min-h-[44px] w-full rounded-xl border bg-surface/60 px-3.5 text-sm text-fg hairline"
                    />
                  </label>
                  <label className="block text-xs text-muted">
                    {t("quote.area")}
                    <input
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      maxLength={120}
                      className="mt-1.5 block min-h-[44px] w-full rounded-xl border bg-surface/60 px-3.5 text-sm text-fg hairline"
                    />
                  </label>
                  <p className="text-[0.7rem] leading-relaxed text-muted">{t("quote.privacy")}</p>

                  <button
                    type="button"
                    className="text-xs text-muted underline-offset-4 hover:text-fg hover:underline"
                    aria-expanded={showPreview}
                    onClick={() => setShowPreview((v) => !v)}
                  >
                    {t("quote.preview")}
                  </button>
                  {showPreview && (
                    <pre className="max-h-60 overflow-auto whitespace-pre-wrap rounded-xl border bg-elev p-3 font-sans text-xs leading-relaxed text-muted hairline">
                      {message}
                    </pre>
                  )}
                </div>
              )}
            </div>

            {count > 0 && (
              <footer className="space-y-2 border-t px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] hairline">
                {href ? (
                  <a href={href} target="_blank" rel="noopener noreferrer" className="btn-primary w-full">
                    <WhatsAppIcon size={18} />
                    {t("quote.send")}
                  </a>
                ) : (
                  <div className="space-y-1 text-center">
                    <span role="link" aria-disabled="true" className="btn-primary w-full">
                      <WhatsAppIcon size={18} />
                      {t("quote.send")}
                    </span>
                    <Placeholder label="WhatsApp number in Site settings" />
                  </div>
                )}
                <div className="flex gap-2">
                  <button type="button" onClick={onCopy} className="btn-ghost flex-1">
                    <CopyIcon size={16} />
                    {t("quote.copy")}
                  </button>
                  <button type="button" onClick={clear} className="btn-ghost">
                    {t("quote.clear")}
                  </button>
                </div>
              </footer>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
