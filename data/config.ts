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
  trade: "Electrical products supplier, wholesale and retail",

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
    "Modular switches",
    "Sockets",
    "Dimmers and regulators",
    "LED lighting",
    "Cove and profile lights",
    "Wires and cables",
    "MCBs and distribution",
    "Fans",
    "Smart home",
  ],
  deliveryAreas: [], // [ADD: delivery areas]
  deliveryPromise: "", // [ADD: delivery promise]
  quoteResponseTime: "", // [ADD: how fast you reply to quotes]

  // Rendered by the render studio (/render → "Record hero video"). Set to null for the still photo only.
  heroVideo: "/video/hero.mp4",
  headlines: [
    "Light, power and control, chosen with care.",
    "Everything behind the wall, and everything on it.",
    "From the first wire to the last switch plate.",
  ],
};

/** Public site URL, used for metadata, sitemap and JSON-LD. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
