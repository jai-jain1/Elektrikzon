import type { Finish } from "@/types/catalog";

// Switch Configurator data (UI built in Stage 5). Availability is not
// confirmed for any brand, so the site always shows the placeholder below.

export const CONFIGURATOR_AVAILABILITY = "[ADD: confirm per brand]";

export const PLATE_SIZES = [1, 2, 3, 4, 5, 6] as const;
export const MAX_MODULES = 6;

export interface ConfiguratorModule {
  id: string;
  label: string;
  labelHi: string;
  /** How many module slots it takes on the plate. */
  slots: 1 | 2;
}

export const CONFIGURATOR_MODULES: ConfiguratorModule[] = [
  { id: "switch-1way", label: "1-way switch", labelHi: "1-वे स्विच", slots: 1 },
  { id: "switch-2way", label: "2-way switch", labelHi: "2-वे स्विच", slots: 1 },
  { id: "bell-push", label: "Bell push", labelHi: "बेल पुश", slots: 1 },
  { id: "socket", label: "Socket", labelHi: "सॉकेट", slots: 2 },
  { id: "usb-charger", label: "USB charger", labelHi: "USB चार्जर", slots: 1 },
  { id: "dimmer", label: "Dimmer", labelHi: "डिमर", slots: 1 },
  { id: "fan-regulator", label: "Fan regulator", labelHi: "फ़ैन रेगुलेटर", slots: 1 },
  { id: "blank", label: "Blank plate", labelHi: "ब्लैंक प्लेट", slots: 1 },
];

export interface ConfiguratorFinish {
  id: Finish;
  labelHi: string;
  /** Hex used by the 3D and SVG renderers. */
  plate: string;
  rocker: string;
  /** 3D material look (illustrative only, not a product claim). */
  metalness: number;
  roughness: number;
  clearcoat: number;
}

export const CONFIGURATOR_FINISHES: ConfiguratorFinish[] = [
  { id: "Matte White", labelHi: "मैट व्हाइट", plate: "#EEEAE2", rocker: "#F7F4EE", metalness: 0, roughness: 0.55, clearcoat: 0 },
  { id: "Charcoal", labelHi: "चारकोल", plate: "#2B2A28", rocker: "#3A3835", metalness: 0, roughness: 0.6, clearcoat: 0.1 },
  { id: "Champagne Gold", labelHi: "शैम्पेन गोल्ड", plate: "#C9A86A", rocker: "#D8BC85", metalness: 0.85, roughness: 0.32, clearcoat: 0.3 },
  { id: "Walnut", labelHi: "वॉलनट", plate: "#5C3F2A", rocker: "#E9E2D6", metalness: 0, roughness: 0.7, clearcoat: 0.2 },
  { id: "Black", labelHi: "ब्लैक", plate: "#141414", rocker: "#1F1F1F", metalness: 0.1, roughness: 0.3, clearcoat: 0.7 },
  { id: "Silver", labelHi: "सिल्वर", plate: "#B9BCC0", rocker: "#D2D5D8", metalness: 0.9, roughness: 0.28, clearcoat: 0.2 },
];
