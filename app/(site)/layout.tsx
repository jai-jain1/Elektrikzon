import "./globals.css";
import { getSiteSettings } from "@/lib/settings";
import { jsonLdString, localBusinessJsonLd } from "@/lib/seo";
import { Providers } from "@/components/providers/Providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SkipLink } from "@/components/layout/SkipLink";
import { QuoteBar } from "@/components/layout/QuoteBar";
import { QuoteDrawer } from "@/components/quote/QuoteDrawer";
import { FloatingWhatsApp } from "@/components/quote/FloatingWhatsApp";
import { Toast } from "@/components/ui/Toast";
import { BioMode } from "@/components/instagram/BioMode";

// Re-check Sanity for business details at most every 5 minutes
// (instantly when the revalidate webhook fires).
export const revalidate = 300;

export default async function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const settings = await getSiteSettings();

  return (
    <Providers settings={settings}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(localBusinessJsonLd(settings)) }} />
      <SkipLink />
      <Header />
      <main id="main" tabIndex={-1} className="relative z-[2] outline-none">
        {children}
      </main>
      <Footer />
      <QuoteBar />
      <FloatingWhatsApp />
      <QuoteDrawer />
      <Toast />
      <BioMode />
    </Providers>
  );
}
