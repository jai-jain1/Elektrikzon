import { getActiveCampaigns, getCategories, getProducts } from "@/lib/catalog";
import { Hero } from "@/components/home/Hero";
import { CampaignBanner } from "@/components/offers/Offers";
import { CategoryRow } from "@/components/home/CategoryRow";
import { HomeProducts } from "@/components/home/HomeProducts";
import { TrustStrip } from "@/components/home/TrustStrip";

export const revalidate = 300;

// Kept short on purpose: hero, running offer, categories, products, shop facts.
// The configurator and Light Lab have their own pages; the FAQ is on /contact.
export default async function HomePage() {
  const [categories, products, campaigns] = await Promise.all([getCategories(), getProducts(), getActiveCampaigns()]);

  // Featured first, then the rest, so the grid is always full.
  const ordered = [...products.filter((p) => p.featured), ...products.filter((p) => !p.featured)];

  return (
    <>
      <Hero />
      <CampaignBanner campaign={campaigns.find((c) => c.showOnHomepage)} products={products} />
      <CategoryRow categories={categories} />
      <HomeProducts products={ordered.slice(0, 8)} />
      <TrustStrip />
    </>
  );
}
