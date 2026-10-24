# ElektrikZone Studio guide

A simple guide for adding and changing what appears on the ElektrikZone website.
You do not need to touch any code.

---

## 1. Open the Studio and log in

1. Go to **your website address + `/studio`**
   - On your computer while testing: `http://localhost:3000/studio`
   - When the site is live: for example `https://elektrikzone.vercel.app/studio`
2. Click **Log in** and choose the same Google / GitHub / email account you used to create the Sanity project.
3. The menu on the left is your control panel:
   - **Start here**: a short reminder of these steps
   - **Site settings**: phone, WhatsApp, address, hours, Instagram
   - **Categories**, **Subcategories**, **Brands**
   - **Products by category** and **All products**
   - **Reels**

> **Publish to make changes live on the website.**
> Everything you type is saved as a draft. Nothing changes on the website until you press the green **Publish** button at the bottom right. The website then updates within a few minutes (instantly once the webhook from DEPLOY.md is set up).

---

## 2. Fill in Site settings first

Click **Site settings**. Every empty field shows up on the website as a yellow `[ADD: …]` box, so fill in what you can:

| Field | Where it appears |
| --- | --- |
| WhatsApp number | Every “Request a quote” button. Digits only, starting with 91, no + or spaces (e.g. `919812345678`). |
| Phone number | Footer and Contact page (tap to call) |
| Email | Footer and Contact page |
| Shop address, PIN code | Footer, Contact page, Google business information |
| Google Maps link | “Get directions” buttons |
| Opening hours | Footer, Contact page, FAQ |
| Instagram profile link and handle | Footer, Reels Wall |
| GSTIN | Footer and Contact page |
| Brands stocked | Trust strip, About page, FAQ. Only brands you really stock. |
| Delivery areas, Delivery promise | Contractors page, Contact page, FAQ. Only promises you can always keep. |
| Quote response time | Next to quote buttons, FAQ |
| Hero headline options | The big line at the top of the homepage (the first one is used) |

Fields that still say `[ADD: …]` show a yellow warning. Replace them with your real details, then press **Publish**.

---

## 3. Add a category

1. Click **Categories** → the **pencil** icon (top of the list) to create a new one.
2. **Category name**, e.g. `Lighting`. Optional Hindi name.
3. **Web address**: click **Generate**.
4. **How it looks on the homepage**:
   - *Editorial*: a large photo tile (best for Switches and Lighting)
   - *Technical*: a compact row (best for wires, MCBs, conduits)
   - *Standard*: a normal tile
5. **Cover photo** (optional): a landscape photo, about 1600 px wide. Fill in the alt text.
6. **Sort order**: 1, 2, 3… (lower numbers come first).
7. **Publish**.

Subcategories work the same way. Pick the main category they belong to.

---

## 4. Add a product with photos

The easiest way: **Products by category** → pick the category → **pencil** icon. The category is filled in for you.

**Basics tab**
- **Product name**, e.g. `2-Module Socket`
- **Product ID**: click **Generate**. This ID appears in WhatsApp quotes, so do not change it later.
- **Subcategory** and **Brand** (optional; brands are shown as plain text, no logos)
- **Feature on the homepage**: turn ON to show it in the Featured row
- **Sample listing**: **turn this OFF for real products.** While it is on, the site shows a “Sample listing” tag.

**Details and specs tab**
- Tick the **Finishes** and **Where it is used** (these power the catalogue filters)
- **Specifications**: add rows such as `Module size` → `2 modules`. Only facts you are sure of.
- **Description**: a few plain sentences. No claims (ratings, certifications) unless they are true for this exact product.
- **MRP**: leave empty if you do not want to show an MRP. Trade prices are never shown.
- **Availability note**: e.g. “Check availability on WhatsApp”. Never promise stock.

**Photos tab**
- Drag photos in. **The first photo is the main one.**
- For every photo, fill in **Alt text** named after the product, e.g. “Charcoal 2-module switch plate”.
- Click a photo and use the **crop / hotspot** tool to choose the part that must always stay visible.

**Hindi tab**: optional Hindi name and description.

Press **Publish**.

### Photo tips
- **Format:** WebP or JPG
- **Size:** about **1200 px wide**, **under 500 KB**
- **Background:** clear and plain (white, grey or a clean wall)
- **Light:** daylight from a window, no harsh flash
- **Angle:** straight on, plus one close-up of the finish
- **Alt text:** name it after the product and finish
- No watermarks, and no brand logos you are not allowed to use

---

## 5. Turn off the Sample flag

The website starts with 12 **sample listings**. For each one, either:
- replace its details with a real product, add photos, switch **Sample listing** OFF and **Publish**, or
- open it, click the **⋯** menu next to Publish → **Delete**, if you do not need it.

Sample listings are hidden from Google until you switch the flag off.

---

## 6. Add a reel to the Reels Wall

1. Open the reel on Instagram → **Share** → **Copy link**.
2. In the Studio: **Reels** → **pencil** icon.
3. **Title**, **Cover image** (a still from the reel, portrait), alt text, optional caption.
4. **Instagram link**: paste the link.
5. **Products shown in this reel**: pick the products, so visitors can add them to their quote straight from the reel.
6. **Publish**.

The Reels Wall only appears on the homepage once at least one reel is published.

---

## 7. Important: what never goes in the Studio

Everything published in the Studio can be read publicly. **Never store customer names, customer phone numbers, quotes or private notes here.** Customer quotes only ever arrive in your WhatsApp.
