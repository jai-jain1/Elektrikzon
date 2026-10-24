import { cache } from "react";
import type { Brand, Campaign, Category, Product, Reel, Subcategory } from "@/types/catalog";
import { FALLBACK_CATEGORIES, FALLBACK_PRODUCTS, FALLBACK_SUBCATEGORIES } from "@/data/fallback-products";
import { sanityFetch, warnOnce } from "@/lib/sanity/fetch";
import {
  activeCampaignsQuery,
  brandsQuery,
  campaignBySlugQuery,
  campaignSlugsQuery,
  categoriesQuery,
  productBySlugQuery,
  productsQuery,
  productSlugsQuery,
  reelsQuery,
  subcategoriesQuery,
} from "@/lib/sanity/queries";
import { mapAll, mapBrand, mapCampaign, mapCategory, mapProduct, mapReel, mapSubcategory } from "@/lib/sanity/mappers";
import type { SanityBrand, SanityCampaign, SanityCategory, SanityProduct, SanityReel, SanitySubcategory } from "@/lib/sanity/types";

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

/* ------------------------------ campaigns ------------------------------ */

/** Campaigns running right now (between their start and end). */
export const getActiveCampaigns = cache(async (): Promise<Campaign[]> => {
  const raw = await sanityFetch<SanityCampaign[]>(activeCampaignsQuery, {}, ["campaign"]);
  return mapAll(raw, mapCampaign);
});

/** One campaign by web address, whether running or ended. */
export const getCampaign = cache(async (slug: string): Promise<Campaign | null> => {
  const raw = await sanityFetch<SanityCampaign | null>(campaignBySlugQuery, { slug }, ["campaign"]);
  return raw ? mapCampaign(raw) : null;
});

export const getCampaignSlugs = cache(async (): Promise<string[]> => {
  return (await sanityFetch<string[]>(campaignSlugsQuery, {}, ["campaign"])) ?? [];
});

/** Attach the first running campaign that lists each product (offer price wins). */
function applyOffers(products: Product[], campaigns: Campaign[]): Product[] {
  if (!campaigns.length) return products;
  return products.map((p) => {
    for (const c of campaigns) {
      const item = c.items.find((i) => i.productId === p.id);
      if (item) {
        return {
          ...p,
          offer: {
            campaignSlug: c.slug,
            campaignTitle: c.title,
            campaignTitleHi: c.titleHi,
            price: item.offerPrice,
            badge: item.badge,
            endsAt: c.endsAt,
          },
        };
      }
    }
    return p;
  });
}

/* ------------------------------ products ------------------------------ */

const getBaseProducts = cache(async (): Promise<Product[]> => {
  const raw = await sanityFetch<SanityProduct[]>(productsQuery, {}, ["product"]);
  const items = mapAll(raw, mapProduct);
  if (items.length) return items;
  if (raw) warnOnce("empty-products", "No published products in Sanity yet; showing the 12 fallback sample products.");
  return FALLBACK_PRODUCTS;
});

/** All products, with running campaign offers applied. */
export const getProducts = cache(async (): Promise<Product[]> => {
  const [products, campaigns] = await Promise.all([getBaseProducts(), getActiveCampaigns()]);
  return applyOffers(products, campaigns);
});

export const getProduct = cache(async (slug: string): Promise<Product | null> => {
  const [raw, campaigns] = await Promise.all([
    sanityFetch<SanityProduct | null>(productBySlugQuery, { slug }, ["product"]),
    getActiveCampaigns(),
  ]);
  const fromSanity = raw ? mapProduct(raw) : null;
  if (fromSanity) return applyOffers([fromSanity], campaigns)[0];
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
