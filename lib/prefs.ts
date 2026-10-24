"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Lang } from "@/types/catalog";
import { PREFS_KEY, safeJSONStorage } from "@/lib/storage";

export type Theme = "dark" | "light";
/** "auto" follows device capability and prefers-reduced-motion. */
export type LiteMode = "auto" | "on" | "off";

interface PrefsState {
  lang: Lang;
  theme: Theme;
  liteMode: LiteMode;
  /** Detected on the client; not persisted. */
  autoLite: boolean;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  toggleTheme: () => void;
  toggleLite: () => void;
  setAutoLite: (v: boolean) => void;
}

export const usePrefs = create<PrefsState>()(
  persist(
    (set, get) => ({
      lang: "en",
      theme: "dark",
      liteMode: "auto",
      autoLite: false,
      setLang: (lang) => set({ lang }),
      toggleLang: () => set({ lang: get().lang === "en" ? "hi" : "en" }),
      toggleTheme: () => set({ theme: get().theme === "dark" ? "light" : "dark" }),
      toggleLite: () => set({ liteMode: isLite(get()) ? "off" : "on" }),
      setAutoLite: (autoLite) => set({ autoLite }),
    }),
    {
      name: PREFS_KEY,
      storage: safeJSONStorage,
      // Rehydrated in <Providers> after mount to avoid hydration mismatches.
      skipHydration: true,
      partialize: (s) => ({ lang: s.lang, theme: s.theme, liteMode: s.liteMode }),
    },
  ),
);

function isLite(s: Pick<PrefsState, "liteMode" | "autoLite">) {
  return s.liteMode === "on" || (s.liteMode === "auto" && s.autoLite);
}

/** True when 3D and decorative motion should be replaced by SVG/CSS. */
export function useIsLite() {
  return usePrefs(isLite);
}

export function useLang() {
  return usePrefs((s) => s.lang);
}
