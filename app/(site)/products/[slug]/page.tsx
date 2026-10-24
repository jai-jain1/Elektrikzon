import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, getProducts, getProductSlugs } from "@/lib/catalog";
import { breadcrumbJsonLd, jsonLdString, productJsonLd } from "@/lib/seo";
import { ProductDetail } from "@/components/product/ProductDetail";

export const revalidate = 300;
// Products published after the last build are rendered on first visit.
export const dynamicParams = true;

export async function generateStaticParams() {
  const slugs = await getProductSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const product = await getProduct(params.slug);
  if (!product) return { title: "Product not found" };

  const description =
    product.description && !product.sample
      ? product.description.slice(0, 155)
      : `${product.name} from ElektrikZone, Ulhasnagar. ${product.category.title}. Request a trade price on WhatsApp.`;
  const image = product.images[0];
  let ogImage: string | undefined;
  if (image) {
    const u = new URL(image.url);
    u.searchParams.set("w", "1200");
    u.searchParams.set("h", "630");
    u.searchParams.set("fit", "crop");
    ogImage = u.toString();
  }

  return {
    title: product.name,
    description,
    alternates: { canonical: `/products/${product.id}` },
    openGraph: {
      title: `${product.name} · ElektrikZone`,
      description,
      url: `/products/${product.id}`,
      ...(image && ogImage ? { images: [{ url: ogImage, alt: image.alt }] } : {}),
    },
    // Sample listings are placeholders: keep them out of search results.
    robots: product.sample ? { index: false, follow: true } : undefined,
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  const all = await getProducts();
  const related = all.filter((p) => p.id !== product.id && p.category.slug === product.category.slug).slice(0, 4);

  const jsonLd = [
    productJsonLd(product),
    breadcrumbJsonLd([
      { name: "Catalogue", path: "/products" },
      { name: product.category.title, path: `/products?category=${product.category.slug}` },
      { name: product.name, path: `/products/${product.id}` },
    ]),
  ];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdString(jsonLd) }} />
      <ProductDetail product={product} related={related} />
    </>
  );
}
