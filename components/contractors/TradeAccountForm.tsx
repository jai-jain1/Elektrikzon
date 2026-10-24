"use client";

import { useEffect, useId, useState } from "react";
import type { TKey } from "@/data/translations";
import { useT } from "@/lib/i18n";
import { useLang } from "@/lib/prefs";
import { getSourceToken } from "@/lib/source";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { useSettings } from "@/components/providers/Providers";
import { Placeholder } from "@/components/ui/Placeholder";
import { WhatsAppIcon } from "@/components/ui/icons";

const INTERESTS = [
  { en: "Wires and cables", hi: "वायर और केबल" },
  { en: "MCBs and distribution", hi: "MCB और डिस्ट्रीब्यूशन" },
  { en: "Conduits and fittings", hi: "कंड्यूट और फ़िटिंग" },
  { en: "Switches and sockets", hi: "स्विच और सॉकेट" },
  { en: "Lighting", hi: "लाइटिंग" },
  { en: "Fans", hi: "पंखे" },
];

const VOLUMES = [
  { key: "con.form.vol.occasional", en: "Occasionally" },
  { key: "con.form.vol.monthly", en: "Every month" },
  { key: "con.form.vol.several", en: "Several projects a month" },
] as const;

const field = "mt-2 block min-h-[48px] w-full rounded-xl border bg-bg px-4 text-fg hairline";

/**
 * Trade account request. Nothing is submitted to a server: the details go
 * straight into a prefilled WhatsApp message that the visitor sends.
 */
export function TradeAccountForm() {
  const t = useT();
  const lang = useLang();
  const s = useSettings();
  const id = useId();
  const [error, setError] = useState(false);
  const [source, setSource] = useState("web");

  useEffect(() => setSource(getSourceToken()), []);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const get = (k: string) => String(data.get(k) ?? "").trim();
    const business = get("business");
    const person = get("person");
    if (!business || !person) {
      setError(true);
      return;
    }
    setError(false);
    const volume = VOLUMES.find((v) => v.key === get("volume"))?.en;
    const interests = data.getAll("interest").map(String);

    // null = field left empty (dropped); "" = intentional blank line.
    const message = [
      "Hello ElektrikZone, I’d like to open a trade account.",
      "",
      `Business: ${business}`,
      `Contact person: ${person}`,
      get("city") ? `City / area: ${get("city")}` : null,
      get("gst") ? `GSTIN: ${get("gst").toUpperCase()}` : null,
      volume ? `Buying: ${volume}` : null,
      interests.length ? `Interested in: ${interests.join(", ")}` : null,
      get("notes") ? `Notes: ${get("notes")}` : null,
      "",
      `Ref: EZ-${source.toUpperCase()}`,
    ]
      .filter((l): l is string => l !== null)
      .join("\n");

    const url = buildWhatsAppUrl(s.whatsappNumber, message);
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <form onSubmit={onSubmit} noValidate aria-labelledby={`${id}-title`} className="rounded-3xl border bg-surface/50 p-6 hairline sm:p-10">
      <h2 id={`${id}-title`} className="text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
        {t("con.form.title")}
      </h2>
      <p className="mt-3 max-w-xl text-sm text-muted">{t("con.form.sub")}</p>

      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <label className="block text-sm text-muted">
          {t("con.form.business")} <span aria-hidden="true">*</span>
          <input name="business" required autoComplete="organization" maxLength={120} className={field} aria-invalid={error || undefined} />
        </label>
        <label className="block text-sm text-muted">
          {t("con.form.person")} <span aria-hidden="true">*</span>
          <input name="person" required autoComplete="name" maxLength={80} className={field} aria-invalid={error || undefined} />
        </label>
        <label className="block text-sm text-muted">
          {t("con.form.city")}
          <input name="city" autoComplete="address-level2" maxLength={80} className={field} />
        </label>
        <label className="block text-sm text-muted">
          {t("con.form.gst")}
          <input name="gst" maxLength={20} autoCapitalize="characters" className={`${field} uppercase`} />
        </label>
        <label className="block text-sm text-muted sm:col-span-2">
          {t("con.form.volume")}
          <select name="volume" defaultValue="" className={field}>
            <option value="">—</option>
            {VOLUMES.map((v) => (
              <option key={v.key} value={v.key}>
                {t(v.key as TKey)}
              </option>
            ))}
          </select>
        </label>
        <fieldset className="sm:col-span-2">
          <legend className="text-sm text-muted">{t("con.form.interest")}</legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {INTERESTS.map((it) => (
              <label key={it.en} className="cursor-pointer">
                <input type="checkbox" name="interest" value={it.en} className="peer sr-only" />
                <span className="inline-flex min-h-[40px] items-center rounded-full border px-4 text-sm text-muted transition-colors hairline peer-checked:border-accent peer-checked:bg-accent/10 peer-checked:text-fg peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-amber">
                  {lang === "hi" ? it.hi : it.en}
                </span>
              </label>
            ))}
          </div>
        </fieldset>
        <label className="block text-sm text-muted sm:col-span-2">
          {t("con.form.notes")}
          <textarea name="notes" rows={3} maxLength={500} className={`${field} py-3`} />
        </label>
      </div>

      {error && (
        <p role="alert" className="mt-4 text-sm text-amber">
          {t("con.form.required")}
        </p>
      )}

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <button type="submit" className="btn-primary" aria-disabled={!s.whatsappNumber || undefined}>
          <WhatsAppIcon size={18} />
          {t("con.form.submit")}
        </button>
        {!s.whatsappNumber && <Placeholder label="WhatsApp number in Site settings" />}
      </div>
    </form>
  );
}
