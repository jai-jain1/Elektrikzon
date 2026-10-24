// Small inline icons for the Studio menu (no extra icon package needed).
const s = { width: "1em", height: "1em", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export const SettingsIcon = () => (
  <svg {...s}>
    <circle cx="12" cy="12" r="3" />
    <path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8" />
  </svg>
);

export const FolderIcon = () => (
  <svg {...s}>
    <path d="M3.5 7.5a2 2 0 0 1 2-2h4l2 2h7a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z" />
  </svg>
);

export const SubfolderIcon = () => (
  <svg {...s}>
    <path d="M5 4v10a2 2 0 0 0 2 2h12M15 12l4 4-4 4" />
  </svg>
);

export const TagIcon = () => (
  <svg {...s}>
    <path d="M3.5 12.5V4.5a1 1 0 0 1 1-1h8l8 8-9 9z" />
    <circle cx="8" cy="8" r="1.4" />
  </svg>
);

export const BoxIcon = () => (
  <svg {...s}>
    <path d="M3.5 7.5L12 3l8.5 4.5v9L12 21l-8.5-4.5z" />
    <path d="M3.5 7.5L12 12l8.5-4.5M12 12v9" />
  </svg>
);

export const PlayIcon = () => (
  <svg {...s}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="4" />
    <path d="M10 8.5v7l5.5-3.5z" />
  </svg>
);

export const InfoIcon = () => (
  <svg {...s}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 11v5M12 8h.01" />
  </svg>
);
