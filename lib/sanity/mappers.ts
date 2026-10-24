import { FINISHES, USES, type Brand, type Category, type Finish, type Product, type Reel, type Subcategory, type Use } from "@/types/catalog";
import type { SanityBrand, SanityCategory, SanityProduct, SanityReel, SanitySubcategory } from "./types";
import { toSiteImage } from "./image";

// Sanity results -> site types. Anything incomplete is dropped rather than
// shown half-broken. Nothing is invented: missing values stay missing.

const nonEmpty = (s: string | undefined | null): s is string => typeof s === "string" && s.trim().length > 0;

export function mapCategory(c: SanityCategory): Category | null {
  if (!nonEmpty(c.title) || !nonEmpty(c.slug)) return null;
  return {
    id: c.id,
    slug: c.slug,
    title: c.title,
    titleHi: c.titleHi || undefined,
    description: c.description || undefined,
    descriptionHi: c.descriptionHi || undefined,
    displayStyle: c.displayStyle ?? "standard",
    coverImage: toSiteImage(c.coverImage, c.title) ?? undefined,
    order: c.order ?? 100,
  };
}

export function mapSubcategory(s: SanitySubcategory): Subcategory | null {
  if (!nonEmpty(s.title) || !nonEmpty(s.slug) || !nonEmpty(s.categorySlug)) return null;
  return { id: s.id, slug: s.slug, title: s.title, titleHi: s.titleHi || undefined, categorySlug: s.categorySlug, order: s.order ?? 100 };
}

export function mapBrand(b: SanityBrand): Brand | null {
  if (!nonEmpty(b.name) || !nonEmpty(b.slug)) return null;
  return { id: b.id, slug: b.slug, name: b.name };
}

export function mapProduct(p: SanityProduct): Product | null {
  if (!nonEmpty(p.id) || !nonEmpty(p.name) || !p.category || !nonEmpty(p.category.slug) || !nonEmpty(p.category.title)) {
    return null;
  }
  const name = p.name;
  return {
    id: p.id,
    name,
    nameHi: p.nameHi || undefined,
    category: { slug: p.category.slug, title: p.category.title, titleHi: p.category.titleHi || undefined },
    subcategory:
      p.subcategory && nonEmpty(p.subcategory.slug) && nonEmpty(p.subcategory.title)
        ? { slug: p.subcategory.slug, title: p.subcategory.title, titleHi: p.subcategory.titleHi || undefined }
        : undefined,
    brand: p.brand && nonEmpty(p.brand.name) ? { name: p.brand.name, slug: p.brand.slug || "" } : undefined,
    finishes: (p.finishes ?? []).filter((f): f is Finish => (FINISHES as readonly string[]).includes(f)),
    use: (p.use ?? []).filter((u): u is Use => (USES as readonly string[]).includes(u)),
    specs: (p.specs ?? [])
      .filter((s) => nonEmpty(s.label) && nonEmpty(s.value))
      .map((s) => ({ label: s.label!.trim(), value: s.value!.trim() })),
    description: p.description || undefined,
    descriptionHi: p.descriptionHi || undefined,
    images: (p.images ?? [])
      .map((img, i) => toSiteImage(img, i === 0 ? name : `${name}, photo ${i + 1}`))
      .filter((img): img is NonNullable<typeof img> => img !== null),
    mrp: typeof p.mrp === "number" && p.mrp > 0 ? p.mrp : undefined,
    featured: p.featured === true,
    // Treat anything not explicitly switched off as a sample.
    sample: p.sample !== false,
    inStockNote: p.inStockNote || undefined,
  };
}

export function mapReel(r: SanityReel): Reel | null {
  const cover = toSiteImage(r.cover, r.title || "Instagram reel");
  if (!nonEmpty(r.title) || !nonEmpty(r.postUrl) || !cover) return null;
  return {
    id: r.id,
    title: r.title,
    caption: r.caption || undefined,
    postUrl: r.postUrl,
    cover,
    productIds: (r.productIds ?? []).filter(nonEmpty),
    order: r.order ?? 100,
  };
}

export function mapAll<T, U>(items: T[] | null | undefined, fn: (item: T) => U | null): U[] {
  return (items ?? []).map(fn).filter((x): x is U => x !== null);
}
