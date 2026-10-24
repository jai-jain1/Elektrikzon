import type { RoomKey } from "@/components/lightlab/LightLab";

// SVG room drawn in neutral tones, then "lit" by colour and brightness layers.
// Illustration only.

const T = "opacity 450ms cubic-bezier(0.22,1,0.36,1), fill 450ms";

function Furniture({ room }: { room: RoomKey }) {
  const dark = "#2a2a29";
  const mid = "#4a4a48";
  const light = "#6b6b69";
  switch (room) {
    case "bedroom":
      return (
        <g>
          <rect x="250" y="250" width="300" height="40" rx="8" fill={mid} />
          <rect x="230" y="285" width="340" height="80" rx="10" fill={light} />
          <rect x="250" y="270" width="80" height="26" rx="8" fill="#8b8b89" />
          <rect x="470" y="270" width="80" height="26" rx="8" fill="#8b8b89" />
          <rect x="230" y="355" width="340" height="25" rx="4" fill={dark} />
          <rect x="600" y="315" width="60" height="65" rx="4" fill={mid} />
          <path d="M615 315 l15 -45 l15 45 z" fill="#8b8b89" />
        </g>
      );
    case "kitchen":
      return (
        <g>
          <rect x="140" y="150" width="520" height="70" rx="4" fill={mid} />
          {[0, 1, 2, 3].map((i) => (
            <line key={i} x1={140 + 130 * (i + 1)} y1="150" x2={140 + 130 * (i + 1)} y2="220" stroke={dark} />
          ))}
          <rect x="120" y="290" width="560" height="14" rx="3" fill="#8b8b89" />
          <rect x="130" y="304" width="540" height="76" fill={light} />
          {[0, 1, 2, 3].map((i) => (
            <line key={i} x1={130 + 135 * (i + 1)} y1="304" x2={130 + 135 * (i + 1)} y2="380" stroke={dark} />
          ))}
          <rect x="300" y="262" width="70" height="28" rx="6" fill={dark} />
        </g>
      );
    case "office":
      return (
        <g>
          <rect x="230" y="285" width="340" height="14" rx="3" fill="#8b8b89" />
          <rect x="250" y="299" width="12" height="81" fill={dark} />
          <rect x="538" y="299" width="12" height="81" fill={dark} />
          <rect x="340" y="215" width="120" height="70" rx="4" fill={dark} />
          <rect x="390" y="285" width="20" height="2" fill={dark} />
          <rect x="300" y="320" width="70" height="60" rx="10" fill={mid} />
          <rect x="610" y="200" width="70" height="180" rx="4" fill={mid} />
        </g>
      );
    case "bathroom":
      return (
        <g>
          <rect x="300" y="130" width="200" height="130" rx="60" fill="#7d8a90" opacity="0.6" />
          <rect x="260" y="290" width="280" height="16" rx="4" fill="#8b8b89" />
          <rect x="275" y="306" width="250" height="74" rx="4" fill={mid} />
          <ellipse cx="400" cy="296" rx="50" ry="8" fill={dark} />
        </g>
      );
    default:
      return (
        <g>
          <rect x="230" y="270" width="340" height="70" rx="20" fill={mid} />
          <rect x="210" y="300" width="380" height="60" rx="18" fill={light} />
          <rect x="200" y="285" width="40" height="80" rx="14" fill={mid} />
          <rect x="560" y="285" width="40" height="80" rx="14" fill={mid} />
          <rect x="240" y="360" width="10" height="20" fill={dark} />
          <rect x="550" y="360" width="10" height="20" fill={dark} />
          <rect x="300" y="150" width="200" height="90" rx="3" fill="none" stroke="#8b8b89" strokeWidth="4" />
          <rect x="630" y="320" width="50" height="60" rx="4" fill={mid} />
          <path d="M140 380 q-10 -60 10 -110 q20 50 10 110 z M150 380 q20 -70 45 -90 q-5 60 -25 90 z" fill="#3d4a3a" />
        </g>
      );
  }
}

export function RoomScene({ room, rgb, brightness }: { room: RoomKey; rgb: [number, number, number]; brightness: number }) {
  const c = `rgb(${rgb.join(",")})`;
  const b = brightness / 100;
  const pendant = room === "living" || room === "kitchen" || room === "office";

  return (
    <svg viewBox="0 0 800 500" className="h-full w-full" preserveAspectRatio="xMidYMid slice" role="presentation">
      <defs>
        <linearGradient id="ll-cove" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c} stopOpacity="0.95" />
          <stop offset="1" stopColor={c} stopOpacity="0" />
        </linearGradient>
        <radialGradient id="ll-pool" cx="0.5" cy="0.25" r="0.7">
          <stop offset="0" stopColor={c} stopOpacity="0.85" />
          <stop offset="1" stopColor={c} stopOpacity="0" />
        </radialGradient>
        <linearGradient id="ll-cone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c} stopOpacity="0.55" />
          <stop offset="1" stopColor={c} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ll-window" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a2440" />
          <stop offset="1" stopColor="#0d1222" />
        </linearGradient>
      </defs>

      {/* Base room in neutral tones */}
      <rect width="800" height="500" fill="#9b9b99" />
      <rect y="0" width="800" height="44" fill="#b6b6b4" />
      <rect y="380" width="800" height="120" fill="#5c5c5a" />
      <rect x="40" y="100" width="130" height="190" rx="3" fill="url(#ll-window)" />
      <line x1="105" y1="100" x2="105" y2="290" stroke="#5c5c5a" strokeWidth="4" />
      <Furniture room={room} />
      {pendant && (
        <g>
          <line x1="560" y1="44" x2="560" y2="120" stroke="#2a2a29" strokeWidth="2" />
          <path d="M530 140 q30 -35 60 0 z" fill="#2a2a29" />
        </g>
      )}
      {[200, 400, 600].map((x) => (
        <rect key={x} x={x - 14} y="40" width="28" height="5" rx="2" fill="#e8e3d9" />
      ))}

      {/* Colour of the light */}
      <rect width="800" height="500" fill={c} style={{ mixBlendMode: "multiply", opacity: 0.6, transition: T }} />
      {/* Brightness: darken the whole room */}
      <rect width="800" height="500" fill="#060509" style={{ opacity: (1 - b) * 0.82, transition: T }} />

      {/* Light sources */}
      <g style={{ mixBlendMode: "screen", opacity: 0.25 + b * 0.75, transition: T }}>
        <rect y="44" width="800" height="90" fill="url(#ll-cove)" opacity="0.6" />
        <rect y="40" width="800" height="4" fill={c} />
        {[200, 400, 600].map((x) => (
          <path key={x} d={`M${x - 12} 45 L${x - 90} 380 L${x + 90} 380 L${x + 12} 45 Z`} fill="url(#ll-cone)" opacity="0.5" />
        ))}
        {pendant && <ellipse cx="560" cy="170" rx="140" ry="90" fill="url(#ll-pool)" opacity="0.7" />}
        {pendant && <ellipse cx="560" cy="140" rx="24" ry="6" fill={c} />}
      </g>
    </svg>
  );
}
