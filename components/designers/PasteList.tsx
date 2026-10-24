"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { fmt, useT } from "@/lib/i18n";
import { useUI } from "@/lib/ui";
import { copyText } from "@/lib/clipboard";
import { getSourceToken } from "@/lib/source";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { useSettings } from "@/components/providers/Providers";
import { Placeholder } from "@/components/ui/Placeholder";
import { CopyIcon, WhatsAppIcon } from "@/components/ui/icons";

/** “Paste your product list”: turns pasted lines into a numbered WhatsApp message. */
export function PasteList() {
  const t = useT();
  const s = useSettings();
  const showToast = useUI((u) => u.showToast);
  const id = useId();
  const [project, setProject] = useState("");
  const [text, setText] = useState("");
  const [source, setSource] = useState("web");

  useEffect(() => setSource(getSourceToken()), []);

  const lines = useMemo(
    () =>
      text
        .split(/\r?\n/)
        // Spreadsheet pastes arrive tab-separated: keep the columns readable.
        .map((l) => l.replace(/\t+/g, " – ").trim())
        .filter(Boolean)
        .slice(0, 200),
    [text],
  );

  const message = [
    "Hello ElektrikZone, please quote this designer product list:",
    project.trim() ? `Project: ${project.trim()}` : "",
    "",
    ...lines.map((l, i) => `${i + 1}. ${l}`),
    "",
    "Please share trade prices and availability.",
    `Ref: EZ-${source.toUpperCase()}`,
  ]
    .filter((l, i, arr) => !(l === "" && arr[i - 1] === ""))
    .join("\n");

  const href = lines.length ? buildWhatsAppUrl(s.whatsappNumber, message) : null;

  return (
    <section aria-labelledby={`${id}-title`} className="rounded-3xl border bg-surface/50 p-6 hairline sm:p-10">
      <h2 id={`${id}-title`} className="text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
        {t("des.paste.title")}
      </h2>
      <p className="mt-3 max-w-xl text-muted">{t("des.paste.sub")}</p>

      <div className="mt-8 grid gap-5">
        <label className="block text-sm text-muted">
          {t("des.paste.project")}
          <input
            value={project}
            onChange={(e) => setProject(e.target.value)}
            maxLength={120}
            className="mt-2 block min-h-[48px] w-full rounded-xl border bg-bg px-4 text-fg hairline"
          />
        </label>
        <label className="block text-sm text-muted">
          <span className="flex justify-between">
            {t("des.paste.list")}
            <span className="tabular-nums" aria-live="polite">
              {fmt(t("des.paste.lines"), { n: String(lines.length) })}
            </span>
          </span>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={10}
            placeholder={t("des.paste.placeholder")}
            className="mt-2 block w-full rounded-xl border bg-bg p-4 font-mono text-sm leading-relaxed text-fg placeholder:text-muted/60 hairline"
          />
        </label>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className="btn-primary">
            <WhatsAppIcon size={18} />
            {t("des.paste.send")}
          </a>
        ) : (
          <span role="link" aria-disabled="true" className="btn-primary">
            <WhatsAppIcon size={18} />
            {t("des.paste.send")}
          </span>
        )}
        <button
          type="button"
          className="btn-ghost"
          disabled={!lines.length}
          onClick={async () => {
            if (await copyText(message)) showToast(t("quote.copied"));
          }}
        >
          <CopyIcon size={16} />
          {t("quote.copy")}
        </button>
      </div>
      {!lines.length && <p className="mt-3 text-xs text-muted">{t("des.paste.empty")}</p>}
      {lines.length > 0 && !s.whatsappNumber && (
        <p className="mt-3">
          <Placeholder label="WhatsApp number in Site settings" />
        </p>
      )}
    </section>
  );
}
