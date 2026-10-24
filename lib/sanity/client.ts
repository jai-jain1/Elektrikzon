// Imported from @sanity/client directly, not the next-sanity barrel:
// that barrel also exports client components, which would ship the whole
// Sanity client to every visitor's browser.
import { createClient, type SanityClient } from "@sanity/client";
import { apiVersion, dataset, isSanityConfigured, projectId } from "@/sanity/env";

/**
 * Read-only client for the website (published content from the CDN).
 * null when no valid project ID is set: callers then use the fallback data.
 */
export const client: SanityClient | null = isSanityConfigured
  ? createClient({ projectId, dataset, apiVersion, useCdn: true, perspective: "published" })
  : null;
