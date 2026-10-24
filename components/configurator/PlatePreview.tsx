import { useId } from "react";
import type { ConfiguratorFinish } from "@/data/configurator";
import { moduleById, usedSlots, type PlacedModule } from "@/lib/configurator";

// SVG preview of a modular plate (illustration only, not a specific product).
const M = 44; // one module width
const H = 78; // module height
const PAD = 16;

function ModuleGlyph({ id, x, w, finish }: { id: string; x: number; w: number; finish: ConfiguratorFinish }) {
  const cx = x + w / 2;
  const cy = PAD + H / 2;
  const dark = finish.metalness < 0.5 && ["Charcoal", "Black"].includes(finish.id);
  const ink = dark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.45)";
  const led = "#f5f5f7";

  switch (id) {
    case "switch-1way":
    case "switch-2way":
      return (
        <g>
          <rect x={x + 6} y={PAD + 8} width={w - 12} height={H - 16} rx={4} fill={finish.rocker} stroke={ink} strokeOpacity={0.25} />
          <line x1={x + 9} y1={cy} x2={x + w - 9} y2={cy} stroke={ink} strokeOpacity={0.35} />
          <circle cx={cx} cy={PAD + 16} r={1.8} fill={led} />
          {id === "switch-2way" && <path d={`M ${cx - 5} ${cy + 14} h10 M ${cx + 2} ${cy + 11} l3 3 -3 3`} stroke={ink} fill="none" strokeWidth={1.2} />}
        </g>
      );
    case "bell-push":
      return (
        <g>
          <circle cx={cx} cy={cy} r={12} fill={finish.rocker} stroke={ink} strokeOpacity={0.3} />
          <path d={`M ${cx - 4} ${cy + 3} q0 -8 4 -8 q4 0 4 8 z M ${cx - 1.5} ${cy + 5} h3`} stroke={ink} fill="none" strokeWidth={1.2} />
        </g>
      );
    case "socket":
      // Round three-pin socket face.
      return (
        <g>
          <circle cx={cx} cy={cy} r={24} fill={finish.rocker} stroke={ink} strokeOpacity={0.25} />
          <circle cx={cx} cy={cy - 9} r={3.2} fill={ink} />
          <circle cx={cx - 8} cy={cy + 6} r={2.6} fill={ink} />
          <circle cx={cx + 8} cy={cy + 6} r={2.6} fill={ink} />
        </g>
      );
    case "usb-charger":
      return (
        <g>
          <rect x={x + 8} y={PAD + 12} width={w - 16} height={H - 24} rx={5} fill={finish.rocker} stroke={ink} strokeOpacity={0.25} />
          <rect x={cx - 6} y={cy - 12} width={12} height={5} rx={1} fill={ink} />
          <rect x={cx - 5} y={cy + 6} width={10} height={4} rx={2} fill={ink} />
        </g>
      );
    case "dimmer":
    case "fan-regulator":
      return (
        <g>
          <circle cx={cx} cy={cy} r={14} fill={finish.rocker} stroke={ink} strokeOpacity={0.3} />
          <line x1={cx} y1={cy - 12} x2={cx} y2={cy - 6} stroke={ink} strokeWidth={2} strokeLinecap="round" />
          {id === "fan-regulator" ? (
            <path d={`M ${cx} ${cy + 3} l-5 4 M ${cx} ${cy + 3} l5 4 M ${cx} ${cy + 3} v-6`} stroke={ink} strokeWidth={1.2} transform={`translate(0 2)`} />
          ) : (
            <path d={`M ${cx - 7} ${cy + 8} q7 -6 14 0`} stroke={ink} fill="none" strokeWidth={1.2} />
          )}
        </g>
      );
    default:
      return <rect x={x + 6} y={PAD + 8} width={w - 12} height={H - 16} rx={4} fill="none" stroke={ink} strokeOpacity={0.12} />;
  }
}

export function PlatePreview({ size, placed, finish }: { size: number; placed: PlacedModule[]; finish: ConfiguratorFinish }) {
  const width = size * M + PAD * 2;
  const height = H + PAD * 2;
  const metal = finish.metalness > 0.5;
  // Unique SVG ids: the plate can appear more than once on a page.
  const uid = useId().replace(/:/g, "");
  const sheen = `cfg-sheen-${uid}`;
  const shadow = `cfg-shadow-${uid}`;

  let x = PAD;
  const items = placed.map((p) => {
    const m = moduleById(p.moduleId);
    const w = (m?.slots ?? 1) * M;
    const item = { uid: p.uid, id: p.moduleId, x, w };
    x += w;
    return item;
  });
  const free = size - usedSlots(placed);
  const blanks = Array.from({ length: Math.max(0, free) }, (_, i) => ({ uid: `blank-${i}`, id: "blank", x: x + i * M, w: M }));

  return (
    <svg viewBox={`-20 -20 ${width + 40} ${height + 40}`} className="h-auto w-full" role="presentation">
      <defs>
        <linearGradient id={sheen} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity={metal ? 0.5 : 0.18} />
          <stop offset="0.55" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.2" />
        </linearGradient>
        <filter id={shadow} x="-20%" y="-30%" width="140%" height="170%">
          <feDropShadow dx="0" dy="10" stdDeviation="9" floodColor="#000" floodOpacity="0.45" />
        </filter>
      </defs>
      <g filter={`url(#${shadow})`}>
        <rect width={width} height={height} rx={14} fill={finish.plate} style={{ transition: "fill 400ms" }} />
      </g>
      <rect width={width} height={height} rx={14} fill={`url(#${sheen})`} />
      <rect x={PAD - 3} y={PAD - 3} width={size * M + 6} height={H + 6} rx={6} fill="#000" fillOpacity={0.35} />
      {[...items, ...blanks].map((it) => (
        <g key={it.uid}>
          <rect x={it.x + 1} y={PAD} width={it.w - 2} height={H} rx={4} fill={finish.plate} />
          <rect x={it.x + 1} y={PAD} width={it.w - 2} height={H} rx={4} fill={`url(#${sheen})`} opacity={0.6} />
          <ModuleGlyph id={it.id} x={it.x} w={it.w} finish={finish} />
        </g>
      ))}
    </svg>
  );
}
