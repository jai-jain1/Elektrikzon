import { CONFIGURATOR_FINISHES } from "@/data/configurator";
import type { Finish } from "@/types/catalog";

const colour = (f: Finish) => CONFIGURATOR_FINISHES.find((c) => c.id === f)?.plate;

/** Small colour dots for a product’s finishes (names are in the title / sr-only). */
export function FinishDots({ finishes, max = 6 }: { finishes: Finish[]; max?: number }) {
  if (!finishes.length) return null;
  const shown = finishes.slice(0, max);
  return (
    <span className="flex items-center gap-1.5" title={finishes.join(", ")}>
      <span className="sr-only">{finishes.join(", ")}</span>
      {shown.map((f) => (
        <span
          key={f}
          aria-hidden="true"
          className="h-3.5 w-3.5 rounded-full"
          style={{
            background: colour(f) ?? "conic-gradient(#c9a86a, #5c3f2a, #eeeae2, #c9a86a)",
            boxShadow: "inset 0 0 0 1px rgb(var(--line) / 0.25)",
          }}
        />
      ))}
      {finishes.length > max && <span className="text-[0.7rem] text-muted">+{finishes.length - max}</span>}
    </span>
  );
}
