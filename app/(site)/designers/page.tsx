import type { Metadata } from "next";
import { DesignersPage } from "@/components/designers/DesignersPage";

export const metadata: Metadata = {
  title: "For Designers",
  description:
    "Interior designers and architects: paste your product list, plan lighting in the Light Lab and get one quote back from ElektrikZone on WhatsApp.",
  alternates: { canonical: "/designers" },
  openGraph: { title: "For Designers · ElektrikZone", url: "/designers" },
};

export default function Page() {
  return <DesignersPage />;
}
