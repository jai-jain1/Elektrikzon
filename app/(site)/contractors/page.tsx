import type { Metadata } from "next";
import { ContractorsPage } from "@/components/contractors/ContractorsPage";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "For Contractors",
  description:
    "Electrical contractors: wires, MCBs, conduits and accessories in project quantities from ElektrikZone, Ulhasnagar. Ask for a trade account on WhatsApp.",
  alternates: { canonical: "/contractors" },
  openGraph: { title: "For Contractors · ElektrikZone", url: "/contractors" },
};

export default function Page() {
  return <ContractorsPage />;
}
