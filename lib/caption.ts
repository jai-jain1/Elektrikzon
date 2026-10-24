import type { Product } from "@/types/catalog";

// Instagram caption helper: product line, link and exactly 8 hashtags
// (4 fixed brand/location tags + up to 4 tags for the product's category).

const BASE_TAGS = ["#ElektrikZone", "#Ulhasnagar", "#ElectricalShop", "#InteriorDesign"];

const CATEGORY_TAGS: Record<string, string[]> = {
  "switches-and-sockets": ["#ModularSwitches", "#SwitchPlates", "#HomeDecor", "#Renovation"],
  lighting: ["#LightingDesign", "#LEDLighting", "#CoveLighting", "#HomeDecor"],
  "technical-supply": ["#Electrician", "#ElectricalContractor", "#Wiring", "#SiteWork"],
  fans: ["#CeilingFan", "#HomeDecor", "#Renovation", "#HomeIndia"],
  "smart-home": ["#SmartHome", "#HomeAutomation", "#ModernHome", "#Renovation"],
};

const FALLBACK_TAGS = ["#HomeDecor", "#Renovation", "#ModernHome", "#HomeIndia"];

export function hashtagsFor(categorySlug: string): string[] {
  const extra = CATEGORY_TAGS[categorySlug] ?? FALLBACK_TAGS;
  return [...BASE_TAGS, ...extra].slice(0, 8);
}

export function buildCaption(p: Product, url: string): string {
  return [
    `${p.name}${p.brand ? ` · ${p.brand.name}` : ""}`,
    "Ask us for the trade price on WhatsApp.",
    `Product ID: ${p.id}`,
    url,
    "",
    hashtagsFor(p.category.slug).join(" "),
  ].join("\n");
}
