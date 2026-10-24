import type { Product } from "@/types/catalog";

export interface FilterState {
  q: string;
  category: string;
  subcategory: string;
  brand: string;
  finish: string;
  use: string;
}

export const EMPTY_FILTERS: FilterState = { q: "", category: "", subcategory: "", brand: "", finish: "", use: "" };

export const FILTER_KEYS = ["category", "subcategory", "brand", "finish", "use"] as const;
export type FacetKey = (typeof FILTER_KEYS)[number];

const norm = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "");

/** Searchable text: names (EN + HI), brand, category, subcategory and spec values. */
function haystack(p: Product): string {
  return norm(
    [
      p.name,
      p.nameHi,
      p.brand?.name,
      p.category.title,
      p.category.titleHi,
      p.subcategory?.title,
      p.subcategory?.titleHi,
      p.id,
      ...p.specs.map((s) => s.value),
      ...p.finishes,
    ]
      .filter(Boolean)
      .join(" "),
  );
}

const cache = new WeakMap<Product, string>();
const text = (p: Product) => {
  let h = cache.get(p);
  if (!h) {
    h = haystack(p);
    cache.set(p, h);
  }
  return h;
};

function matchesFacet(p: Product, key: FacetKey, value: string): boolean {
  if (!value) return true;
  switch (key) {
    case "category":
      return p.category.slug === value;
    case "subcategory":
      return p.subcategory?.slug === value;
    case "brand":
      return p.brand?.slug === value || p.brand?.name === value;
    case "finish":
      return (p.finishes as string[]).includes(value);
    case "use":
      return (p.use as string[]).includes(value);
  }
}

/** All search words must match (AND); facets narrow further. */
export function filterProducts(products: Product[], f: FilterState, ignore?: FacetKey): Product[] {
  const words = norm(f.q).split(/\s+/).filter(Boolean);
  return products.filter((p) => {
    for (const key of FILTER_KEYS) {
      if (key !== ignore && !matchesFacet(p, key, f[key])) return false;
    }
    if (!words.length) return true;
    const h = text(p);
    return words.every((w) => h.includes(w));
  });
}

/** Count per facet value, computed with that facet itself ignored (so options stay visible). */
export function facetCounts(products: Product[], f: FilterState, key: FacetKey, valueOf: (p: Product) => string[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const p of filterProducts(products, f, key)) {
    for (const v of valueOf(p)) counts.set(v, (counts.get(v) ?? 0) + 1);
  }
  return counts;
}
