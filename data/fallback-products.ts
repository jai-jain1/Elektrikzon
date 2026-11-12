import type { Category, Product, Subcategory } from "@/types/catalog";

/**
 * Fallback catalogue used when Sanity is empty or unreachable, so the site
 * always builds and renders. It mirrors seed/lighting.ndjson: the eight
 * types of light and one sample product in each. Every product is
 * sample:true, has no images, no brand, no price and no claims. Values that
 * need the owner's confirmation are marked [ADD: confirm].
 */

const category = (order: number, slug: string, title: string, titleHi: string, description: string, descriptionHi: string): Category => ({
  id: `category-${slug}`,
  slug,
  title,
  titleHi,
  description,
  descriptionHi,
  order,
});

export const FALLBACK_CATEGORIES: Category[] = [
  category(1, "panel-lights", "Panel Lights", "पैनल लाइट", "Slim and surface panels, round and square, for even everyday light.", "स्लिम और सरफ़ेस पैनल, गोल और चौकोर, रोज़ की एकसार रोशनी के लिए।"),
  category(2, "cob-and-downlights", "COB and Downlights", "COB और डाउनलाइट", "Recessed COB spots and downlights for crisp pools of light.", "रिसेस्ड COB स्पॉट और डाउनलाइट, साफ़ और फ़ोकस्ड रोशनी के लिए।"),
  category(3, "strip-lights", "Strip Lights", "स्ट्रिप लाइट", "LED strips for coves, shelves and under-cabinet glow.", "कोव, शेल्फ़ और कैबिनेट के नीचे की रोशनी के लिए LED स्ट्रिप।"),
  category(4, "rope-lights", "Rope Lights", "रोप लाइट", "Flexible rope lights for outlines, facades and festive lighting.", "आउटलाइन, बिल्डिंग के बाहर और त्योहार की सजावट के लिए फ़्लेक्सिबल रोप लाइट।"),
  category(5, "profile-lights", "Profile Lights", "प्रोफ़ाइल लाइट", "Aluminium profiles and linear lights for clean lines of light.", "रोशनी की साफ़ लाइनों के लिए एल्युमिनियम प्रोफ़ाइल और लीनियर लाइट।"),
  category(6, "track-and-spot-lights", "Track and Spot Lights", "ट्रैक और स्पॉट लाइट", "Adjustable track heads and spots for shops, displays and art.", "दुकान, डिस्प्ले और आर्ट के लिए घूमने वाली ट्रैक और स्पॉट लाइट।"),
  category(7, "outdoor-and-flood-lights", "Outdoor and Flood Lights", "आउटडोर और फ़्लड लाइट", "Flood, gate and garden lights for outdoor use.", "बाहर के इस्तेमाल के लिए फ़्लड, गेट और गार्डन लाइट।"),
  category(8, "drivers-and-accessories", "Drivers and Accessories", "ड्राइवर और एक्सेसरीज़", "LED drivers, power supplies, connectors and controllers.", "LED ड्राइवर, पावर सप्लाई, कनेक्टर और कंट्रोलर।"),
];

/** Subcategories are optional; the owner adds them in the Studio if needed. */
export const FALLBACK_SUBCATEGORIES: Subcategory[] = [];

const cat = (slug: string) => {
  const c = FALLBACK_CATEGORIES.find((x) => x.slug === slug)!;
  return { slug: c.slug, title: c.title, titleHi: c.titleHi };
};

const CONFIRM = "[ADD: confirm]";
const NOTE = "Check availability on WhatsApp";
const SAMPLE_NOTE = "Sample listing. Replace with the real product details in the Studio.";

const sample = (id: string, name: string, nameHi: string, categorySlug: string, use: Product["use"], specLabels: string[], featured: boolean): Product => ({
  id,
  name,
  nameHi,
  category: cat(categorySlug),
  lightColours: [],
  bodyColours: [],
  use,
  specs: specLabels.map((label) => ({ label, value: CONFIRM })),
  description: SAMPLE_NOTE,
  images: [],
  featured,
  sample: true,
  inStockNote: NOTE,
});

export const FALLBACK_PRODUCTS: Product[] = [
  sample("led-panel-light", "LED Panel Light", "LED पैनल लाइट", "panel-lights", ["Living room", "Kitchen", "Office"], ["Wattage", "Size", "Light colour"], true),
  sample("led-downlight", "COB Downlight", "COB डाउनलाइट", "cob-and-downlights", ["Living room", "Bedroom", "Commercial"], ["Wattage", "Cut-out size", "Beam angle"], true),
  sample("cove-strip-light", "LED Strip Light", "LED स्ट्रिप लाइट", "strip-lights", ["Living room", "Bedroom", "Kitchen"], ["Length per roll", "LEDs per metre", "Voltage"], true),
  sample("led-rope-light", "LED Rope Light", "LED रोप लाइट", "rope-lights", ["Outdoor", "Commercial"], ["Length per roll", "Light colour", "Voltage"], true),
  sample("aluminium-profile-light", "Aluminium Profile Light", "एल्युमिनियम प्रोफ़ाइल लाइट", "profile-lights", ["Living room", "Kitchen", "Office"], ["Profile length", "Diffuser", "Body colour"], false),
  sample("track-light", "Track Light", "ट्रैक लाइट", "track-and-spot-lights", ["Commercial", "Living room"], ["Wattage", "Beam angle", "Body colour"], false),
  sample("led-flood-light", "LED Flood Light", "LED फ़्लड लाइट", "outdoor-and-flood-lights", ["Outdoor", "Commercial", "Industrial"], ["Wattage", "IP rating", "Light colour"], false),
  sample("led-driver", "LED Driver", "LED ड्राइवर", "drivers-and-accessories", ["Commercial", "Living room"], ["Output", "Suitable for", "Input voltage"], false),
];
