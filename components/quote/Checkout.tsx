"use client";

import { useEffect, useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import type { QuoteItem } from "@/lib/quote";
import { fmt, useT } from "@/lib/i18n";
import { useUI } from "@/lib/ui";
import { copyText } from "@/lib/clipboard";
import { formatINR } from "@/lib/money";
import { buildUpiLink, newOrderId } from "@/lib/upi";
import { buildOrderMessage } from "@/lib/quote-message";
import { getSourceToken } from "@/lib/source";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { useSettings } from "@/components/providers/Providers";
import { OrAdd, Placeholder } from "@/components/ui/Placeholder";
import { ArrowLeftIcon, CopyIcon, WhatsAppIcon } from "@/components/ui/icons";

const field = "mt-1.5 block min-h-[44px] w-full rounded-xl border bg-surface/60 px-3.5 text-sm text-fg hairline";

/**
 * UPI checkout without a payment gateway:
 * details → UPI QR / app link with the exact amount → order sent to the
 * shop on WhatsApp, where the payment is checked and the order confirmed.
 * Nothing is stored or sent anywhere else.
 */
export function Checkout({ items, total, onBack, onDone }: { items: QuoteItem[]; total: number; onBack: () => void; onDone: () => void }) {
  const t = useT();
  const s = useSettings();
  const showToast = useUI((u) => u.showToast);
  const [step, setStep] = useState<"details" | "pay">("details");
  const [name, setName] = useState("");
  const [pickup, setPickup] = useState(false);
  const [address, setAddress] = useState("");
  const [utr, setUtr] = useState("");
  const [error, setError] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [sent, setSent] = useState(false);

  // Generated on the client only (avoids a server/client mismatch).
  useEffect(() => setOrderId(newOrderId()), []);

  const upiLink = useMemo(
    () => (orderId && s.upiId ? buildUpiLink({ vpa: s.upiId, payee: s.upiPayeeName || "ElektrikZone", amount: total, orderId }) : ""),
    [orderId, s.upiId, s.upiPayeeName, total],
  );

  const message = buildOrderMessage(items, { orderId, name, pickup, address, total, upiId: s.upiId, utr, source: getSourceToken() });
  const waHref = buildWhatsAppUrl(s.whatsappNumber, message);

  const toPay = () => {
    if (!name.trim() || (!pickup && !address.trim())) {
      setError(true);
      return;
    }
    setError(false);
    setStep("pay");
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="flex-1 overflow-y-auto px-5 py-4">
        <button
          type="button"
          onClick={step === "pay" ? () => setStep("details") : onBack}
          className="mb-4 inline-flex min-h-[36px] items-center gap-1.5 text-sm text-muted hover:text-fg"
        >
          <ArrowLeftIcon size={15} />
          {t("checkout.back")}
        </button>

        <div className="flex items-baseline justify-between rounded-xl bg-elev px-4 py-3">
          <span className="text-sm text-muted">{t("checkout.total")}</span>
          <span className="text-xl font-semibold tabular-nums">{formatINR(total)}</span>
        </div>

        {step === "details" ? (
          <div className="mt-5 space-y-4">
            <label className="block text-xs text-muted">
              {t("checkout.name")}
              <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" maxLength={80} className={field} aria-invalid={error && !name.trim() ? true : undefined} />
            </label>
            <fieldset>
              <legend className="text-xs text-muted">{t("checkout.fulfil")}</legend>
              <div className="mt-2 grid grid-cols-2 gap-2">
                {[
                  { v: false, label: t("checkout.delivery") },
                  { v: true, label: t("checkout.pickup") },
                ].map((o) => (
                  <label key={String(o.v)} className="cursor-pointer">
                    <input type="radio" name="fulfil" checked={pickup === o.v} onChange={() => setPickup(o.v)} className="peer sr-only" />
                    <span className="flex min-h-[44px] items-center justify-center rounded-xl border px-3 text-center text-sm text-muted transition-colors hairline peer-checked:border-fg peer-checked:text-fg peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-fg">
                      {o.label}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
            {!pickup && (
              <label className="block text-xs text-muted">
                {t("checkout.address")}
                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  autoComplete="street-address"
                  rows={3}
                  maxLength={300}
                  className={`${field} py-2.5`}
                  aria-invalid={error && !address.trim() ? true : undefined}
                />
              </label>
            )}
            <p className="text-xs leading-relaxed text-muted">
              <OrAdd value={s.orderNote} label="Delivery charges and pickup timings" />
            </p>
            {error && (
              <p role="alert" className="text-sm text-fg">
                {t("checkout.required")}
              </p>
            )}
            <p className="text-[0.7rem] leading-relaxed text-muted">{t("quote.privacy")}</p>
          </div>
        ) : (
          <div className="mt-5 space-y-4">
            <p className="text-xs text-muted">
              {t("checkout.orderId")}: <span className="font-mono text-fg">{orderId}</span>
            </p>
            {upiLink ? (
              <div className="flex flex-col items-center gap-3 rounded-2xl border p-5 text-center hairline">
                <div className="rounded-xl bg-white p-3">
                  <QRCodeSVG value={upiLink} size={188} level="M" marginSize={1} title={fmt(t("checkout.pay"), { amount: formatINR(total) })} />
                </div>
                <p className="text-sm font-medium">{fmt(t("checkout.pay"), { amount: formatINR(total) })}</p>
                <p className="text-xs text-muted">{t("checkout.scan")}</p>
                {/* Phones: open the UPI app directly with the amount filled in. */}
                <a href={upiLink} className="btn-ghost w-full [@media(pointer:fine)]:hidden">
                  {t("checkout.openApp")}
                </a>
                <button
                  type="button"
                  className="inline-flex min-h-[36px] items-center gap-1.5 text-xs text-muted hover:text-fg"
                  onClick={async () => {
                    if (await copyText(s.upiId)) showToast(t("checkout.copied"));
                  }}
                >
                  <CopyIcon size={14} />
                  {t("checkout.upiId")}: <span className="font-mono text-fg">{s.upiId}</span>
                </button>
              </div>
            ) : (
              <Placeholder label="UPI ID in Site settings" />
            )}
            <label className="block text-xs text-muted">
              {t("checkout.utr")}
              <input value={utr} onChange={(e) => setUtr(e.target.value.replace(/[^\w]/g, "").slice(0, 22))} inputMode="numeric" className={field} />
              <span className="mt-1 block text-[0.7rem]">{t("checkout.utrHelp")}</span>
            </label>
            <p className="text-xs leading-relaxed text-muted">{t("checkout.confirmNote")}</p>
          </div>
        )}
      </div>

      <footer className="space-y-2 border-t px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))] hairline">
        {step === "details" ? (
          <button type="button" onClick={toPay} className="btn-primary w-full">
            {t("checkout.continue")}
          </button>
        ) : waHref ? (
          <a href={waHref} target="_blank" rel="noopener noreferrer" onClick={() => setSent(true)} className="btn-primary w-full">
            <WhatsAppIcon size={18} />
            {t("checkout.send")}
          </a>
        ) : (
          <div className="space-y-1 text-center">
            <span role="link" aria-disabled="true" className="btn-primary w-full">
              <WhatsAppIcon size={18} />
              {t("checkout.send")}
            </span>
            <Placeholder label="WhatsApp number in Site settings" />
          </div>
        )}
        {/* After sending, the customer can empty the bag (kept until then in case WhatsApp didn’t open). */}
        {sent && (
          <button type="button" onClick={onDone} className="btn-ghost w-full">
            {t("quote.clear")}
          </button>
        )}
      </footer>
    </div>
  );
}
