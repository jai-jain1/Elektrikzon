import type { Metadata } from "next";
import { ContactPage } from "@/components/contact/ContactPage";
import { FaqSection } from "@/components/home/FaqSection";
import { getSiteSettings } from "@/lib/settings";
import { faqJsonLd } from "@/data/faq";
import { jsonLdString } from "@/lib/seo";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact ElektrikZone in Ulhasnagar: WhatsApp for quotes, phone, email, opening hours and directions.",
  alternates: { canonical: "/contact" },
  openGraph: { title: "Contact · ElektrikZone", url: "/contact" },
};

export default async function Page() {
  const faq = faqJsonLd(await getSiteSettings());
  return (
    <>
      {faq.mainEntity.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(faq) }} />}
      <ContactPage />
      <FaqSection />
    </>
  );
}
