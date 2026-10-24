import type { QueryParams } from "@sanity/client";
import { client } from "./client";

/** Cache time for catalogue data; the revalidate webhook refreshes sooner. */
export const REVALIDATE_SECONDS = 300;

/** Every Sanity fetch carries this tag so the webhook can refresh all of it. */
export const SANITY_TAG = "sanity";

const warned = new Set<string>();

/** Logs a clear warning once per reason, so build logs stay readable. */
export function warnOnce(key: string, message: string) {
  if (warned.has(key)) return;
  warned.add(key);
  console.warn(`[ElektrikZone] ${message}`);
}

/**
 * Fetches from Sanity with ISR caching. Never throws: returns null when
 * Sanity is not configured, unreachable or errors, so callers can fall back.
 */
export async function sanityFetch<T>(query: string, params: QueryParams = {}, tags: string[] = []): Promise<T | null> {
  if (!client) {
    warnOnce(
      "not-configured",
      "Sanity is not configured (NEXT_PUBLIC_SANITY_PROJECT_ID missing or invalid). Using the fallback catalogue and /data defaults.",
    );
    return null;
  }
  try {
    return await client.fetch<T>(query, params, {
      next: { revalidate: REVALIDATE_SECONDS, tags: [SANITY_TAG, ...tags] },
    });
  } catch (error) {
    warnOnce(`fetch-${tags.join(",")}`, `Sanity request failed (${tags.join(", ") || "query"}); using fallback data. ${String(error)}`);
    return null;
  }
}
