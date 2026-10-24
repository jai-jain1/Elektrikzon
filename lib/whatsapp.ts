/** Digits only, with country code. Returns null when not usable. */
export function normaliseWhatsAppNumber(input: string | undefined): string | null {
  const digits = (input ?? "").replace(/\D/g, "");
  return digits.length >= 10 ? digits : null;
}

/**
 * wa.me link with a prefilled message, or null when the WhatsApp number
 * has not been added yet (the UI then shows an [ADD: ...] placeholder).
 */
export function buildWhatsAppUrl(number: string | undefined, message: string): string | null {
  const digits = normaliseWhatsAppNumber(number);
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export const DEFAULT_QUOTE_MESSAGE = "Hello ElektrikZone, I’d like a quote.";
