import type { Metadata } from "next";
import { getBrands, getCategories, getProducts, getSubcategories } from "@/lib/catalog";
import { Catalogue } from "@/components/catalogue/Catalogue";
import { CatalogueIntro } from "@/components/catalogue/CatalogueIntro";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Catalogue",
  description:
    "Switches, sockets, lighting, wires, MCBs, fans and smart home products from ElektrikZone, Ulhasnagar. Search, filter and request a trade price on WhatsApp.",
  alternates: { canonical: "/products" },
  openGraph: { title: "Catalogue · ElektrikZone", url: "/products" },
};

// The catalogue is small, so the full list goes to the client for instant
// filtering and search.
export default async function ProductsPage() {
  const [products, categories, subcategories, brands] = await Promise.all([
    getProducts(),
    getCategories(),
    getSubcategories(),
    getBrands(),
  ]);

  return (
    <>
      <CatalogueIntro />
      <Catalogue products={products} categories={categories} subcategories={subcategories} brands={brands} />
    </>
  );
}
