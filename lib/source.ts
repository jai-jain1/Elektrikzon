"use client";

/**
 * Source token: where a visitor came from, added to every WhatsApp quote
 * as “Ref: …” so the shop can see which post or story worked.
 * Links like elektrikzone.in/#ig-reel3, #ig-bio or #ig-story2 set it, and
 * printed QR codes use #qr-counter.
 * Stored for the browser session only; it identifies a link, not a person.
 */
const KEY = "ez-source";
const PATTERN = /^#((?:ig|qr)-[a-z0-9-]{1,32})$/i;

export function captureSource() {
  try {
    const match = window.location.hash.match(PATTERN);
    if (match) window.sessionStorage.setItem(KEY, match[1].toLowerCase());
  } catch {
    /* storage unavailable */
  }
}

export function getSourceToken(): string {
  try {
    return window.sessionStorage.getItem(KEY) || "web";
  } catch {
    return "web";
  }
}
