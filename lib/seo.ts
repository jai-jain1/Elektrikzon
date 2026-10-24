import { SITE_URL } from "@/data/config";
import type { SiteSettings } from "@/types/settings";
import type { Product } from "@/types/catalog";
import { normaliseWhatsAppNumber } from "@/lib/whatsapp";

/**
 * LocalBusiness JSON-LD. Only fields the owner has actually filled in are
 * included; placeholders never reach structured data.
 */
export function localBusinessJsonLd(s: SiteSettings) {
  const phone = s.phone.trim() || (normaliseWhatsAppNumber(s.whatsappNumber) ? `+${normaliseWhatsAppNumber(s.whatsappNumber)}` : "");
  const sameAs = [s.instagramUrl].filter((u) => u.trim());

  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Store",
    "@id": `${SITE_URL}/#business`,
    name: s.businessName,
    description: `${s.trade} in ${s.city}, ${s.region}.`,
    url: SITE_URL,
    image: `${SITE_URL}/opengraph-image`,
    address: {
      "@type": "PostalAddress",
      ...(s.address.trim() ? { streetAddress: s.address } : {}),
      addressLocality: s.city,
      addressRegion: s.region,
      ...(s.postalCode.trim() ? { postalCode: s.postalCode } : {}),
      addressCountry: s.countryCode,
    },
  };

  if (phone) data.telephone = phone;
  if (s.email.trim()) data.email = s.email;
  if (s.mapsUrl.trim()) data.hasMap = s.mapsUrl;
  if (s.openingHours.trim()) data.openingHours = s.openingHours;
  if (sameAs.length) data.sameAs = sameAs;
  if (s.deliveryAreas.length) data.areaServed = s.deliveryAreas;
  if (s.brandsStocked.length) data.brand = s.brandsStocked.map((name) => ({ "@type": "Brand", name }));

  return data;
}

/**
 * Product JSON-LD. Deliberately WITHOUT offers or price: prices are only
 * given on request. Only the product's own fields are used.
 */
export function productJsonLd(p: Product) {
  const url = `${SITE_URL}/products/${p.id}`;
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name: p.name,
    sku: p.id,
    url,
    category: p.subcategory ? `${p.category.title} > ${p.subcategory.title}` : p.category.title,
  };
  if (p.description && !p.sample) data.description = p.description;
  if (p.images.length) data.image = p.images.map((i) => i.url);
  if (p.brand) data.brand = { "@type": "Brand", name: p.brand.name };
  const props = p.specs.filter((s) => !s.value.includes("[ADD:"));
  if (props.length) data.additionalProperty = props.map((s) => ({ "@type": "PropertyValue", name: s.label, value: s.value }));
  return data;
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: `${SITE_URL}${it.path}` })),
  };
}

/** Safe serialisation for <script type="application/ld+json">. */
export function jsonLdString(data: unknown) {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
