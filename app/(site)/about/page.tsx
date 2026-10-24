import type { Metadata } from "next";
import { AboutPage } from "@/components/about/AboutPage";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "About",
  description: "ElektrikZone supplies electrical products, wholesale and retail, from Ulhasnagar, Maharashtra.",
  alternates: { canonical: "/about" },
  openGraph: { title: "About · ElektrikZone", url: "/about" },
};

export default function Page() {
  return <AboutPage />;
}
