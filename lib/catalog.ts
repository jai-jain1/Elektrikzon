import { cache } from "react";
import type { Brand, Category, Product, Reel, Subcategory } from "@/types/catalog";
import { FALLBACK_CATEGORIES, FALLBACK_PRODUCTS, FALLBACK_SUBCATEGORIES } from "@/data/fallback-products";
import { sanityFetch, warnOnce } from "@/lib/sanity/fetch";
import {
  brandsQuery,
  categoriesQuery,
  productBySlugQuery,
  productsQuery,
  productSlugsQuery,
  reelsQuery,
  subcategoriesQuery,
} from "@/lib/sanity/queries";
import { mapAll, mapBrand, mapCategory, mapProduct, mapReel, mapSubcategory } from "@/lib/sanity/mappers";
import type { SanityBrand, SanityCategory, SanityProduct, SanityReel, SanitySubcategory } from "@/lib/sanity/types";

// Server-side catalogue access. UI components only ever see site types.
// When Sanity is empty or unreachable, the fallback catalogue is used so
// the site always builds and renders.

export const getCategories = cache(async (): Promise<Category[]> => {
  const raw = await sanityFetch<SanityCategory[]>(categoriesQuery, {}, ["category"]);
  const items = mapAll(raw, mapCategory);
  if (items.length) return items;
  if (raw) warnOnce("empty-categories", "No categories in Sanity yet; showing the fallback categories.");
  return FALLBACK_CATEGORIES;
});

export const getSubcategories = cache(async (): Promise<Subcategory[]> => {
  const raw = await sanityFetch<SanitySubcategory[]>(subcategoriesQuery, {}, ["subcategory"]);
  const items = mapAll(raw, mapSubcategory);
  return items.length ? items : FALLBACK_SUBCATEGORIES;
});

/** Brands are never invented: with no Sanity brands the list is empty. */
export const getBrands = cache(async (): Promise<Brand[]> => {
  const raw = await sanityFetch<SanityBrand[]>(brandsQuery, {}, ["brand"]);
  return mapAll(raw, mapBrand);
});

export const getProducts = cache(async (): Promise<Product[]> => {
  const raw = await sanityFetch<SanityProduct[]>(productsQuery, {}, ["product"]);
  const items = mapAll(raw, mapProduct);
  if (items.length) return items;
  if (raw) warnOnce("empty-products", "No published products in Sanity yet; showing the 12 fallback sample products.");
  return FALLBACK_PRODUCTS;
});

export const getProduct = cache(async (slug: string): Promise<Product | null> => {
  const raw = await sanityFetch<SanityProduct | null>(productBySlugQuery, { slug }, ["product"]);
  const fromSanity = raw ? mapProduct(raw) : null;
  if (fromSanity) return fromSanity;
  // Fall back only when the fallback list is what the catalogue is showing.
  const all = await getProducts();
  return all.find((p) => p.id === slug) ?? null;
});

export const getProductSlugs = cache(async (): Promise<string[]> => {
  const raw = await sanityFetch<string[]>(productSlugsQuery, {}, ["product"]);
  if (raw && raw.length) return raw;
  return (await getProducts()).map((p) => p.id);
});

/** Empty array hides the Reels Wall. */
export const getReels = cache(async (): Promise<Reel[]> => {
  const raw = await sanityFetch<SanityReel[]>(reelsQuery, {}, ["reel"]);
  return mapAll(raw, mapReel);
});
