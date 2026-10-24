// Sanity connection settings, read from .env.local (see .env.example).
// Safe to import from both the website and the Studio.

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID?.trim() || "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET?.trim() || "production";
/** Fixed API date so query behaviour never changes underneath the site. */
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION?.trim() || "2024-10-01";

/**
 * True only for a real-looking project ID (lowercase letters, digits, dashes).
 * Placeholders such as "YOUR_PROJECT_ID" fail this check, so the site uses
 * its fallback catalogue instead of crashing.
 */
export const isSanityConfigured = /^[a-z0-9][a-z0-9-]*$/.test(projectId);
