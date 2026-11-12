"use client";

import type { LightColour } from "@/types/catalog";
import { useT } from "@/lib/i18n";
import { LIGHT_COLOUR_KEY, LIGHT_SWATCH } from "@/lib/lighting";

/** Small swatches for the light colours a product comes in (names are in the title and for screen readers). */
export function LightDots({ colours }: { colours: LightColour[] }) {
  const t = useT();
  if (!colours.length) return null;
  const names = colours.map((c) => t(LIGHT_COLOUR_KEY[c])).join(", ");
  return (
    <span className="flex items-center gap-1.5" title={names}>
      <span className="sr-only">{names}</span>
      {colours.map((c) => (
        <span
          key={c}
          aria-hidden="true"
          className="h-3.5 w-3.5 rounded-full"
          style={{ background: LIGHT_SWATCH[c], boxShadow: "inset 0 0 0 1px rgb(var(--line) / 0.3)" }}
        />
      ))}
    </span>
  );
}

/** “12 W” chip plus light-colour swatches: the two facts lighting buyers look for first. */
export function LightFacts({ wattage, colours, className = "" }: { wattage?: number; colours: LightColour[]; className?: string }) {
  if (!wattage && !colours.length) return null;
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {wattage ? <span className="rounded-full border px-2 py-0.5 text-[0.68rem] tabular-nums text-muted hairline">{wattage} W</span> : null}
      <LightDots colours={colours} />
    </div>
  );
}
