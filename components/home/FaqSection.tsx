"use client";

import { fillFaq } from "@/data/faq";
import { useT } from "@/lib/i18n";
import { useLang } from "@/lib/prefs";
import { useSettings } from "@/components/providers/Providers";
import { PlusIcon } from "@/components/ui/icons";

/** Placeholder-aware rendering: [ADD: …] parts get the placeholder style. */
function Answer({ text }: { text: string }) {
  const parts = text.split(/(\[ADD: [^\]]+\])/g);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("[ADD:") ? (
          <span key={i} className="ez-placeholder">
            {p}
          </span>
        ) : (
          <span key={i}>{p}</span>
        ),
      )}
    </>
  );
}

export function FaqSection() {
  const t = useT();
  const lang = useLang();
  const s = useSettings();
  const items = fillFaq(s, lang);

  return (
    <section id="faq" aria-labelledby="faq-title" className="container-site scroll-mt-24 py-20 lg:py-28">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.8fr]">
        <div>
          <p className="eyebrow">{t("faq.eyebrow")}</p>
          <h2 id="faq-title" className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.02em] sm:text-5xl">
            {t("faq.title")}
          </h2>
        </div>
        <div className="border-t hairline">
          {items.map((f) => (
            <details key={f.id} className="group border-b hairline">
              <summary className="flex min-h-[64px] cursor-pointer list-none items-center justify-between gap-6 py-4 text-lg leading-snug [&::-webkit-details-marker]:hidden">
                <span>{f.question}</span>
                <PlusIcon size={18} className="shrink-0 text-electric transition-transform duration-300 group-open:rotate-45" />
              </summary>
              <p className="pb-6 pr-10 text-sm leading-relaxed text-muted">
                <Answer text={f.answer} />
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
