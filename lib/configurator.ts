import { CONFIGURATOR_MODULES, type ConfiguratorModule } from "@/data/configurator";

/** One module placed on the plate (uid keeps React keys stable when reordering). */
export interface PlacedModule {
  uid: string;
  moduleId: string;
}

export const moduleById = (id: string): ConfiguratorModule | undefined => CONFIGURATOR_MODULES.find((m) => m.id === id);

export const usedSlots = (placed: PlacedModule[]) => placed.reduce((n, p) => n + (moduleById(p.moduleId)?.slots ?? 1), 0);

let counter = 0;
export const newUid = () => `m${Date.now().toString(36)}${(counter++).toString(36)}`;

export interface ConfiguratorPreset {
  key: "bedside" | "living" | "kitchen";
  size: number;
  modules: string[];
}

export const PRESETS: ConfiguratorPreset[] = [
  { key: "bedside", size: 2, modules: ["switch-1way", "usb-charger"] },
  { key: "living", size: 6, modules: ["switch-1way", "switch-1way", "dimmer", "fan-regulator", "socket"] },
  { key: "kitchen", size: 4, modules: ["switch-1way", "socket", "switch-1way"] },
];

/**
 * English summary for the WhatsApp message, e.g.
 * "Modules: 1-way switch ×2, Dimmer, Socket (2M), Blank plate ×1"
 */
export function describeModules(placed: PlacedModule[], size: number): string {
  const counts = new Map<string, number>();
  for (const p of placed) counts.set(p.moduleId, (counts.get(p.moduleId) ?? 0) + 1);
  const free = size - usedSlots(placed);
  if (free > 0) counts.set("blank", (counts.get("blank") ?? 0) + free);

  const parts = Array.from(counts.entries()).map(([id, n]) => {
    const m = moduleById(id);
    const label = m ? m.label.charAt(0).toUpperCase() + m.label.slice(1) : id;
    const wide = m && m.slots === 2 ? " (2M)" : "";
    return `${label}${wide}${n > 1 ? ` ×${n}` : ""}`;
  });
  return parts.length ? `Modules: ${parts.join(", ")}` : "Modules: to be decided";
}
