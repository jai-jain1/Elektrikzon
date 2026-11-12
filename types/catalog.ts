// Site-level shapes used by every UI component. Sanity results are mapped
// into these (Stage 2), so components never know where the data came from.

export type Lang = "en" | "hi";

/** The colour of the light itself. “3-in-1” fittings switch between the three whites. */
export const LIGHT_COLOURS = ["Warm white", "Neutral white", "Cool white", "3-in-1", "RGB"] as const;
export type LightColour = (typeof LIGHT_COLOURS)[number];

/** The colour of the fitting’s body or trim. */
export const BODY_COLOURS = ["White", "Black", "Grey", "Silver", "Gold", "Other"] as const;
export type BodyColour = (typeof BODY_COLOURS)[number];

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
  /** Power in watts, when the listing is for one wattage. */
  wattage?: number;
  lightColours: LightColour[];
  bodyColours: BodyColour[];
  use: Use[];
  specs: Spec[];
  description?: string;
  descriptionHi?: string;
  /** First image is the main one. Empty array shows "Photo coming soon". */
  images: SiteImage[];
  /** Only shown when present. */
  mrp?: number;
  /** Selling price for online orders. Empty = “Request trade price”. */
  price?: number;
  /** Set while an active campaign offers this product (offer price wins over price). */
  offer?: ProductOffer;
  featured: boolean;
  /** Sample listings carry a visible "Sample listing" tag. */
  sample: boolean;
  /** Never a stock promise, e.g. "Check availability on WhatsApp". */
  inStockNote?: string;
}

export interface ProductOffer {
  campaignSlug: string;
  campaignTitle: string;
  campaignTitleHi?: string;
  /** Offer price; undefined when the campaign only features the product. */
  price?: number;
  badge?: string;
  endsAt?: string;
}

export interface CampaignItem {
  productId: string;
  offerPrice?: number;
  badge?: string;
}

export interface Campaign {
  id: string;
  slug: string;
  title: string;
  titleHi?: string;
  eyebrow?: string;
  eyebrowHi?: string;
  description?: string;
  descriptionHi?: string;
  image?: SiteImage;
  startsAt?: string;
  endsAt?: string;
  showOnHomepage: boolean;
  offerNote?: string;
  offerNoteHi?: string;
  items: CampaignItem[];
  order: number;
  /** Computed: currently between its start and end. */
  active: boolean;
}

/** The price a customer pays online right now, if any. */
export function effectivePrice(p: Pick<Product, "price" | "offer">): number | undefined {
  return p.offer?.price ?? p.price;
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
