import type { QuoteItem } from "@/lib/quote";

// WhatsApp message builder. Messages are always in English so the shop
// reads every quote the same way. Product IDs let staff find exact items.

interface MessageOptions {
  name?: string;
  area?: string;
  source: string;
}

export function buildQuoteMessage(items: QuoteItem[], { name, area, source }: MessageOptions): string {
  const lines: string[] = ["Hello ElektrikZone, I’d like a quote for:", ""];

  items.forEach((item, i) => {
    const n = `${i + 1}.`;
    if (item.kind === "product") {
      const finish = item.finish ? `, ${item.finish}` : "";
      lines.push(`${n} ${item.title}${finish} × ${item.qty}`);
      if (item.productId) lines.push(`    ID: ${item.productId}`);
    } else if (item.kind === "config") {
      lines.push(`${n} ${item.title} × ${item.qty}`);
      if (item.detail) lines.push(`    ${item.detail}`);
    } else {
      lines.push(`${n} ${item.title}`);
      if (item.detail) lines.push(`    ${item.detail}`);
    }
  });

  lines.push("");
  if (name?.trim()) lines.push(`Name: ${name.trim()}`);
  if (area?.trim()) lines.push(`Site / area: ${area.trim()}`);
  lines.push("Please share trade prices and availability.");
  lines.push(`Ref: EZ-${source.toUpperCase()}`);

  return lines.join("\n");
}

/** One-product enquiry, used by “Ask about this on WhatsApp”. */
export function buildProductMessage(title: string, productId: string, source: string, finish?: string): string {
  return [
    `Hello ElektrikZone, I’d like the trade price and availability for:`,
    `${title}${finish ? `, ${finish}` : ""}`,
    `ID: ${productId}`,
    "",
    `Ref: EZ-${source.toUpperCase()}`,
  ].join("\n");
}
