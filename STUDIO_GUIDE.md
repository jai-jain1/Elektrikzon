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

## 7. Sell online: prices and UPI payment

No payment gateway is needed. Customers pay you directly by UPI and the order reaches your WhatsApp.

1. **Site settings → Business details → UPI ID**: your shop’s UPI ID (for example `yourshop@okhdfcbank`). Check it carefully: payments go straight to it. **UPI payee name** is the name customers see in their UPI app.
2. **Site settings → Order note**: delivery charges, delivery areas and pickup timings. Customers see this at checkout.
3. **Products → open a product → Price (₹)**: the selling price per unit. Products with a price show **Add to bag**; products without one still show **Request trade price**, exactly as before.
4. **Publish**.

How an order works:
- The customer adds priced items to the bag, presses **Checkout and pay by UPI**, enters a name and chooses delivery (with an address) or pickup.
- They see a UPI QR code with the exact total and an order number such as `EZ-261024-K7Q3`. On a phone, **Open UPI app** fills in the amount.
- After paying, they press **I’ve paid: send order on WhatsApp**. You receive the items, prices, total, order number, delivery or pickup, and their UPI transaction ID if they typed it.
- **Before you dispatch, check that the money has arrived in your bank or UPI app** (match the amount and order number or transaction ID), then confirm on WhatsApp. The website can’t check payments for you.

If the bag mixes priced and unpriced items, or the UPI ID is empty, the customer sends the list on WhatsApp as a quote instead.

---

## 8. Run a festival offer (Diwali and others)

**Campaigns and offers** in the Studio menu. A draft **Diwali Lights** campaign has been added for you with four lighting products and a festive banner image. Drafts aren’t visible on the website.

1. Open **Campaigns and offers → Diwali Lights**.
2. **Basics**: check the title, the short line above it (eyebrow), description, **Starts** and **Ends** dates. The offer appears on the website automatically at the start time and disappears at the end time (within 5 minutes).
3. **Banner image**: replace it with your own photo if you like (landscape, about 2400 px wide).
4. **Offer terms**: replace `[ADD: …]` with your real terms, e.g. “While stocks last. Prices include GST.”
5. **Products**: add or remove products. For each one you can set an **Offer price** (what customers pay during the offer; the normal price is shown crossed out) and a short **Badge** such as “Diwali deal”. Leave the offer price empty to use the product’s normal price.
6. Keep **Show on homepage** on to get the big banner on the homepage (only the first running campaign is shown there).
7. **Publish**.

The offer gets its own page, e.g. `https://elektrikzone.in/offers/diwali-lights`, and every running offer is listed at `/offers` (**Offers** in the menu). For Instagram, link to `https://elektrikzone.in/offers/diwali-lights#ig-diwali` so WhatsApp orders show `Ref: EZ-IG-DIWALI`.

After the end date the page stays up and says the offer has ended; prices go back to normal. To reuse it next year, change the dates and publish again.

---

## 9. Important: what never goes in the Studio

Everything published in the Studio can be read publicly. **Never store customer names, customer phone numbers, quotes or private notes here.** Customer quotes and orders only ever arrive in your WhatsApp.
