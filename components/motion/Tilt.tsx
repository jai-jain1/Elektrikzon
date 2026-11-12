"use client";

import { useRef, type ReactNode } from "react";
import { useIsLite } from "@/lib/prefs";

/**
 * Tilts its content a few degrees towards the mouse, like a card held in the
 * hand. Mouse only; touch screens and Lite mode get the plain content.
 */
export function Tilt({ children, className = "", max = 7 }: { children: ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const lite = useIsLite();

  const set = (rx: number, ry: number) => {
    const el = ref.current;
    if (el) el.style.transform = `perspective(900px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
  };

  return (
    <div
      ref={ref}
      className={`transition-transform duration-300 ease-film will-change-transform ${className}`}
      onPointerMove={(e) => {
        if (lite || e.pointerType !== "mouse" || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        set(-y * max, x * max);
      }}
      onPointerLeave={() => set(0, 0)}
    >
      {children}
    </div>
  );
}
