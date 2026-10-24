import type { Lang } from "@/types/catalog";

/**
 * Picks the Hindi value when the site is in Hindi and the Hindi field is
 * filled in; otherwise the English value. Used for Sanity's *Hi fields.
 */
export function localized(lang: Lang, en: string | undefined, hi?: string): string {
  if (lang === "hi" && hi && hi.trim()) return hi;
  return en ?? "";
}
