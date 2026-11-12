# ElektrikZone website

Website for ElektrikZone, an LED lighting supplier (wholesale and retail) in Ulhasnagar, Maharashtra. The site sells lighting only: panel lights, COB and downlights, strip, rope and profile lights, track and outdoor lights, and drivers.

- Next.js 14 (App Router), TypeScript, Tailwind CSS
- Design: dark graphite, minimal. The hero is a live 3D room (three.js) where each type of light can be switched on and off; the rest of the motion is framer-motion reveals
- Imagery: rendered locally by the render studio (`npm run dev` → http://localhost:3000/render) from the same 3D scenes, saved to `public/shots`. Slots are listed in `data/shots.ts`
- Products, types of light (categories), brands, reels, offers and site settings: Sanity (free plan), with the Studio embedded at `/studio`
- Orders: priced products can be paid by UPI QR and confirmed on WhatsApp; everything else is quoted on WhatsApp (no database, no login, no payment gateway)
- Hosting: Netlify (free plan) via GitHub, settings in `netlify.toml`; Vercel also works

## Setup (PowerShell)

```powershell
npm install
Copy-Item .env.example .env.local   # skip if .env.local already exists
```

Open `.env.local` and set `NEXT_PUBLIC_SANITY_PROJECT_ID` to your project ID from https://www.sanity.io/manage.
Until it is set, the site runs on the built-in sample catalogue (`data/fallback-products.ts`) and `/studio` shows setup instructions.

| Variable | What it is |
| --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | Fixed date, `2024-10-01` |
| `SANITY_REVALIDATE_SECRET` | Long random string, same value as the webhook secret |
| `NEXT_PUBLIC_SITE_URL` | Public URL without trailing slash (e.g. `https://elektrikzone.netlify.app`) |

## Run and build

```powershell
npm run dev          # http://localhost:3000 and http://localhost:3000/studio
npm run dev:sample   # the same site on the built-in sample catalogue, without reading Sanity
npm run build    # production build
npm run start    # serve the production build
```

## Sanity

### First-time login and sample data

```powershell
npx sanity login
npx sanity dataset import seed/sample-data.ndjson production
```

The seed contains Site settings (with `[ADD: ...]` placeholders), the 8 types of light and 8 sample products, one per type (`sample: true`, no images, no brands, no prices). Re-importing the same file fails on existing documents; add `--replace` to overwrite them.

A dataset that was seeded before the site became lighting-only is converted with a one-time script. It writes a JSON backup to `backups/`, keeps anything you have edited, and removes only untouched non-lighting samples:

```powershell
npx sanity exec scripts/migrate-to-lighting.ts --with-user-token -- --dry-run   # shows what would change
npx sanity exec scripts/migrate-to-lighting.ts --with-user-token                # applies it
```

### Allow the local Studio to talk to Sanity

In https://www.sanity.io/manage → your project → **API** → **CORS origins** → **Add CORS origin**:
`http://localhost:3000`, tick **Allow credentials**. Repeat later for your Netlify address and your domain.

### Content model

`sanity/schemaTypes/`: `siteSettings` (singleton), `category` (a type of light), `subcategory` (optional), `brand` (plain text, no logo), `product` (wattage, light colours, body colours, specs, optional `price` for online orders), `reel`, `campaign` (festival offers with dates, offer prices and badges). Studio menu order is in `sanity/structure.ts`.

### How data reaches the site

- `lib/sanity/client.ts`, `queries.ts`, `image.ts`, `types.ts`, `mappers.ts`, `fetch.ts`
- `lib/catalog.ts` and `lib/settings.ts` are the only entry points UI code uses. They map Sanity results into the site types in `types/` and fall back to `/data` when Sanity is empty, misconfigured or unreachable (a warning is logged; the site never crashes).
- Pages use ISR with `revalidate = 300` (5 minutes).

### On-demand revalidation webhook

So published changes appear immediately instead of within 5 minutes. Step-by-step in DEPLOY.md §4. In short: sanity.io/manage → API → Webhooks → URL `https://YOUR-DOMAIN/api/revalidate`, POST, trigger on create/update/delete, secret = `SANITY_REVALIDATE_SECRET`. The route answers `401` for unsigned or wrongly signed requests.

Note: the server imports `@sanity/client` directly (not the `next-sanity` barrel), which keeps the Sanity client out of the visitor's browser bundle.

## Pages

| Route | What it is |
| --- | --- |
| `/` | Short on purpose: 3D hero, running offer banner, shop by type of light, popular lights, the designers-and-contractors block, reels (when there are any), shop facts |
| `/light-lab` | The 3D room with every control: switch each type of light, warm to cool, brightness; sends a lighting brief |
| `/products` | Catalogue with search and filters (type of light, light colour, wattage, body colour, brand, use) |
| `/products/[productId]` | Product page (gallery, specs, light and body colour choice, add to bag or list, share, Instagram caption) |
| `/offers`, `/offers/[slug]` | Running festival offers; one offer page (also shows an “ended” notice) |
| `/designers` | For Designers, with “Paste your product list” (lighting schedules) |
| `/contractors` | For Contractors, with the trade account form (opens WhatsApp) |
| `/about`, `/contact` | About; Contact with QR code and the FAQ |
| `/studio` | Embedded Sanity Studio |
| `/api/revalidate` | Sanity webhook endpoint |

## Online orders (UPI, no gateway)

Products with a `price` get **Add to bag**. When every item in the bag is priced and Site settings has a UPI ID, the drawer offers a checkout (`components/quote/Checkout.tsx`): name, delivery or pickup, then a `upi://pay` QR (`lib/upi.ts`) with the exact amount and an order number, and finally an order message to WhatsApp (`buildOrderMessage` in `lib/quote-message.ts`). Nothing is stored; the shop checks the payment and confirms on WhatsApp. Running campaigns set `product.offer`, and `effectivePrice()` in `types/catalog.ts` decides what the customer pays.

## The 3D room

`lib/three/showroom.ts` builds one minimal room (metres) with five switchable families of light: slim panels, COB downlights washing a fluted wall, a cove and under-console strip, profile lines running down the wall and across the ceiling, and two rope-lit arches. It takes a state (`layers`, `kelvin`, `brightness`), fades between states, and frames itself for wide or tall screens.

- `components/three/ShowroomCanvas.tsx` puts it on a canvas. It is loaded with `next/dynamic` (`ssr: false`), so three.js is not in the first-load bundle. It draws only while something is changing and stops when off screen.
- `components/home/Hero.tsx`: the room starts dark, the lights come on in turn, and the switch panel lets visitors toggle each type and pick warm, neutral or cool.
- `components/lightlab/LightLab.tsx`: the same room with sliders, used to build a lighting brief.
- Quality: desktop gets bloom and soft shadows; phones get a lighter pipeline. If a device cannot keep up, it drops to the lighter pipeline by itself.
- Fallbacks: Lite mode (footer and menu toggle, automatic with reduced motion or low-power devices), browsers without WebGL, and devices that take longer than 4 seconds all get the rendered still (`public/shots/showroom-on*.webp`).
- `lib/three/layers.ts` holds the plain constants and types, so pages can import them without pulling in three.js.

## Motion and performance

Apart from the 3D room, motion is framer-motion on transforms and opacity: sections fade up once and range tiles tilt slightly under the mouse. Lite mode turns all of it into static layouts. Images go through next/image (local `public/shots`) or the Sanity image CDN.

## Instagram

Source tokens from links like `/#ig-bio`, `/#ig-reel3`, `/#ig-story2`, `/#qr-counter` are added to every WhatsApp message as `Ref: EZ-…` (`lib/source.ts`). `/#ig-bio` opens the link-in-bio screen. Full link list: LAUNCH_CHECKLIST.md.

## Render studio (development only)

`/render` and `/api/dev/save-shot` only work under `npm run dev` and return 404 in production. Open http://localhost:3000/render and press **Render all and save** (or **Re-render** on one card). Images are WebP, written to `public/shots/`.

- Hero stills and the trade-block image come from the live room (`lib/three/showroom.ts`), so they always match it.
- The eight range images (one per type of light) are studio scenes in `lib/render/range.ts`; shared lights and helpers are in `lib/render/stage.ts`.
- The fittings are generic, unbranded models. A category's own **Cover photo** in the Studio replaces its render.

## More docs

- STUDIO_GUIDE.md: for the shop owner
- DEPLOY.md: Netlify import, environment variables, CORS, webhook, domain
- LAUNCH_CHECKLIST.md: placeholders, photos to shoot, test checklist, Instagram links

## Security note

The Sanity dataset is **public-read**: anything published can be read by anyone. Never store customer data, customer phone numbers or private notes in Sanity. The quote basket lives only in the visitor’s browser (localStorage) and is sent only via WhatsApp; it is never sent to Sanity.

## Honesty rules

- Brands are plain text only; no logos.
- Prices appear only when the owner has entered one in the Studio; otherwise “Request trade price”. MRP only when a product has an `mrp` value.
- No product claims unless they are in that product’s own fields.
- `sample: true` products show a “Sample listing” tag; products without photos show “Photo coming soon”.
- Missing business details show `[ADD: ...]` placeholders, never invented values.

## Windows note

The project path contains a space (`SEM 8`), which breaks the Node build of `@vercel/og`; `app/opengraph-image.tsx` therefore uses the edge runtime. Behaviour on Vercel is the same.
