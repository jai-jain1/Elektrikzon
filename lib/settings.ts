import { cache } from "react";
import { CONFIG } from "@/data/config";
import type { SiteSettings } from "@/types/settings";
import { sanityFetch } from "@/lib/sanity/fetch";
import { siteSettingsQuery } from "@/lib/sanity/queries";
import type { SanitySiteSettings } from "@/lib/sanity/types";

/** A value counts as provided only if it is non-empty and not a seeded "[ADD: ...]" placeholder. */
const real = (v: string | undefined | null): v is string => typeof v === "string" && v.trim() !== "" && !v.includes("[ADD:");

const pickString = (sanity: string | undefined, fallback: string) => (real(sanity) ? sanity.trim() : fallback);

const pickList = (sanity: string[] | null | undefined, fallback: string[]) => {
  const cleaned = (sanity ?? []).filter(real).map((s) => s.trim());
  return cleaned.length ? cleaned : fallback;
};

/**
 * Business details for the whole site, read on the server.
 * Sanity "Site settings" values override the /data/config.ts defaults
 * when they are filled in. The business name is always ElektrikZone.
 */
export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
  const s = await sanityFetch<SanitySiteSettings | null>(siteSettingsQuery, {}, ["siteSettings"]);
  if (!s) return CONFIG;

  const headlines = pickList(s.headlines, CONFIG.headlines);
  return {
    ...CONFIG,
    businessName: "ElektrikZone",
    whatsappNumber: pickString(s.whatsappNumber?.replace(/\D/g, ""), CONFIG.whatsappNumber),
    phone: pickString(s.phone, CONFIG.phone),
    email: pickString(s.email, CONFIG.email),
    address: pickString(s.address, CONFIG.address),
    postalCode: pickString(s.postalCode, CONFIG.postalCode),
    mapsUrl: pickString(s.mapsUrl, CONFIG.mapsUrl),
    openingHours: pickString(s.openingHours, CONFIG.openingHours),
    instagramUrl: pickString(s.instagramUrl, CONFIG.instagramUrl),
    instagramHandle: pickString(s.instagramHandle, CONFIG.instagramHandle),
    gstNumber: pickString(s.gstNumber, CONFIG.gstNumber),
    upiId: pickString(s.upiId?.replace(/\s+/g, ""), CONFIG.upiId),
    upiPayeeName: pickString(s.upiPayeeName, CONFIG.upiPayeeName),
    orderNote: pickString(s.orderNote, CONFIG.orderNote),
    brandsStocked: pickList(s.brandsStocked, CONFIG.brandsStocked),
    strongestLines: pickList(s.strongestLines, CONFIG.strongestLines),
    deliveryAreas: pickList(s.deliveryAreas, CONFIG.deliveryAreas),
    deliveryPromise: pickString(s.deliveryPromise, CONFIG.deliveryPromise),
    quoteResponseTime: pickString(s.quoteResponseTime, CONFIG.quoteResponseTime),
    heroVideo: real(s.heroVideoUrl) ? s.heroVideoUrl.trim() : CONFIG.heroVideo,
    headlines: [
      headlines[0] ?? CONFIG.headlines[0],
      headlines[1] ?? CONFIG.headlines[1],
      headlines[2] ?? CONFIG.headlines[2],
    ],
  };
});
