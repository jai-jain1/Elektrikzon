"use client";

import Image from "next/image";
import type { SiteImage } from "@/types/catalog";
import { sanityLoader } from "@/lib/sanity/image";
import { useT } from "@/lib/i18n";

interface Props {
  image?: SiteImage;
  sizes: string;
  priority?: boolean;
  className?: string;
}

/**
 * Product photo from cdn.sanity.io (resized by Sanity, blur-up from lqip),
 * or a designed “Photo coming soon” placeholder when there is none.
 */
export function ProductImage({ image, sizes, priority, className = "" }: Props) {
  const t = useT();

  if (!image) {
    return (
      <div className={`relative flex h-full w-full flex-col items-center justify-center gap-3 overflow-hidden bg-elev ${className}`}>
        <svg aria-hidden="true" viewBox="0 0 120 120" className="h-16 w-16 text-fg/15">
          <rect x="30" y="22" width="60" height="76" rx="9" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <rect x="45" y="38" width="30" height="44" rx="4" fill="none" stroke="currentColor" strokeWidth="2.5" />
          <circle cx="60" cy="45" r="2.6" fill="rgb(var(--amber))" opacity="0.8" />
        </svg>
        <span className="px-3 text-center text-[0.65rem] font-medium uppercase tracking-[0.16em] text-muted sm:text-[0.7rem]">
          {t("product.noPhoto")}
        </span>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: "linear-gradient(rgb(var(--line)) 1px, transparent 1px), linear-gradient(90deg, rgb(var(--line)) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
      </div>
    );
  }

  return (
    <Image
      loader={sanityLoader}
      src={image.url}
      alt={image.alt}
      fill
      sizes={sizes}
      priority={priority}
      quality={80}
      placeholder={image.lqip ? "blur" : "empty"}
      blurDataURL={image.lqip}
      className={`object-cover ${className}`}
    />
  );
}
