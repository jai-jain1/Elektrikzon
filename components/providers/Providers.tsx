"use client";

import { createContext, useContext, useEffect, type ReactNode } from "react";
import type { SiteSettings } from "@/types/settings";
import { usePrefs, useIsLite } from "@/lib/prefs";
import { useQuote } from "@/lib/quote";
import { captureSource } from "@/lib/source";

const SettingsContext = createContext<SiteSettings | null>(null);

/** Business details on the client (fetched on the server in the root layout). */
export function useSettings(): SiteSettings {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used inside <Providers>");
  return ctx;
}

/** Detects devices that should start in Lite mode. */
function detectAutoLite(): boolean {
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
    const nav = navigator as Navigator & { deviceMemory?: number; connection?: { saveData?: boolean } };
    if (nav.connection?.saveData) return true;
    if (typeof nav.deviceMemory === "number" && nav.deviceMemory <= 2) return true;
    if (typeof nav.hardwareConcurrency === "number" && nav.hardwareConcurrency <= 2) return true;
  } catch {
    /* ignore */
  }
  return false;
}

export function Providers({ settings, children }: { settings: SiteSettings; children: ReactNode }) {
  const theme = usePrefs((s) => s.theme);
  const lang = usePrefs((s) => s.lang);
  const lite = useIsLite();
  const setAutoLite = usePrefs((s) => s.setAutoLite);

  // Restore saved preferences after the first render (avoids hydration mismatch).
  useEffect(() => {
    void usePrefs.persist.rehydrate();
    void useQuote.persist.rehydrate();
    captureSource();
    setAutoLite(detectAutoLite());
    let mq: MediaQueryList | null = null;
    try {
      mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    } catch {
      return;
    }
    const onChange = () => setAutoLite(detectAutoLite());
    mq.addEventListener("change", onChange);
    return () => mq?.removeEventListener("change", onChange);
  }, [setAutoLite]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = lang === "hi" ? "hi" : "en-IN";
  }, [lang]);

  useEffect(() => {
    document.documentElement.dataset.lite = String(lite);
  }, [lite]);

  return <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>;
}
