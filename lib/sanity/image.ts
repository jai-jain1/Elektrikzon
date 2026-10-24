import { createImageUrlBuilder } from "@sanity/image-url";
import type { ImageLoaderProps } from "next/image";
import { dataset, projectId } from "@/sanity/env";
import type { SanityImage } from "./types";
import type { SiteImage } from "@/types/catalog";

const builder = createImageUrlBuilder({ projectId: projectId || "not-configured", dataset });

/** URL builder that respects crop and hotspot. Always auto=format, q=80. */
export function urlFor(source: SanityImage) {
  return builder.image(source as Parameters<typeof builder.image>[0]).auto("format").quality(80);
}

/**
 * next/image loader for cdn.sanity.io: lets Sanity resize instead of the
 * Next.js optimiser, keeping format=auto and quality ~80.
 */
export function sanityLoader({ src, width, quality }: ImageLoaderProps) {
  const url = new URL(src);
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 80));
  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "max");
  return url.toString();
}

/** Maps a Sanity image to the site's image shape (null if it has no asset). */
export function toSiteImage(img: SanityImage | null | undefined, fallbackAlt: string): SiteImage | null {
  if (!img?.asset?._id) return null;
  const dims = img.asset.metadata?.dimensions;
  // Cropped images keep the crop's aspect ratio; width capped at 2000 px.
  const url = urlFor(img).width(2000).fit("max").url();
  return {
    url,
    alt: img.alt?.trim() || fallbackAlt,
    width: dims?.width,
    height: dims?.height,
    lqip: img.asset.metadata?.lqip,
  };
}
