import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCampaign, getCampaignSlugs, getProducts } from "@/lib/catalog";
import { CampaignPage } from "@/components/offers/Offers";

export const revalidate = 300;
// Campaigns published after the last build are rendered on first visit.
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getCampaignSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const campaign = await getCampaign(params.slug);
  if (!campaign) return { title: "Offer not found" };
  const description = campaign.description?.slice(0, 155) ?? `${campaign.title} at ElektrikZone, Ulhasnagar. Buy online and pay by UPI.`;
  return {
    title: campaign.title,
    description,
    alternates: { canonical: `/offers/${campaign.slug}` },
    openGraph: {
      title: `${campaign.title} · ElektrikZone`,
      description,
      url: `/offers/${campaign.slug}`,
      ...(campaign.image ? { images: [{ url: campaign.image.url, alt: campaign.image.alt }] } : {}),
    },
  };
}

export default async function Page({ params }: { params: { slug: string } }) {
  const [campaign, products] = await Promise.all([getCampaign(params.slug), getProducts()]);
  if (!campaign) notFound();
  return <CampaignPage campaign={campaign} products={products} />;
}
