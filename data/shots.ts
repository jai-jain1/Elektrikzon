// Rendered imagery used around the site. Every file is produced by the
// render studio (/render, development only) from the 3D scenes in
// lib/three/showroom.ts and lib/render/scenes.ts, then saved to public/shots.

export interface Shot {
  id: string;
  file: string;
  src: string;
  alt: string;
  width: number;
  height: number;
}

const shot = (id: string, width: number, height: number, alt: string): Shot => ({ id, file: `${id}.webp`, src: `/shots/${id}.webp`, alt, width, height });

const ROOM_ON = "A minimal room lit by cove strip lights, COB downlights, slim panels, profile lights and rope-lit arches";
const ROOM_OFF = "The same room with every light switched off";

export const SHOTS = {
  // Hero posters: shown until the live 3D room takes over, and instead of it in Lite mode.
  showroomOn: shot("showroom-on", 1920, 1080, ROOM_ON),
  showroomOff: shot("showroom-off", 1920, 1080, ROOM_OFF),
  showroomOnTall: shot("showroom-on-tall", 1080, 1920, ROOM_ON),
  showroomOffTall: shot("showroom-off-tall", 1080, 1920, ROOM_OFF),
  showroomDetail: shot("showroom-detail", 1600, 1200, "COB downlights washing fluted walnut panelling above a floating console"),

  // One studio render per type of light, for the range tiles.
  rangePanel: shot("range-panel", 1200, 900, "Slim round and square LED panel lights"),
  rangeCob: shot("range-cob", 1200, 900, "Recessed COB downlights"),
  rangeStrip: shot("range-strip", 1200, 900, "A reel of LED strip light"),
  rangeRope: shot("range-rope", 1200, 900, "A coil of LED rope light"),
  rangeProfile: shot("range-profile", 1200, 900, "Aluminium profile lights with frosted diffusers"),
  rangeTrack: shot("range-track", 1200, 900, "Track lights on a rail"),
  rangeFlood: shot("range-flood", 1200, 900, "An outdoor LED flood light"),
  rangeDriver: shot("range-driver", 1200, 900, "LED drivers and power supplies"),

  campaignLights: shot("campaign-lights", 2400, 1350, "Warm string lights and lit diyas in a dark room for the festive season"),
} satisfies Record<string, Shot>;

export type ShotId = keyof typeof SHOTS;

/** Category slug → range render. Categories added later in the Studio use their own cover photo. */
export const RANGE_SHOTS: Record<string, Shot> = {
  "panel-lights": SHOTS.rangePanel,
  "cob-and-downlights": SHOTS.rangeCob,
  "strip-lights": SHOTS.rangeStrip,
  "rope-lights": SHOTS.rangeRope,
  "profile-lights": SHOTS.rangeProfile,
  "track-and-spot-lights": SHOTS.rangeTrack,
  "outdoor-and-flood-lights": SHOTS.rangeFlood,
  "drivers-and-accessories": SHOTS.rangeDriver,
};
