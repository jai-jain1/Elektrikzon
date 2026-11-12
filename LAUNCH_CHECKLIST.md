# ElektrikZone launch checklist

Replace `elektrikzone.in` below with your real domain (or your `.netlify.app` address).

---

## (a) Every placeholder to replace

### In the Studio → Site settings (no code)
| Placeholder on the site | Field |
| --- | --- |
| `[ADD: WhatsApp number]` (all quote buttons greyed out until set) | WhatsApp number, digits only, starting 91 |
| `[ADD: Phone number]` | Phone number |
| `[ADD: Email address]` | Email |
| `[ADD: Shop address]`, PIN code | Shop address, PIN code |
| `[ADD: Google Maps link]` | Google Maps link |
| `[ADD: Opening hours]` | Opening hours |
| `[ADD: Instagram profile URL]` | Instagram profile link + handle |
| `[ADD: GSTIN]` | GSTIN |
| `[ADD: Brands stocked]` | Brands stocked (delete the seeded “[ADD: Brand 1/2]”) |
| `[ADD: Delivery areas]`, `[ADD: Delivery promise]` | Delivery areas, Delivery promise |
| `[ADD: Quote response time]` | Quote response time |
| Checkout shows “Online payment isn’t switched on yet” | UPI ID (and UPI payee name) |
| `[ADD: Delivery charges and pickup timings]` at checkout | Order note |

### In the Studio → Campaigns and offers
| Placeholder | Where |
| --- | --- |
| `[ADD: offer terms…]` | Diwali Lights draft → Offer terms; check dates and offer prices, then Publish |

### In the Studio → Products
| Placeholder | Where |
| --- | --- |
| `[ADD: confirm]` spec values | The 8 sample products: replace with real specs or delete the rows |
| “Sample listing” tags | Switch **Sample listing** OFF on each real product |
| “Photo coming soon” | Upload photos |

### In files (ask a developer, or edit carefully)
| Placeholder | File |
| --- | --- |
| `YOUR_PROJECT_ID` | `.env.local` → `NEXT_PUBLIC_SANITY_PROJECT_ID` (**still not set in this folder**) |
| `http://localhost:3000` | `.env.local` / Vercel → `NEXT_PUBLIC_SITE_URL` (QR code, sitemap, Google data use it) |
| `[ADD: Years in business]` | `components/about/AboutPage.tsx` |
| `[ADD: Shop story…]` | `components/about/AboutPage.tsx` |

---

## (b) First 15 product photos to shoot (priority order)

Shoot on a plain light-grey or white background, daylight, about 1200 px wide, under 500 KB, WebP or JPG. For each: one straight-on shot switched off, and one switched on in a dim room.

1. Your best-selling **slim round panel light**
2. The **square panel** in the same range
3. A **surface panel** (side view shows the thickness)
4. Your best-selling **COB downlight**, front and side (cut-out depth)
5. A **deep / anti-glare COB spot**
6. **LED strip light** on its reel, plus a lit shot in a cove or under a shelf
7. **COB strip** (the dot-free kind), lit close-up
8. **Rope light** coil, plus a lit shot on a balcony or facade
9. **Aluminium profile light** with diffuser, cut end visible
10. A **profile light installed** in a ceiling or wardrobe
11. **Track light** head on its rail
12. **Flood light**, front and back
13. **LED driver / power supply**, with the rating label readable
14. **Connectors and controllers** laid out together
15. **The shop counter / display wall** (for the About and Contact pages)

Category cover photos are optional: each of the eight types already has a rendered picture.

---

## (c) Test checklist

### Phone (Android Chrome and iPhone Safari, ~360–430 px)
- [ ] Homepage loads quickly; no sideways scrolling anywhere
- [ ] Hero: the 3D room starts dark and the lights come on one after another; the five switches and Warm / Neutral / Cool change the room
- [ ] Menu button opens the full-screen menu; Escape/close works; Lite mode switch is there
- [ ] EN / हिं switch changes all interface text; reload keeps the language
- [ ] Catalogue: search, the type-of-light row, Filters button (light colour, wattage, body colour), Add to quote / Add to bag
- [ ] Product page: Share opens the phone share sheet; Copy Instagram caption works
- [ ] Quote list: change quantities, remove; the chosen light colour shows on the line; **Send list on WhatsApp** opens WhatsApp with the numbered list and `Ref: EZ-WEB`
- [ ] Open `…/#ig-reel3`, add a product, send: the message ends `Ref: EZ-IG-REEL3`
- [ ] Open `…/#ig-bio`: quick-links screen appears; “Continue to the full website” closes it
- [ ] Light Lab: switch lights, move both sliders, add the lighting brief to the list
- [ ] Contractors form opens WhatsApp with your details
- [ ] Bottom “Request trade price” bar appears after scrolling and hides over the footer
- [ ] Turn on the phone’s “Reduce motion”: Lite mode switches on by itself and the hero shows the still image

### Tablet (~768–1024 px, portrait and landscape)
- [ ] Catalogue shows 3 columns; filters panel opens and closes
- [ ] Light Lab room and controls sit side by side in landscape
- [ ] Quick view and quote drawer fit the screen and scroll inside

### Desktop (Chrome, Edge, Firefox; 1280 px and wider)
- [ ] Hero: the room shifts slightly as the mouse moves; range tiles tilt under the mouse
- [ ] Product cards lift slightly and the photo zooms gently on hover
- [ ] Keyboard only: Tab through the header, open the menu, toggle the hero light switches (Enter or Space), use filters, open and close the quote drawer (Escape); focus ring always visible
- [ ] After 60 seconds with an empty list, the “Need a price?” nudge appears once
- [ ] Light theme (sun icon) is readable everywhere
- [ ] `/studio` loads, you can log in, publish a change, and see it on the site
- [ ] Check `https://elektrikzone.in/sitemap.xml` and `/robots.txt`
- [ ] Paste a product URL into https://search.google.com/test/rich-results : Product (no price) and Breadcrumb found; homepage shows Store and FAQ

---

## (d) Instagram links

Every link adds a source tag that appears at the end of WhatsApp quotes (`Ref: EZ-…`), so you can see which post brought the enquiry. The tag lasts for that visit.

| Where | Link | Quote shows |
| --- | --- | --- |
| **Bio link** | `https://elektrikzone.in/#ig-bio` (opens the quick-links screen) | `Ref: EZ-IG-BIO` |
| Story 1, 2, 3… (link sticker) | `https://elektrikzone.in/#ig-story1`, `#ig-story2`, `#ig-story3` | `EZ-IG-STORY1` … |
| Reel 1, 2, 3… (comment / bio pin) | `https://elektrikzone.in/#ig-reel1`, `#ig-reel2`, `#ig-reel3` | `EZ-IG-REEL1` … |
| A product in a story | `https://elektrikzone.in/products/PRODUCT-ID#ig-story1` | product page + `EZ-IG-STORY1` |
| Post captions (Copy Instagram caption button) | `…/products/PRODUCT-ID#ig-post` | `EZ-IG-POST` |
| A festival offer | `https://elektrikzone.in/offers/diwali-lights#ig-diwali` | `EZ-IG-DIWALI` |
| Printed QR at the counter | `https://elektrikzone.in/#qr-counter` (download from Contact page) | `EZ-QR-COUNTER` |

Tips: number reels in the same order as the **Sort order** in the Studio’s Reels list. `#ig-reel3` also scrolls to the third tile on the Reels Wall. Use lowercase letters, numbers and dashes only (e.g. `#ig-diwali-offer`).

---

## (e) Three ideas for version 3

1. **Ready-made room kits.** “2BHK starter list”, “Modular kitchen pack”, “Office floor pack”: curated product lists managed in the Studio that a visitor adds to their quote in one tap and then edits. Fits the current WhatsApp-only flow with no new backend.
2. **Printable quote sheet for the counter.** A staff-only page (behind the Studio login) where you paste a customer’s WhatsApp list and get a clean, branded PDF/print layout with product IDs and your prices filled in by hand. Nothing stored; prices never public.
3. **Marathi language and a project gallery.** Add मराठी alongside EN/हिं (the translation system is ready for a third language), and a “Recent projects” gallery in the Studio with photos of finished rooms, linked to the products used.
