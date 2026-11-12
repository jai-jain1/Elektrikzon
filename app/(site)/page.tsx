import { getActiveCampaigns, getCategories, getProducts, getReels } from "@/lib/catalog";
import { Hero } from "@/components/home/Hero";
import { CampaignBanner } from "@/components/offers/Offers";
import { RangeGrid } from "@/components/home/RangeGrid";
import { HomeProducts } from "@/components/home/HomeProducts";
import { TradeBlock } from "@/components/home/TradeBlock";
import { ReelsWall } from "@/components/home/ReelsWall";
import { TrustStrip } from "@/components/home/TrustStrip";

export const revalidate = 300;

// Kept short on purpose: the 3D room, a running offer, the types of light,
// popular products, the trade block, reels (when there are any) and shop facts.
// The Light Lab has its own page; the FAQ is on /contact.
export default async function HomePage() {
  const [categories, products, campaigns, reels] = await Promise.all([getCategories(), getProducts(), getActiveCampaigns(), getReels()]);

  const counts: Record<string, number> = {};
  for (const p of products) counts[p.category.slug] = (counts[p.category.slug] ?? 0) + 1;
  // Featured first, then the rest, so the grid is always full.
  const ordered = [...products.filter((p) => p.featured), ...products.filter((p) => !p.featured)];

  return (
    <>
      <Hero />
      <CampaignBanner campaign={campaigns.find((c) => c.showOnHomepage)} products={products} />
      <RangeGrid categories={categories} counts={counts} />
      <HomeProducts products={ordered.slice(0, 8)} />
      <TradeBlock />
      <ReelsWall reels={reels} products={products} />
      <TrustStrip />
    </>
  );
}
