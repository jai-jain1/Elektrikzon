const inr = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

/** ₹1,299 style formatting for whole rupees. */
export const formatINR = (n: number) => inr.format(Math.round(n));
