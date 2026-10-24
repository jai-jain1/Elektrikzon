"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { useIsLite } from "@/lib/prefs";

/**
 * Apple-style entrance: content rises 28px and fades in once, the first
 * time it scrolls into view. Plain content in Lite mode / reduced motion.
 */
export function Reveal({ children, delay = 0, className = "", as = "div" }: { children: ReactNode; delay?: number; className?: string; as?: "div" | "section" | "li" }) {
  const lite = useIsLite();
  if (lite) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }
  const M = motion[as];
  return (
    <M
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </M>
  );
}
