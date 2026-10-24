// Site-level shapes used by every UI component. Sanity results are mapped
// into these (Stage 2), so components never know where the data came from.

export type Lang = "en" | "hi";

export type DisplayStyle = "editorial" | "technical" | "standard";

export const FINISHES = [
  "Matte White",
  "Charcoal",
  "Champagne Gold",
  "Walnut",
  "Black",
  "Silver",
  "Other",
] as const;
export type Finish = (typeof FINISHES)[number];

export const USES = [
  "Living room",
  "Bedroom",
  "Kitchen",
  "Bathroom",
  "Office",
  "Outdoor",
  "Commercial",
  "Industrial",
] as const;
export type Use = (typeof USES)[number];

export interface SiteImage {
  url: string;
  alt: string;
  width?: number;
  height?: number;
  /** Low-quality base64 placeholder from Sanity asset metadata. */
  lqip?: string;
}

export interface CategoryRef {
  slug: string;
  title: string;
  titleHi?: string;
}

export interface Category extends CategoryRef {
  id: string;
  description?: string;
  descriptionHi?: string;
  displayStyle: DisplayStyle;
  coverImage?: SiteImage;
  order: number;
}

export interface Subcategory {
  id: string;
  slug: string;
  title: string;
  titleHi?: string;
  categorySlug: string;
  order: number;
}

export interface Brand {
  id: string;
  slug: string;
  /** Plain text only. Brands never carry logos on this site. */
  name: string;
}

export interface Spec {
  label: string;
  value: string;
}

export interface Product {
  /** Stable id used in URLs and WhatsApp messages (Sanity productId slug). */
  id: string;
  name: string;
  nameHi?: string;
  category: CategoryRef;
  subcategory?: { slug: string; title: string; titleHi?: string };
  brand?: { slug: string; name: string };
  finishes: Finish[];
  use: Use[];
  specs: Spec[];
  description?: string;
  descriptionHi?: string;
  /** First image is the main one. Empty array shows "Photo coming soon". */
  images: SiteImage[];
  /** Only shown when present. Prices are never displayed otherwise. */
  mrp?: number;
  featured: boolean;
  /** Sample listings carry a visible "Sample listing" tag. */
  sample: boolean;
  /** Never a stock promise, e.g. "Check availability on WhatsApp". */
  inStockNote?: string;
}

export interface Reel {
  id: string;
  title: string;
  caption?: string;
  postUrl: string;
  cover: SiteImage;
  productIds: string[];
  order: number;
}
