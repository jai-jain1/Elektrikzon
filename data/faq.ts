import type { Lang } from "@/types/catalog";
import type { SiteSettings } from "@/types/settings";

/**
 * FAQ content. {tokens} are filled from Site settings. When a token's value
 * is missing, the page shows an [ADD: ...] placeholder and that question is
 * left out of the FAQPage structured data (placeholders never reach Google).
 */
interface FaqItem {
  id: string;
  q: Record<Lang, string>;
  a: Record<Lang, string>;
}

export const FAQ: FaqItem[] = [
  {
    id: "prices",
    q: { en: "Why do some products have no price?", hi: "कुछ प्रोडक्ट की कीमत क्यों नहीं दिखती?" },
    a: {
      en: "Products with a price can be bought online and paid for by UPI. Trade prices for other products depend on brand, quantity and current stock, so we quote them on request: add them to your list and send it on WhatsApp.",
      hi: "जिन प्रोडक्ट की कीमत दिखती है, उन्हें ऑनलाइन खरीदकर UPI से पे कर सकते हैं। बाकी प्रोडक्ट का ट्रेड प्राइस ब्रांड, मात्रा और स्टॉक पर निर्भर करता है, इसलिए हम पूछने पर बताते हैं: उन्हें लिस्ट में जोड़ें और WhatsApp पर भेजें।",
    },
  },
  {
    id: "colour",
    q: { en: "Warm, neutral or cool white: which should I choose?", hi: "वॉर्म, न्यूट्रल या कूल व्हाइट: कौन-सा चुनें?" },
    a: {
      en: "Warm white (about 3000 K) feels relaxed and suits living rooms and bedrooms. Neutral white (about 4000 K) suits kitchens and work areas. Cool white (about 6500 K) looks the crispest and is common in shops and utility areas. You can compare all three in the Light Lab.",
      hi: "वॉर्म व्हाइट (लगभग 3000 K) आरामदायक लगता है और लिविंग रूम व बेडरूम के लिए अच्छा है। न्यूट्रल व्हाइट (लगभग 4000 K) किचन और काम की जगहों के लिए ठीक है। कूल व्हाइट (लगभग 6500 K) सबसे तेज़ दिखता है और दुकानों व यूटिलिटी एरिया में आम है। तीनों को लाइट लैब में देखकर तुलना करें।",
    },
  },
  {
    id: "quote",
    q: { en: "How do I get a quote?", hi: "कोटेशन कैसे मिलेगा?" },
    a: {
      en: "Add lights or a Light Lab brief to your list, then press “Send list on WhatsApp”. The message includes product IDs so we can find each item. We usually reply {reply}.",
      hi: "लाइट या लाइट लैब का ब्रीफ़ अपनी लिस्ट में जोड़ें, फिर “लिस्ट WhatsApp पर भेजें” दबाएँ। मैसेज में प्रोडक्ट ID होते हैं ताकि हम हर आइटम ढूँढ सकें। हम आम तौर पर {reply} जवाब देते हैं।",
    },
  },
  {
    id: "who",
    q: { en: "Do you sell to homeowners as well as contractors?", hi: "क्या आप घर के मालिकों और कॉन्ट्रैक्टर्स दोनों को बेचते हैं?" },
    a: {
      en: "Yes. ElektrikZone is wholesale and retail, so you can buy for a single room or for a whole project.",
      hi: "हाँ। ElektrikZone होलसेल और रिटेल दोनों है, इसलिए आप एक कमरे के लिए या पूरे प्रोजेक्ट के लिए ख़रीद सकते हैं।",
    },
  },
  {
    id: "brands",
    q: { en: "Which brands do you stock?", hi: "आप कौन-से ब्रांड रखते हैं?" },
    a: { en: "We currently stock: {brands}.", hi: "हम अभी ये ब्रांड रखते हैं: {brands}।" },
  },
  {
    id: "delivery",
    q: { en: "Do you deliver?", hi: "क्या आप डिलीवरी करते हैं?" },
    a: { en: "{delivery} Areas: {areas}.", hi: "{delivery} एरिया: {areas}।" },
  },
  {
    id: "visit",
    q: { en: "Can I visit the shop?", hi: "क्या मैं दुकान पर आ सकता हूँ?" },
    a: {
      en: "Yes, the shop is in Ulhasnagar, Maharashtra. Address: {address}. Opening hours: {hours}.",
      hi: "हाँ, दुकान उल्हासनगर, महाराष्ट्र में है। पता: {address}। समय: {hours}।",
    },
  },
  {
    id: "sample",
    q: { en: "What does “Sample listing” mean?", hi: "“सैंपल लिस्टिंग” का क्या मतलब है?" },
    a: {
      en: "It marks a listing that shows the kind of product we supply but is not yet a confirmed item. Ask us on WhatsApp for current stock and exact specifications.",
      hi: "यह उस लिस्टिंग को दिखाता है जो बताती है कि हम किस तरह का प्रोडक्ट सप्लाई करते हैं, लेकिन अभी पक्का आइटम नहीं है। मौजूदा स्टॉक और सही स्पेसिफ़िकेशन के लिए WhatsApp पर पूछें।",
    },
  },
  {
    id: "privacy",
    q: { en: "Is my information stored on this website?", hi: "क्या मेरी जानकारी इस वेबसाइट पर सेव होती है?" },
    a: {
      en: "No. Your quote list stays in your own browser. Your name, site and list are only sent when you choose to send the WhatsApp message.",
      hi: "नहीं। आपकी कोटेशन लिस्ट आपके अपने ब्राउज़र में रहती है। आपका नाम, साइट और लिस्ट तभी जाते हैं जब आप ख़ुद WhatsApp मैसेज भेजते हैं।",
    },
  },
  {
    id: "safety",
    q: { en: "Do you install the lights?", hi: "क्या आप लाइट लगाते भी हैं?" },
    a: {
      en: "We supply the lights. Installation should always be done by a qualified electrician. Contractors can ask us about a trade account.",
      hi: "हम लाइट सप्लाई करते हैं। फ़िटिंग हमेशा योग्य इलेक्ट्रीशियन से ही करवाएँ। कॉन्ट्रैक्टर ट्रेड अकाउंट के बारे में पूछ सकते हैं।",
    },
  },
];

const tokenValues = (s: SiteSettings): Record<string, { value: string; label: string }> => ({
  reply: { value: s.quoteResponseTime, label: "quote response time" },
  brands: { value: s.brandsStocked.join(", "), label: "brands stocked" },
  delivery: { value: s.deliveryPromise, label: "delivery promise" },
  areas: { value: s.deliveryAreas.join(", "), label: "delivery areas" },
  address: { value: s.address, label: "shop address" },
  hours: { value: s.openingHours, label: "opening hours" },
});

export interface FilledFaq {
  id: string;
  question: string;
  answer: string;
  /** False when any token was missing (answer contains a placeholder). */
  complete: boolean;
}

export function fillFaq(s: SiteSettings, lang: Lang): FilledFaq[] {
  const values = tokenValues(s);
  return FAQ.map((item) => {
    let complete = true;
    const answer = item.a[lang].replace(/\{(\w+)\}/g, (_, key: string) => {
      const v = values[key];
      if (v && v.value.trim()) return v.value.trim();
      complete = false;
      return `[ADD: ${v?.label ?? key}]`;
    });
    return { id: item.id, question: item.q[lang], answer, complete };
  });
}

/** FAQPage JSON-LD with only fully answered questions (English). */
export function faqJsonLd(s: SiteSettings) {
  const items = fillFaq(s, "en").filter((f) => f.complete);
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}
