"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Brand, Category, Product, Subcategory } from "@/types/catalog";
import { FINISHES, USES } from "@/types/catalog";
import { EMPTY_FILTERS, facetCounts, filterProducts, FILTER_KEYS, type FacetKey, type FilterState } from "@/lib/filter";
import { fmt, useT } from "@/lib/i18n";
import { useLang } from "@/lib/prefs";
import { localized } from "@/lib/localize";
import { ProductCard } from "@/components/product/ProductCard";
import { QuickView } from "@/components/product/QuickView";
import { CloseIcon, FilterIcon, SearchIcon } from "@/components/ui/icons";

const PAGE = 24;

interface Props {
  products: Product[];
  categories: Category[];
  subcategories: Subcategory[];
  brands: Brand[];
}

interface Option {
  value: string;
  label: string;
}

/** Read filters from the URL (?category=lighting&q=dimmer) so links are shareable. */
function readUrl(): FilterState {
  try {
    const p = new URLSearchParams(window.location.search);
    return {
      q: p.get("q") ?? "",
      category: p.get("category") ?? "",
      subcategory: p.get("subcategory") ?? "",
      brand: p.get("brand") ?? "",
      finish: p.get("finish") ?? "",
      use: p.get("use") ?? "",
    };
  } catch {
    return EMPTY_FILTERS;
  }
}

function writeUrl(f: FilterState) {
  try {
    const p = new URLSearchParams();
    (Object.keys(f) as (keyof FilterState)[]).forEach((k) => f[k] && p.set(k, f[k]));
    const qs = p.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${qs ? `?${qs}` : ""}`);
  } catch {
    /* ignore */
  }
}

export function Catalogue({ products, categories, subcategories, brands }: Props) {
  const t = useT();
  const lang = useLang();
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS);
  const [limit, setLimit] = useState(PAGE);
  const [panelOpen, setPanelOpen] = useState(false);
  const [quick, setQuick] = useState<Product | null>(null);
  const closeQuick = useCallback(() => setQuick(null), []);

  useEffect(() => setFilters(readUrl()), []);

  const update = useCallback((patch: Partial<FilterState>) => {
    setFilters((prev) => {
      const next = { ...prev, ...patch };
      // A subcategory only makes sense inside its category.
      if (patch.category !== undefined && patch.category !== prev.category) next.subcategory = "";
      writeUrl(next);
      return next;
    });
    setLimit(PAGE);
  }, []);

  const clearAll = () => update({ ...EMPTY_FILTERS });

  const results = useMemo(() => filterProducts(products, filters), [products, filters]);
  const activeCount = FILTER_KEYS.filter((k) => filters[k]).length;

  // Facet options with live counts; only values that exist in the catalogue.
  const facets = useMemo(() => {
    const count = (key: FacetKey, valueOf: (p: Product) => string[]) => facetCounts(products, filters, key, valueOf);

    const catCounts = count("category", (p) => [p.category.slug]);
    const category: Option[] = categories
      .filter((c) => products.some((p) => p.category.slug === c.slug))
      .map((c) => ({ value: c.slug, label: `${localized(lang, c.title, c.titleHi)} (${catCounts.get(c.slug) ?? 0})` }));

    const subCounts = count("subcategory", (p) => (p.subcategory ? [p.subcategory.slug] : []));
    const subcategory: Option[] = subcategories
      .filter((s) => (!filters.category || s.categorySlug === filters.category) && subCounts.has(s.slug))
      .map((s) => ({ value: s.slug, label: `${localized(lang, s.title, s.titleHi)} (${subCounts.get(s.slug)})` }));

    const brandCounts = count("brand", (p) => (p.brand ? [p.brand.slug || p.brand.name] : []));
    const brandNames = new Map(brands.map((b) => [b.slug, b.name]));
    products.forEach((p) => p.brand && brandNames.set(p.brand.slug || p.brand.name, p.brand.name));
    const brand: Option[] = Array.from(brandNames.entries())
      .filter(([slug]) => brandCounts.has(slug))
      .map(([slug, name]) => ({ value: slug, label: `${name} (${brandCounts.get(slug)})` }));

    const finishCounts = count("finish", (p) => p.finishes);
    const finish: Option[] = FINISHES.filter((f) => finishCounts.has(f)).map((f) => ({ value: f, label: `${f} (${finishCounts.get(f)})` }));

    const useCounts = count("use", (p) => p.use);
    const use: Option[] = USES.filter((u) => useCounts.has(u)).map((u) => ({ value: u, label: `${u} (${useCounts.get(u)})` }));

    return { category, subcategory, brand, finish, use };
  }, [products, categories, subcategories, brands, filters, lang]);

  const hasSamples = results.some((p) => p.sample);
  const shown = results.slice(0, limit);

  const groups: { key: FacetKey; label: string; options: Option[] }[] = [
    { key: "category", label: t("cat.category"), options: facets.category },
    { key: "subcategory", label: t("cat.subcategory"), options: facets.subcategory },
    { key: "brand", label: t("cat.brand"), options: facets.brand },
    { key: "finish", label: t("cat.finish"), options: facets.finish },
    { key: "use", label: t("cat.use"), options: facets.use },
  ];

  const filterPanel = (
    <div className="space-y-7">
      {groups
        .filter((g) => g.options.length > 0)
        .map((g) => (
          <fieldset key={g.key}>
            <legend className="eyebrow mb-3 font-sans">{g.label}</legend>
            <div className="flex flex-wrap gap-2">
              {[{ value: "", label: t("cat.all") }, ...g.options].map((o) => (
                <label key={o.value || "all"} className="cursor-pointer">
                  <input
                    type="radio"
                    name={`f-${g.key}`}
                    value={o.value}
                    checked={filters[g.key] === o.value}
                    onChange={() => update({ [g.key]: o.value } as Partial<FilterState>)}
                    className="peer sr-only"
                  />
                  <span className="inline-flex min-h-[36px] items-center rounded-full border px-3.5 text-xs text-muted transition-colors hairline hover:text-fg peer-checked:border-accent peer-checked:bg-accent/10 peer-checked:text-fg peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-amber">
                    {o.label}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      {activeCount > 0 && (
        <button type="button" onClick={clearAll} className="text-sm text-electric underline-offset-4 hover:underline">
          {t("cat.clear")}
        </button>
      )}
    </div>
  );

  return (
    <div className="container-site pb-16">
      {/* Search + mobile filter toggle */}
      <div className="sticky top-14 z-30 -mx-4 flex gap-2 border-b bg-bg/85 px-4 py-3 backdrop-blur-xl hairline sm:-mx-6 sm:px-6 lg:top-12 lg:-mx-10 lg:px-10">
        <label className="relative flex-1">
          <span className="sr-only">{t("cat.searchLabel")}</span>
          <SearchIcon size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={filters.q}
            onChange={(e) => update({ q: e.target.value })}
            placeholder={t("cat.search")}
            className="min-h-[44px] w-full rounded-full border bg-surface/70 pl-11 pr-4 text-sm text-fg placeholder:text-muted/80 hairline"
          />
        </label>
        <button
          type="button"
          onClick={() => setPanelOpen((v) => !v)}
          aria-expanded={panelOpen}
          aria-controls="catalogue-filters"
          aria-label={activeCount ? `${t("cat.filters")} (${activeCount})` : t("cat.filters")}
          className="btn-ghost shrink-0 px-4 lg:hidden"
        >
          <FilterIcon size={18} />
          <span className="hidden min-[400px]:inline">{t("cat.filters")}</span>
          {activeCount > 0 && <span className="rounded-full bg-accent px-1.5 text-[0.65rem] font-semibold text-on-accent">{activeCount}</span>}
        </button>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[17rem_1fr]">
        <aside id="catalogue-filters" aria-label={t("cat.filters")} className={`${panelOpen ? "block" : "hidden"} lg:block`}>
          <div className="lg:sticky lg:top-40">
            <div className="mb-4 flex items-center justify-between lg:hidden">
              <p className="text-sm font-medium">{t("cat.filters")}</p>
              <button type="button" className="icon-btn" onClick={() => setPanelOpen(false)} aria-label={t("product.close")}>
                <CloseIcon size={18} />
              </button>
            </div>
            {filterPanel}
          </div>
        </aside>

        <div>
          <p className="mb-5 text-sm text-muted" aria-live="polite">
            {results.length === 1 ? t("cat.result1") : fmt(t("cat.results"), { n: String(results.length) })}
          </p>

          {results.length === 0 ? (
            <div className="rounded-2xl border border-dashed p-10 text-center hairline">
              <p className="text-muted">{t("cat.none")}</p>
              <button type="button" onClick={clearAll} className="btn-ghost mt-5">
                {t("cat.clear")}
              </button>
            </div>
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 xl:grid-cols-4">
              {shown.map((p, i) => (
                <li key={p.id}>
                  <ProductCard product={p} onQuickView={setQuick} priority={i < 4} />
                </li>
              ))}
            </ul>
          )}

          {results.length > limit && (
            <div className="mt-10 text-center">
              <button type="button" onClick={() => setLimit((l) => l + PAGE)} className="btn-ghost">
                {fmt(t("cat.loadMore"), { n: String(results.length - limit) })}
              </button>
            </div>
          )}

          {hasSamples && <p className="mt-10 max-w-2xl text-xs leading-relaxed text-muted">{t("cat.sampleNote")}</p>}
        </div>
      </div>

      <QuickView product={quick} onClose={closeQuick} />
    </div>
  );
}
