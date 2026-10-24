// Raw shapes returned by the GROQ queries in ./queries.ts.
// They are mapped into the site types (types/catalog.ts) by ./mappers.ts.

export interface SanityImageAsset {
  _id: string;
  url: string;
  metadata?: {
    lqip?: string;
    dimensions?: { width: number; height: number; aspectRatio?: number };
  };
}

export interface SanityImage {
  alt?: string;
  crop?: { top: number; bottom: number; left: number; right: number };
  hotspot?: { x: number; y: number; height: number; width: number };
  asset?: SanityImageAsset | null;
}

export interface SanityRefTitle {
  title?: string;
  titleHi?: string;
  slug?: string;
}

export interface SanityCategory {
  id: string;
  title?: string;
  titleHi?: string;
  slug?: string;
  description?: string;
  descriptionHi?: string;
  displayStyle?: "editorial" | "technical" | "standard";
  coverImage?: SanityImage | null;
  order?: number;
}

export interface SanitySubcategory {
  id: string;
  title?: string;
  titleHi?: string;
  slug?: string;
  categorySlug?: string;
  order?: number;
}

export interface SanityBrand {
  id: string;
  name?: string;
  slug?: string;
}

export interface SanityProduct {
  id?: string;
  name?: string;
  nameHi?: string;
  category?: SanityRefTitle | null;
  subcategory?: SanityRefTitle | null;
  brand?: { name?: string; slug?: string } | null;
  finishes?: string[] | null;
  use?: string[] | null;
  specs?: { label?: string; value?: string }[] | null;
  description?: string;
  descriptionHi?: string;
  images?: SanityImage[] | null;
  mrp?: number | null;
  featured?: boolean | null;
  sample?: boolean | null;
  inStockNote?: string;
}

export interface SanityReel {
  id: string;
  title?: string;
  caption?: string;
  postUrl?: string;
  cover?: SanityImage | null;
  productIds?: (string | null)[] | null;
  order?: number;
}

export interface SanitySiteSettings {
  businessName?: string;
  whatsappNumber?: string;
  phone?: string;
  email?: string;
  address?: string;
  postalCode?: string;
  mapsUrl?: string;
  openingHours?: string;
  instagramUrl?: string;
  instagramHandle?: string;
  gstNumber?: string;
  brandsStocked?: string[] | null;
  strongestLines?: string[] | null;
  deliveryAreas?: string[] | null;
  deliveryPromise?: string;
  quoteResponseTime?: string;
  heroVideoUrl?: string;
  headlines?: string[] | null;
}
