import type { Metadata } from "next";
import { ContactPage } from "@/components/contact/ContactPage";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact ElektrikZone in Ulhasnagar: WhatsApp for quotes, phone, email, opening hours and directions.",
  alternates: { canonical: "/contact" },
  openGraph: { title: "Contact · ElektrikZone", url: "/contact" },
};

export default function Page() {
  return <ContactPage />;
}
