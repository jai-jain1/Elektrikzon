import { getCategories, getProducts, getReels } from "@/lib/catalog";
import { getSiteSettings } from "@/lib/settings";
import { faqJsonLd } from "@/data/faq";
import { jsonLdString } from "@/lib/seo";
import { Hero } from "@/components/home/Hero";
import { LightsOnStory } from "@/components/home/LightsOnStory";
import { TrustStrip } from "@/components/home/TrustStrip";
import { Collections } from "@/components/home/Collections";
import { FinishShowcase } from "@/components/home/FinishShowcase";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { WhoWeSupply } from "@/components/home/WhoWeSupply";
import { WhyElektrikZone } from "@/components/home/WhyElektrikZone";
import { ReelsWall } from "@/components/home/ReelsWall";
import { FaqSection } from "@/components/home/FaqSection";
import { SwitchConfigurator } from "@/components/configurator/SwitchConfigurator";
import { LightLab } from "@/components/lightlab/LightLab";
import { ScrollFilm } from "@/components/film/ScrollFilm";
import { Reveal } from "@/components/motion/Reveal";

export const revalidate = 300;

export default async function HomePage() {
  const [categories, products, reels, settings] = await Promise.all([
    getCategories(),
    getProducts(),
    getReels(),
    getSiteSettings(),
  ]);

  const counts: Record<string, number> = {};
  for (const p of products) counts[p.category.slug] = (counts[p.category.slug] ?? 0) + 1;
  const featured = products.filter((p) => p.featured).slice(0, 8);
  const faq = faqJsonLd(settings);

  return (
    <>
      {faq.mainEntity.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(faq) }} />}
      <Hero />
      <LightsOnStory />
      <TrustStrip />
      <Collections categories={categories} counts={counts} />
      <FinishShowcase />
      <FeaturedProducts products={featured} />
      <SwitchConfigurator />
      <LightLab />
      <ScrollFilm />
      <Reveal>
        <WhoWeSupply />
      </Reveal>
      <Reveal>
        <WhyElektrikZone />
      </Reveal>
      <ReelsWall reels={reels} products={products} />
      <Reveal>
        <FaqSection />
      </Reveal>
    </>
  );
}
