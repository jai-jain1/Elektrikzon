import type { SiteSettings } from "@/types/settings";

/**
 * Default business details for ElektrikZone.
 *
 * Only facts the owner has given are filled in. Every empty value renders
 * as a visible [ADD: ...] placeholder on the site. Never invent phone
 * numbers, addresses, brands, statistics, years in business or awards here.
 *
 * From Stage 2, the Sanity "Site settings" document overrides these values.
 */
export const CONFIG: SiteSettings = {
  businessName: "ElektrikZone",
  city: "Ulhasnagar",
  region: "Maharashtra",
  countryCode: "IN",
  trade: "LED lighting supplier, wholesale and retail",

  whatsappNumber: "", // [ADD: WhatsApp number with country code, e.g. 91XXXXXXXXXX]
  phone: "", // [ADD: shop phone number]
  email: "", // [ADD: email address]
  address: "", // [ADD: full shop address]
  postalCode: "", // [ADD: PIN code]
  mapsUrl: "", // [ADD: Google Maps link]
  openingHours: "", // [ADD: opening hours]
  instagramUrl: "", // [ADD: Instagram profile URL]
  instagramHandle: "", // [ADD: Instagram handle]
  gstNumber: "", // [ADD: GSTIN]
  upiId: "", // [ADD: UPI ID, e.g. elektrikzone@okaxis] turns on Pay by UPI
  upiPayeeName: "ElektrikZone",
  orderNote: "", // [ADD: delivery charges and pickup timings]

  brandsStocked: [], // [ADD: brands stocked, plain text]
  strongestLines: [
    "Panel lights",
    "COB downlights",
    "Strip lights",
    "Rope lights",
    "Profile lights",
    "Track and spot lights",
    "Outdoor and flood lights",
    "LED drivers",
  ],
  deliveryAreas: [], // [ADD: delivery areas]
  deliveryPromise: "", // [ADD: delivery promise]
  quoteResponseTime: "", // [ADD: how fast you reply to quotes]

  headlines: [
    "The right light for every room.",
    "Lighting that finishes the space.",
    "From the first downlight to the last strip.",
  ],
};

/** Public site URL, used for metadata, sitemap and JSON-LD. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
