import type { Product } from "@/types/catalog";

// Instagram caption helper: product line, link and exactly 8 hashtags
// (4 fixed brand/location tags + up to 4 tags for the product's category).

const BASE_TAGS = ["#ElektrikZone", "#Ulhasnagar", "#LEDLighting", "#InteriorDesign"];

const CATEGORY_TAGS: Record<string, string[]> = {
  "panel-lights": ["#PanelLight", "#FalseCeiling", "#HomeLighting", "#Renovation"],
  "cob-and-downlights": ["#COBLight", "#Downlights", "#LightingDesign", "#HomeDecor"],
  "strip-lights": ["#StripLight", "#CoveLighting", "#LightingDesign", "#HomeDecor"],
  "rope-lights": ["#RopeLight", "#FestiveLighting", "#FacadeLighting", "#HomeDecor"],
  "profile-lights": ["#ProfileLight", "#LinearLighting", "#LightingDesign", "#ModernHome"],
  "track-and-spot-lights": ["#TrackLight", "#ShopLighting", "#LightingDesign", "#RetailDesign"],
  "outdoor-and-flood-lights": ["#FloodLight", "#OutdoorLighting", "#FacadeLighting", "#Landscape"],
  "drivers-and-accessories": ["#LEDDriver", "#Electrician", "#LightingContractor", "#SiteWork"],
};

const FALLBACK_TAGS = ["#LightingDesign", "#HomeDecor", "#Renovation", "#ModernHome"];

export function hashtagsFor(categorySlug: string): string[] {
  const extra = CATEGORY_TAGS[categorySlug] ?? FALLBACK_TAGS;
  return [...BASE_TAGS, ...extra].slice(0, 8);
}

export function buildCaption(p: Product, url: string): string {
  return [
    `${p.name}${p.brand ? ` · ${p.brand.name}` : ""}`,
    typeof p.price === "number" ? "Order online or ask us on WhatsApp." : "Ask us for the trade price on WhatsApp.",
    `Product ID: ${p.id}`,
    url,
    "",
    hashtagsFor(p.category.slug).join(" "),
  ].join("\n");
}
