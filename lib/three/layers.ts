// The switchable light families and the room's state. Kept free of three.js
// so pages can import these without pulling the 3D library into first load.

export const LAYERS = ["panel", "cob", "strip", "profile", "rope"] as const;
export type LayerKey = (typeof LAYERS)[number];
export type LayerState = Record<LayerKey, boolean>;
/** "high" adds bloom, soft shadows and a sharper floor reflection (desktop); "low" is for phones. */
export type Quality = "high" | "low";

export interface ShowroomState {
  layers: LayerState;
  /** Colour temperature in kelvin: 2700 (warm) to 6500 (cool). */
  kelvin: number;
  /** Dimmer, 0.15 to 1. */
  brightness: number;
}

export const allLayers = (on: boolean): LayerState => ({ panel: on, cob: on, strip: on, profile: on, rope: on });
export const DEFAULT_STATE: ShowroomState = { layers: allLayers(true), kelvin: 3000, brightness: 1 };
