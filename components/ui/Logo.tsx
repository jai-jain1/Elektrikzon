/** ElektrikZone mark: a switch plate with a lit amber indicator, plus wordmark. */
export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <rect x="2.5" y="2.5" width="27" height="27" rx="7" fill="none" stroke="currentColor" strokeWidth="1.6" opacity="0.9" />
      <rect x="11" y="8" width="10" height="16" rx="2.6" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M11.8 15.2h8.4" stroke="currentColor" strokeWidth="1.2" opacity="0.55" />
      <circle cx="16" cy="11.6" r="1.6" fill="rgb(var(--fg))" />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display text-[1.2rem] font-medium leading-none tracking-[-0.01em] ${className}`}>
      Elektrik<span className="text-muted">Zone</span>
    </span>
  );
}
