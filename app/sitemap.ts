import type { MetadataRoute } from "next";
import { SITE_URL } from "@/data/config";
import { getProducts } from "@/lib/catalog";

export const revalidate = 300;

// Sample listings are left out of the sitemap (they are noindex).
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const products = (await getProducts()).filter((p) => !p.sample);

  return [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/products`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    ...["/designers", "/contractors", "/about", "/contact"].map((path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...products.map((p) => ({
      url: `${SITE_URL}/products/${p.id}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
