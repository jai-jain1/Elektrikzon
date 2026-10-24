"use client";

import { useCallback } from "react";
import { translations, type TKey } from "@/data/translations";
import { useLang } from "@/lib/prefs";

/** Returns t(key) for the current language, falling back to English. */
export function useT() {
  const lang = useLang();
  return useCallback((key: TKey) => translations[lang][key] || translations.en[key], [lang]);
}

/** Fills {name} slots in a translated string. */
export function fmt(template: string, vars: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (_, k: string) => vars[k] ?? "");
}
