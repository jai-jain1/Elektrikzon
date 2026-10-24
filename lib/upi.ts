/**
 * UPI deep link (the same format every UPI app understands, and what the
 * QR code encodes). The amount is fixed so the customer can’t mistype it.
 */
export function buildUpiLink({ vpa, payee, amount, orderId }: { vpa: string; payee: string; amount: number; orderId: string }) {
  const params = new URLSearchParams({
    pa: vpa,
    pn: payee,
    am: amount.toFixed(2),
    cu: "INR",
    tn: `ElektrikZone order ${orderId}`,
    tr: orderId,
  });
  // URLSearchParams encodes spaces as "+", which some UPI apps show literally.
  return `upi://pay?${params.toString().replace(/\+/g, "%20")}`;
}

/** Short, readable order number, e.g. EZ-261024-K7Q3. */
export function newOrderId(date = new Date()) {
  const yy = String(date.getFullYear()).slice(2);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O, 1/I
  let tail = "";
  for (let i = 0; i < 4; i++) tail += alphabet[Math.floor(Math.random() * alphabet.length)];
  return `EZ-${yy}${mm}${dd}-${tail}`;
}
