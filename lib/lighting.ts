import type { TKey } from "@/data/translations";
import type { LightColour } from "@/types/catalog";

/** Interface label for each light colour (the stored value is always the English name). */
export const LIGHT_COLOUR_KEY: Record<LightColour, TKey> = {
  "Warm white": "cct.warm",
  "Neutral white": "cct.neutral",
  "Cool white": "cct.cool",
  "3-in-1": "cct.tri",
  RGB: "cct.rgb",
};

/** Swatch for each light colour: the three whites, a three-way split, and a colour wheel. */
export const LIGHT_SWATCH: Record<LightColour, string> = {
  "Warm white": "#ffd29e",
  "Neutral white": "#fff3e2",
  "Cool white": "#cfe2ff",
  "3-in-1": "linear-gradient(90deg, #ffd29e 0 34%, #fff3e2 34% 67%, #cfe2ff 67%)",
  RGB: "conic-gradient(#ff5a5a, #ffd24a, #53e07c, #4aa8ff, #b56bff, #ff5a5a)",
};
