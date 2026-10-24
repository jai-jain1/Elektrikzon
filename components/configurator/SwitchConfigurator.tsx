"use client";

import { useState } from "react";
import { CONFIGURATOR_FINISHES, CONFIGURATOR_MODULES, PLATE_SIZES, MAX_MODULES } from "@/data/configurator";
import type { TKey } from "@/data/translations";
import { fmt, useT } from "@/lib/i18n";
import { useLang } from "@/lib/prefs";
import { useQuote, MAX_QTY } from "@/lib/quote";
import { useUI } from "@/lib/ui";
import { describeModules, moduleById, newUid, PRESETS, usedSlots, type PlacedModule } from "@/lib/configurator";
import { PlatePreview } from "@/components/configurator/PlatePreview";
import { ArrowLeftIcon, ArrowRightIcon, CloseIcon, MinusIcon, PlusIcon } from "@/components/ui/icons";

const chip =
  "inline-flex min-h-[40px] items-center gap-2 rounded-full border px-4 text-sm transition-colors hairline hover:text-fg disabled:cursor-not-allowed disabled:opacity-40";

export function SwitchConfigurator() {
  const t = useT();
  const lang = useLang();
  const add = useQuote((s) => s.add);
  const showToast = useUI((u) => u.showToast);

  const [size, setSize] = useState(4);
  const [placed, setPlaced] = useState<PlacedModule[]>(() =>
    ["switch-1way", "switch-1way", "socket"].map((moduleId) => ({ uid: newUid(), moduleId })),
  );
  const [finishId, setFinishId] = useState(CONFIGURATOR_FINISHES[1].id);
  const [qty, setQty] = useState(1);

  const finish = CONFIGURATOR_FINISHES.find((f) => f.id === finishId) ?? CONFIGURATOR_FINISHES[0];
  const used = usedSlots(placed);
  const free = size - used;
  const label = (id: string) => {
    const m = moduleById(id);
    return m ? (lang === "hi" ? m.labelHi : m.label) : id;
  };
  const finishLabel = lang === "hi" ? finish.labelHi : finish.id;

  const changeSize = (n: number) => {
    setSize(n);
    // Drop modules from the end until they fit the smaller plate.
    setPlaced((prev) => {
      const next = [...prev];
      while (usedSlots(next) > n) next.pop();
      return next;
    });
  };

  const addModule = (moduleId: string) => {
    const m = moduleById(moduleId);
    if (!m || m.slots > free) return;
    setPlaced((prev) => [...prev, { uid: newUid(), moduleId }]);
  };

  const move = (i: number, dir: -1 | 1) =>
    setPlaced((prev) => {
      const j = i + dir;
      if (j < 0 || j >= prev.length) return prev;
      const next = [...prev];
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });

  const applyPreset = (key: string) => {
    const p = PRESETS.find((x) => x.key === key);
    if (!p) return;
    setSize(p.size);
    setPlaced(p.modules.map((moduleId) => ({ uid: newUid(), moduleId })));
  };

  const addToQuote = () => {
    const title = `Custom switch plate: ${size}-module, ${finish.id}`;
    const titleHi = `कस्टम स्विच प्लेट: ${size}-मॉड्यूल, ${finish.labelHi}`;
    add({
      kind: "config",
      title,
      titleHi,
      detail: `${describeModules(placed, size)}. Availability to confirm.`,
      qty,
    });
    showToast(t("quote.added"));
  };

  const description = fmt(t("cfg.alt"), {
    n: String(size),
    finish: finishLabel,
    list: placed.length ? placed.map((p) => label(p.moduleId)).join(", ") : t("cfg.nothing"),
  });

  return (
    <section id="configurator" aria-labelledby="cfg-title" className="relative scroll-mt-24 border-y bg-elev/30 py-20 hairline lg:py-28">
      <div className="container-site">
        <div className="max-w-2xl">
          <p className="eyebrow">{t("cfg.eyebrow")}</p>
          <h2 id="cfg-title" className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.02em] sm:text-5xl">
            {t("cfg.title")}
          </h2>
          <p className="mt-5 text-muted">{t("cfg.sub")}</p>
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
          {/* Preview */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <figure
              className="relative flex min-h-[260px] items-center justify-center overflow-hidden rounded-3xl border p-6 hairline sm:min-h-[340px] sm:p-12"
              style={{ background: "radial-gradient(ellipse at 50% 30%, rgb(var(--surface)), rgb(var(--bg)) 75%)" }}
            >
              <div className="w-full" style={{ maxWidth: `${Math.min(100, 30 + size * 12)}%`, transition: "max-width 400ms" }}>
                <PlatePreview size={size} placed={placed} finish={finish} />
              </div>
              <figcaption className="sr-only" aria-live="polite">
                {description}
              </figcaption>
            </figure>
            <p className="mt-4 text-xs text-muted">{t("cfg.blankFill")}</p>
          </div>

          {/* Controls */}
          <div className="space-y-8">
            <fieldset>
              <legend className="eyebrow mb-3 font-sans">{t("cfg.presets")}</legend>
              <div className="flex flex-wrap gap-2">
                {PRESETS.map((p) => (
                  <button key={p.key} type="button" onClick={() => applyPreset(p.key)} className={`${chip} text-muted`}>
                    {t(`cfg.preset.${p.key}` as TKey)}
                    <span className="text-xs text-muted">{fmt(t("cfg.sizeN"), { n: String(p.size) })}</span>
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset>
              <legend className="eyebrow mb-3 font-sans">{t("cfg.size")}</legend>
              <div className="flex flex-wrap gap-2">
                {PLATE_SIZES.map((n) => (
                  <label key={n} className="cursor-pointer">
                    <input type="radio" name="cfg-size" value={n} checked={size === n} onChange={() => changeSize(n)} className="peer sr-only" />
                    <span className="inline-flex h-11 min-w-11 items-center justify-center rounded-full border px-3 text-sm tabular-nums text-muted transition-colors hairline peer-checked:border-accent peer-checked:bg-accent/10 peer-checked:text-fg peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-amber">
                      {n}M
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div>
              <div className="mb-3 flex items-baseline justify-between gap-4">
                <h3 className="eyebrow font-sans">{t("cfg.modules")}</h3>
                <p className="text-xs text-muted" aria-live="polite">
                  {free > 0 ? fmt(t("cfg.free"), { n: String(free), total: String(size) }) : t("cfg.full")}
                </p>
              </div>
              <ul className="flex flex-wrap gap-2">
                {CONFIGURATOR_MODULES.filter((m) => m.id !== "blank").map((m) => (
                  <li key={m.id}>
                    <button type="button" onClick={() => addModule(m.id)} disabled={m.slots > free} className={`${chip} text-muted`}>
                      <PlusIcon size={14} />
                      {lang === "hi" ? m.labelHi : m.label}
                      {m.slots === 2 && <span className="text-[0.7rem] text-muted">· {t("cfg.slots2")}</span>}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <div className="mb-3 flex items-baseline justify-between">
                <h3 className="eyebrow font-sans">{t("cfg.your")}</h3>
                {placed.length > 0 && (
                  <button type="button" onClick={() => setPlaced([])} className="text-xs text-muted underline-offset-4 hover:text-fg hover:underline">
                    {t("cfg.clear")}
                  </button>
                )}
              </div>
              {placed.length === 0 ? (
                <p className="text-sm text-muted">{t("cfg.empty")}</p>
              ) : (
                <ol className="divide-y rounded-2xl border hairline [&>li]:hairline">
                  {placed.map((p, i) => {
                    const name = label(p.moduleId);
                    return (
                      <li key={p.uid} className="flex items-center gap-2 py-1.5 pl-4 pr-1.5">
                        <span className="text-xs tabular-nums text-electric">{String(i + 1).padStart(2, "0")}</span>
                        <span className="flex-1 text-sm">{name}</span>
                        <button type="button" className="icon-btn h-9 w-9" onClick={() => move(i, -1)} disabled={i === 0} aria-label={fmt(t("cfg.left"), { name })}>
                          <ArrowLeftIcon size={15} />
                        </button>
                        <button
                          type="button"
                          className="icon-btn h-9 w-9"
                          onClick={() => move(i, 1)}
                          disabled={i === placed.length - 1}
                          aria-label={fmt(t("cfg.right"), { name })}
                        >
                          <ArrowRightIcon size={15} />
                        </button>
                        <button
                          type="button"
                          className="icon-btn h-9 w-9"
                          onClick={() => setPlaced((prev) => prev.filter((x) => x.uid !== p.uid))}
                          aria-label={fmt(t("cfg.remove"), { name })}
                        >
                          <CloseIcon size={15} />
                        </button>
                      </li>
                    );
                  })}
                </ol>
              )}
            </div>

            <fieldset>
              <legend className="eyebrow mb-3 font-sans">
                {t("cfg.finish")}: <span className="text-fg">{finishLabel}</span>
              </legend>
              <div className="flex flex-wrap gap-2.5">
                {CONFIGURATOR_FINISHES.map((f) => (
                  <label key={f.id} className="cursor-pointer" title={lang === "hi" ? f.labelHi : f.id}>
                    <input type="radio" name="cfg-finish" value={f.id} checked={finishId === f.id} onChange={() => setFinishId(f.id)} className="peer sr-only" />
                    <span className="sr-only">{lang === "hi" ? f.labelHi : f.id}</span>
                    <span
                      aria-hidden="true"
                      className="block h-10 w-10 rounded-full border-2 border-transparent p-[3px] peer-checked:border-accent peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-amber"
                    >
                      <span
                        className="block h-full w-full rounded-full"
                        style={{
                          background: f.metalness > 0.5 ? `linear-gradient(135deg, #fff8, ${f.plate} 45%, #0004)` : f.plate,
                          boxShadow: "inset 0 0 0 1px rgb(var(--line) / 0.2)",
                        }}
                      />
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="flex flex-wrap items-center gap-3 border-t pt-6 hairline">
              <div className="flex items-center rounded-full border hairline" role="group" aria-label={t("cfg.qty")}>
                <button type="button" className="icon-btn h-11 w-11" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1} aria-label={t("quote.decrease")}>
                  <MinusIcon size={16} />
                </button>
                <span className="w-10 text-center text-sm tabular-nums" aria-live="polite">
                  {qty}
                </span>
                <button type="button" className="icon-btn h-11 w-11" onClick={() => setQty((q) => Math.min(MAX_QTY, q + 1))} aria-label={t("quote.increase")}>
                  <PlusIcon size={16} />
                </button>
              </div>
              <button type="button" onClick={addToQuote} className="btn-primary flex-1" disabled={size > MAX_MODULES}>
                <PlusIcon size={16} />
                {t("cfg.add")}
              </button>
            </div>
            <p className="text-xs text-muted">{t("cfg.availability")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
