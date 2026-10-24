import Image from "next/image";
import type { Shot, ShotKind } from "@/data/shots";

// Placeholder line art per subject, drawn very faintly.
function Glyph({ kind }: { kind: ShotKind }) {
  const p = { fill: "none", stroke: "currentColor", strokeWidth: 1.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (kind) {
    case "plate":
      return (
        <g {...p}>
          <rect x="34" y="22" width="52" height="76" rx="8" />
          <rect x="46" y="38" width="28" height="44" rx="3" />
          <line x1="48" y1="60" x2="72" y2="60" />
        </g>
      );
    case "room":
      return (
        <g {...p}>
          <path d="M14 34 H106 M14 86 H106" />
          <rect x="34" y="62" width="52" height="16" rx="5" />
          <path d="M28 42 h24 M68 42 h24" />
        </g>
      );
    case "light":
      return (
        <g {...p}>
          <ellipse cx="60" cy="40" rx="20" ry="6" />
          <path d="M44 44 L30 92 M76 44 L90 92" opacity="0.5" />
        </g>
      );
    case "wire":
      return (
        <g {...p}>
          <circle cx="44" cy="62" r="18" />
          <circle cx="44" cy="62" r="10" />
          <circle cx="78" cy="62" r="18" />
          <circle cx="78" cy="62" r="10" />
        </g>
      );
    case "mcb":
      return (
        <g {...p}>
          {[0, 1, 2, 3].map((i) => (
            <rect key={i} x={26 + i * 18} y="38" width="14" height="44" rx="2" />
          ))}
        </g>
      );
    case "fan":
      return (
        <g {...p}>
          <circle cx="60" cy="60" r="6" />
          <path d="M60 54 Q64 30 60 18 M65 63 Q86 72 96 80 M55 63 Q34 72 24 80" />
        </g>
      );
    case "smart":
      return (
        <g {...p}>
          <rect x="34" y="26" width="52" height="68" rx="6" />
          <circle cx="60" cy="48" r="4" />
          <circle cx="60" cy="72" r="4" />
        </g>
      );
    default:
      return (
        <g {...p}>
          <rect x="22" y="26" width="76" height="68" rx="3" />
          <path d="M34 44 h30 M34 56 h44 M34 68 h22" />
        </g>
      );
  }
}

interface Props {
  shot: Shot;
  sizes: string;
  priority?: boolean;
  className?: string;
  /** Placeholder tone: "lit" lifts the frame (used for the lights-on state). */
  tone?: "dark" | "lit";
  hideLabel?: boolean;
}

/**
 * A photography slot. Shows the image from /public/shots when it exists,
 * otherwise an understated placeholder frame labelled [ADD: Higgsfield shot …].
 * Always fills its (relative, sized) parent.
 */
export function ShotImage({ shot, sizes, priority, className = "", tone = "dark", hideLabel }: Props) {
  if (shot.src) {
    return <Image src={shot.src} alt={shot.alt} fill sizes={sizes} priority={priority} quality={82} className={`object-cover ${className}`} />;
  }

  const lit = tone === "lit";
  return (
    <div
      role="img"
      aria-label={shot.alt}
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{
        background: lit
          ? "radial-gradient(ellipse at 50% 20%, #5b5a58 0%, #2a2a2c 45%, #111112 100%)"
          : "radial-gradient(ellipse at 50% 30%, #1f1f21 0%, #0b0b0c 60%, #000 100%)",
      }}
    >
      <svg viewBox="0 0 120 120" className={`absolute left-1/2 top-1/2 h-[38%] max-h-48 w-auto -translate-x-1/2 -translate-y-1/2 ${lit ? "text-white/25" : "text-white/[0.12]"}`} aria-hidden="true">
        <Glyph kind={shot.kind} />
      </svg>
      {!hideLabel && (
        <span className="absolute bottom-3 left-3 rounded-full border border-dashed border-white/20 bg-black/40 px-2.5 py-1 text-[0.65rem] text-white/60 backdrop-blur">
          [ADD: Higgsfield shot · {shot.id}]
        </span>
      )}
    </div>
  );
}
