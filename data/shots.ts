/**
 * Photography slots for the site. The current images are rendered locally by
 * the render studio (npm run dev → /render, scenes in lib/render/scenes.ts)
 * and saved to public/shots. Each slot also keeps a Higgsfield prompt, so a
 * slot can later be replaced with a generated or real photograph.
 *
 * To swap an image: save it as public/shots/<file> (same file name).
 * Set `src: null` on a slot to show the placeholder frame instead.
 * All shots: no brand logos, no readable text, no people needed, unbranded
 * generic fittings only, graphite/black/silver palette, no gold tones.
 */

export type ShotKind = "plate" | "room" | "light" | "wire" | "mcb" | "fan" | "smart" | "plan";

export interface Shot {
  id: string;
  file: string;
  src: string | null;
  alt: string;
  /** CSS aspect-ratio value. */
  aspect: string;
  kind: ShotKind;
  prompt: string;
}

const STYLE =
  "Ultra-clean product photography, Apple-style, deep graphite and black tones, soft studio light, crisp detail, shallow depth of field, no logos, no text, no people, photoreal, 8k.";

const shot = (s: Omit<Shot, "src"> & { src?: string | null }): Shot => ({ src: `/shots/${s.file}`, ...s });

export const SHOTS = {
  hero: shot({
    id: "hero",
    file: "hero-plate.webp",
    alt: "A graphite modular switch plate on a dark plaster wall, lit by a single soft light",
    aspect: "16 / 9",
    kind: "plate",
    prompt: `A single graphite-grey six-module modular switch plate mounted on a dark charcoal plaster wall, one soft light grazing from the upper left revealing the wall texture, the plate perfectly centred, lots of negative space, cinematic. ${STYLE}`,
  }),
  roomOff: shot({
    id: "room-off",
    file: "room-off.webp",
    alt: "A modern living room at night with the lights off",
    aspect: "16 / 9",
    kind: "room",
    prompt: `Modern minimalist living room at night, all lights off, only faint blue moonlight through a large window, low sofa, plain plaster walls, gypsum false ceiling with a hidden cove, locked-off wide shot at eye level. ${STYLE}`,
  }),
  roomOn: shot({
    id: "room-on",
    file: "room-on.webp",
    alt: "The same living room with cove lighting and downlights switched on",
    aspect: "16 / 9",
    kind: "room",
    prompt: `Exactly the same room, framing and camera as the previous image, now with the lights on: soft neutral-white 3500 K cove light glowing from the ceiling edge, three recessed downlights washing the wall, calm and premium, no orange cast. Use the previous image as the reference. ${STYLE}`,
  }),
  finishMatteWhite: shot({ id: "finish-matte-white", file: "finish-matte-white.webp", alt: "Matte white modular switch plate", aspect: "1 / 1", kind: "plate", prompt: `Front view of a four-module modular switch plate in matte white, centred on a seamless black background, soft top light, subtle reflection below. ${STYLE}` }),
  finishCharcoal: shot({ id: "finish-charcoal", file: "finish-charcoal.webp", alt: "Charcoal modular switch plate", aspect: "1 / 1", kind: "plate", prompt: `Same framing as the matte white plate: a four-module modular switch plate in charcoal grey, seamless black background, soft top light. ${STYLE}` }),
  finishChampagne: shot({ id: "finish-champagne-gold", file: "finish-champagne-gold.webp", alt: "Champagne metal modular switch plate", aspect: "1 / 1", kind: "plate", prompt: `Same framing: a four-module modular switch plate in a soft brushed champagne metal finish, restrained and pale, seamless black background, soft top light. ${STYLE}` }),
  finishWalnut: shot({ id: "finish-walnut", file: "finish-walnut.webp", alt: "Walnut wood modular switch plate", aspect: "1 / 1", kind: "plate", prompt: `Same framing: a four-module modular switch plate in dark walnut wood veneer with white switch modules, seamless black background, soft top light. ${STYLE}` }),
  finishBlack: shot({ id: "finish-black", file: "finish-black.webp", alt: "Gloss black glass modular switch plate", aspect: "1 / 1", kind: "plate", prompt: `Same framing: a four-module modular switch plate in gloss black glass, a single long highlight across the glass, seamless black background. ${STYLE}` }),
  finishSilver: shot({ id: "finish-silver", file: "finish-silver.webp", alt: "Brushed silver modular switch plate", aspect: "1 / 1", kind: "plate", prompt: `Same framing: a four-module modular switch plate in brushed silver aluminium, seamless black background, soft top light. ${STYLE}` }),
  lineSwitches: shot({ id: "line-switches", file: "line-switches.webp", alt: "Modular switches and sockets", aspect: "4 / 3", kind: "plate", prompt: `Three modular switch plates of different sizes arranged at angles on a matte black surface, graphite and white finishes, top-down three-quarter view. ${STYLE}` }),
  lineLighting: shot({ id: "line-lighting", file: "line-lighting.webp", alt: "Recessed downlight and LED profile light", aspect: "4 / 3", kind: "light", prompt: `A slim recessed LED downlight and a black aluminium LED profile light, both lit with neutral-white light, floating on a black background with a soft glow. ${STYLE}` }),
  lineWires: shot({ id: "line-wires", file: "line-wires.webp", alt: "Coils of house wire", aspect: "4 / 3", kind: "wire", prompt: `Neat coils of unbranded house wire in red, black, blue and grey, stacked on a dark graphite surface, side light catching the insulation. ${STYLE}` }),
  lineFans: shot({ id: "line-fans", file: "line-fans.webp", alt: "Ceiling fan from below", aspect: "4 / 3", kind: "fan", prompt: `A minimal matte black ceiling fan photographed from directly below against a dark ceiling, motion-free, symmetrical. ${STYLE}` }),
  lineSmart: shot({ id: "line-smart", file: "line-smart.webp", alt: "Smart glass touch switch", aspect: "4 / 3", kind: "smart", prompt: `A black glass smart touch switch panel on a dark wall, two softly glowing white touch indicators, close three-quarter view. ${STYLE}` }),
  filmPlan: shot({ id: "film-plan", file: "film-plan.webp", alt: "An electrical layout drawing on a dark desk", aspect: "4 / 5", kind: "plan", prompt: `Top-down view of an architectural electrical layout drawing on a dark desk, a silver pen beside it, switch and light symbols visible but no readable text, single soft desk light. ${STYLE}` }),
  filmWire: shot({ id: "film-wire", file: "film-wire.webp", alt: "Conduits and wires running through an unfinished wall", aspect: "4 / 5", kind: "wire", prompt: `Unfinished grey wall with neatly chased channels holding grey conduit pipes and red, black and blue wires, raking side light, clean construction detail. ${STYLE}` }),
  filmProtect: shot({ id: "film-protect", file: "film-protect.webp", alt: "A distribution board with a row of MCBs", aspect: "4 / 5", kind: "mcb", prompt: `Close-up of a clean distribution board with a neat row of plain white miniature circuit breakers, one small green indicator lit, dark surroundings, no brand marks. ${STYLE}` }),
  filmFinish: shot({ id: "film-finish", file: "film-finish.webp", alt: "A finished switch plate on a painted wall with soft light", aspect: "4 / 5", kind: "plate", prompt: `A finished graphite modular switch plate on a smooth painted wall, soft neutral light from a wall washer above, calm and complete. ${STYLE}` }),
} satisfies Record<string, Shot>;

export type ShotId = keyof typeof SHOTS;

/** Finish id (configurator) → product shot. */
export const FINISH_SHOTS: Record<string, Shot> = {
  "Matte White": SHOTS.finishMatteWhite,
  Charcoal: SHOTS.finishCharcoal,
  "Champagne Gold": SHOTS.finishChampagne,
  Walnut: SHOTS.finishWalnut,
  Black: SHOTS.finishBlack,
  Silver: SHOTS.finishSilver,
};

/** Category slug → bento tile shot (used when the category has no cover photo). */
export const CATEGORY_SHOTS: Record<string, Shot> = {
  "switches-and-sockets": SHOTS.lineSwitches,
  lighting: SHOTS.lineLighting,
  "technical-supply": SHOTS.lineWires,
  fans: SHOTS.lineFans,
  "smart-home": SHOTS.lineSmart,
};
