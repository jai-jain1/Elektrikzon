import type { Metadata } from "next";
import { getActiveCampaigns } from "@/lib/catalog";
import { OffersIndex } from "@/components/offers/Offers";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Offers",
  description: "Festival and seasonal offers from ElektrikZone, Ulhasnagar. Buy online and pay by UPI.",
  alternates: { canonical: "/offers" },
  openGraph: { title: "Offers · ElektrikZone", url: "/offers" },
};

export default async function Page() {
  return <OffersIndex campaigns={await getActiveCampaigns()} />;
}
