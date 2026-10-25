# ElektrikZone website

Website for ElektrikZone, an electrical products supplier (wholesale and retail) in Ulhasnagar, Maharashtra.

- Next.js 14 (App Router), TypeScript, Tailwind CSS
- Design: dark graphite, Apple-style; motion with framer-motion (scroll-linked hero, pinned "lights on" story, reveals); no 3D
- Photography: 18 images rendered locally by the render studio (`npm run dev` → http://localhost:3000/render, scenes in `lib/render/`), saved to `public/shots`. Slots are listed in `data/shots.ts`; any image can be replaced by a real photo with the same file name.
- Products, categories, brands, reels and site settings: Sanity (free plan), with the Studio embedded at `/studio`
- Quote flow: WhatsApp only (no database, no login, no payments)
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
npm run dev      # http://localhost:3000 and http://localhost:3000/studio
npm run build    # production build
npm run start    # serve the production build
```

## Sanity

### First-time login and sample data

```powershell
npx sanity login
npx sanity dataset import seed/sample-data.ndjson production
```

The seed contains Site settings (with `[ADD: ...]` placeholders), 5 categories, 12 subcategories and 12 sample products (`sample: true`, no images, no brands, no prices). Re-importing the same file fails on existing documents; add `--replace` to overwrite them.

### Allow the local Studio to talk to Sanity

In https://www.sanity.io/manage → your project → **API** → **CORS origins** → **Add CORS origin**:
`http://localhost:3000`, tick **Allow credentials**. Repeat later for your Netlify address and your domain.

### Content model

`sanity/schemaTypes/`: `siteSettings` (singleton), `category`, `subcategory`, `brand` (plain text, no logo), `product` (optional `price` for online orders), `reel`, `campaign` (festival offers with dates, offer prices and badges). Studio menu order is in `sanity/structure.ts`.

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
| `/` | Short on purpose: video hero, running offer banner, shop by category, popular products (2 per row on phones), shop facts |
| `/configurator`, `/light-lab` | Switch Configurator and Light Lab (moved off the homepage) |
| `/products` | Catalogue with search and filters (category, type, brand, finish, use) |
| `/products/[productId]` | Product page (gallery, specs, add to quote, share, Instagram caption) |
| `/offers`, `/offers/[slug]` | Running festival offers; one offer page (also shows an “ended” notice) |
| `/designers` | For Designers, with “Paste your product list” |
| `/contractors` | For Contractors, with the trade account form (opens WhatsApp) |
| `/about`, `/contact` | About; Contact with QR code and the FAQ |
| `/studio` | Embedded Sanity Studio |
| `/api/revalidate` | Sanity webhook endpoint |

## Online orders (UPI, no gateway)

Products with a `price` get **Add to bag**. When every item in the bag is priced and Site settings has a UPI ID, the drawer offers a checkout (`components/quote/Checkout.tsx`): name, delivery or pickup, then a `upi://pay` QR (`lib/upi.ts`) with the exact amount and an order number, and finally an order message to WhatsApp (`buildOrderMessage` in `lib/quote-message.ts`). Nothing is stored; the shop checks the payment and confirms on WhatsApp. Running campaigns set `product.offer`, and `effectivePrice()` in `types/catalog.ts` decides what the customer pays.

## Hero video

`public/video/hero-marble-apartment.mp4` is Pexels video 11630727 (“Showcase of modern home interior”, 1920×1080, about 8 MB; skipped for visitors with Data Saver on; free for commercial use under the Pexels licence; no credit required). `public/shots/hero-room.webp` is a still from it, shown until the video plays and in Lite mode. To use another video, paste a link to an MP4 in Site settings → Homepage → Hero video link, or replace the file and keep the name.

## Motion and performance

No WebGL. All motion is framer-motion on transforms and opacity (GPU-friendly): the hero photo scales with scroll, the lights-on story crossfades two photos while pinned, sections fade up once. Lite mode (footer and menu toggle, automatic with reduced motion or low-power devices) turns all of it into static layouts. Images go through next/image (local `public/shots`) or the Sanity image CDN.

The three.js packages are still listed in package.json but no longer used; remove them with `npm uninstall three @react-three/fiber @react-three/drei @types/three` if you are sure you won't bring 3D back.

## Instagram

Source tokens from links like `/#ig-bio`, `/#ig-reel3`, `/#ig-story2`, `/#qr-counter` are added to every WhatsApp message as `Ref: EZ-…` (`lib/source.ts`). `/#ig-bio` opens the link-in-bio screen. Full link list: LAUNCH_CHECKLIST.md.

## Render studio (development only)

`/render` and `/api/dev/save-shot` only work under `npm run dev` and return 404 in production. Open http://localhost:3000/render and press **Render all and save** (or **Re-render** on one card) after changing a scene in `lib/render/scenes.ts`. Images are WebP, written to `public/shots/`. **Record hero video** renders the 8-second hero loop (1920×1080 H.264 MP4, about 2 MB) to `public/video/hero.mp4`; keep the tab visible while it records so it holds 30 fps. The current hero uses the Pexels film instead (see Hero video above); to switch back, set `heroVideo: "/video/hero.mp4"`. The hero plays its video muted over the still photo, pauses it off-screen, and skips it in Lite mode. Set `heroVideo: null` in `data/config.ts` to turn it off.

## More docs

- STUDIO_GUIDE.md: for the shop owner
- DEPLOY.md: Netlify import, environment variables, CORS, webhook, domain
- HIGGSFIELD_SHOTS.md: the 18 image prompts and how to add the images
- LAUNCH_CHECKLIST.md: placeholders, photos to shoot, test checklist, Instagram links

## Security note

The Sanity dataset is **public-read**: anything published can be read by anyone. Never store customer data, customer phone numbers or private notes in Sanity. The quote basket lives only in the visitor’s browser (localStorage) and is sent only via WhatsApp; it is never sent to Sanity.

## Honesty rules

- Brands are plain text only; no logos.
- No prices. “Request trade price” everywhere; MRP only when a product has an `mrp` value.
- No product claims unless they are in that product’s own fields.
- `sample: true` products show a “Sample listing” tag; products without photos show “Photo coming soon”.
- Missing business details show `[ADD: ...]` placeholders, never invented values.

## Windows note

The project path contains a space (`SEM 8`), which breaks the Node build of `@vercel/og`; `app/opengraph-image.tsx` therefore uses the edge runtime. Behaviour on Vercel is the same.
