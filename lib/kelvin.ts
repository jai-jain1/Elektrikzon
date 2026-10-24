/**
 * Approximate RGB for a colour temperature (Tanner Helland's fit).
 * Good enough for an on-screen mood preview; not a colour-accurate tool.
 */
export function kelvinToRgb(kelvin: number): [number, number, number] {
  const t = kelvin / 100;
  let r: number;
  let g: number;
  let b: number;

  if (t <= 66) {
    r = 255;
    g = 99.4708025861 * Math.log(t) - 161.1195681661;
    b = t <= 19 ? 0 : 138.5177312231 * Math.log(t - 10) - 305.0447927307;
  } else {
    r = 329.698727446 * Math.pow(t - 60, -0.1332047592);
    g = 288.1221695283 * Math.pow(t - 60, -0.0755148492);
    b = 255;
  }

  const clamp = (v: number) => Math.round(Math.max(0, Math.min(255, v)));
  return [clamp(r), clamp(g), clamp(b)];
}

export type ToneKey = "light.warm" | "light.soft" | "light.neutral" | "light.cool" | "light.daylight";

/** Everyday name for a colour temperature, as used on lamp boxes. */
export function toneFor(kelvin: number): ToneKey {
  if (kelvin < 2900) return "light.warm";
  if (kelvin < 3500) return "light.soft";
  if (kelvin < 4500) return "light.neutral";
  if (kelvin < 5500) return "light.cool";
  return "light.daylight";
}

export const TONE_EN: Record<ToneKey, string> = {
  "light.warm": "warm white",
  "light.soft": "soft white",
  "light.neutral": "neutral white",
  "light.cool": "cool white",
  "light.daylight": "daylight",
};
