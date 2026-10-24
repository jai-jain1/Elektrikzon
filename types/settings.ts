// Business details. Defaults live in /data/config.ts; from Stage 2 the
// Sanity "Site settings" document overrides any field that is filled in.
// An empty string or empty array means "not provided yet" and the UI shows
// an [ADD: ...] placeholder instead of a value.

export interface SiteSettings {
  businessName: string;
  /** Known facts from the owner's brief. */
  city: string;
  region: string;
  countryCode: string;
  trade: string;

  whatsappNumber: string;
  phone: string;
  email: string;
  address: string;
  postalCode: string;
  mapsUrl: string;
  openingHours: string;
  instagramUrl: string;
  instagramHandle: string;
  gstNumber: string;

  brandsStocked: string[];
  strongestLines: string[];
  deliveryAreas: string[];
  deliveryPromise: string;
  quoteResponseTime: string;

  /** Local MP4 in /public (e.g. "/video/hero.mp4") or a URL; null = 3D/CSS hero. */
  heroVideo: string | null;
  /** Three hero headline options; the first is used. */
  headlines: [string, string, string];
}
