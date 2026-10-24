import type { QuoteItem } from "@/lib/quote";
import { formatINR } from "@/lib/money";

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
      const price = typeof item.unitPrice === "number" ? ` @ ${formatINR(item.unitPrice)}` : "";
      lines.push(`${n} ${item.title}${finish} × ${item.qty}${price}`);
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

interface OrderOptions {
  orderId: string;
  name: string;
  pickup: boolean;
  address?: string;
  total: number;
  upiId: string;
  utr?: string;
  source: string;
}

/** Order placed with UPI payment, sent to the shop on WhatsApp for confirmation. */
export function buildOrderMessage(items: QuoteItem[], o: OrderOptions): string {
  const lines: string[] = ["Hello ElektrikZone, I’d like to place an order.", `Order: ${o.orderId}`, ""];
  items.forEach((item, i) => {
    const unit = item.unitPrice ?? 0;
    const finish = item.finish ? `, ${item.finish}` : "";
    lines.push(`${i + 1}. ${item.title}${finish} × ${item.qty} @ ${formatINR(unit)} = ${formatINR(unit * item.qty)}`);
    const meta = [item.productId && `ID: ${item.productId}`, item.offerCampaign && `${item.offerCampaign} price`].filter(Boolean);
    if (meta.length) lines.push(`    ${meta.join(" · ")}`);
  });
  lines.push("", `Total: ${formatINR(o.total)}`, "");
  lines.push(`Name: ${o.name.trim()}`);
  lines.push(o.pickup ? "Pickup from the shop" : `Deliver to: ${o.address?.trim() ?? ""}`);
  lines.push(`Payment: UPI to ${o.upiId}, ${formatINR(o.total)}`);
  lines.push(o.utr?.trim() ? `UPI ref (UTR): ${o.utr.trim()}` : "I’ll share the payment screenshot here.");
  lines.push(`Ref: EZ-${o.source.toUpperCase()}`);
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
