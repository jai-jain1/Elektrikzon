/** ElektrikZone mark: a downlight and its beam, plus wordmark. */
export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" focusable="false">
      <rect x="2.5" y="2.5" width="27" height="27" rx="7" fill="none" stroke="currentColor" strokeWidth="1.6" opacity="0.9" />
      <circle cx="16" cy="11.4" r="3" fill="rgb(var(--fg))" />
      <path d="M12.6 17.2 9.8 24M19.4 17.2 22.2 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" opacity="0.55" />
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
