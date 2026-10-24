# Deploying ElektrikZone (Netlify)

Free stack: **GitHub** (code) → **Netlify** (hosting, free plan allows business sites) → **Sanity** (content, free plan).
Your code is at https://github.com/jai-jain1/Elektrikzon (branch `main`).

---

## 1. Import the site into Netlify

1. Go to https://app.netlify.com and **sign up / log in with GitHub** (choose "GitHub" so Netlify can see your repositories).
2. Click **Add new project → Import an existing project → GitHub**.
3. Allow Netlify to access GitHub if asked. Pick **jai-jain1/Elektrikzon**.
4. Netlify reads `netlify.toml` from the repo, so the settings fill in by themselves:
   - Branch to deploy: `main`
   - Build command: `npm run build`
   - Publish directory: `.next`
5. **Before you click Deploy**, open **Add environment variables** (or do it right after, under **Project configuration → Environment variables**) and add these five. Copy each value from your `.env.local` file on your computer:

| Key | Value |
| --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | `tb220qph` |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | `2024-10-01` |
| `SANITY_REVALIDATE_SECRET` | the long random value from `.env.local` (keep it secret) |
| `NEXT_PUBLIC_SITE_URL` | your Netlify address for now, e.g. `https://elektrikzone.netlify.app` (change later to your domain) |

6. Click **Deploy**. The first build takes about 2–4 minutes. When it says **Published**, click the link.

**Change the free address:** Project configuration → **General → Project details → Change project name** → e.g. `elektrikzone` → your site becomes `https://elektrikzone.netlify.app`. Then update `NEXT_PUBLIC_SITE_URL` to match.

> After changing any environment variable: **Deploys → Trigger deploy → Deploy project** so the change takes effect.

---

## 2. Let the live Studio talk to Sanity (CORS)

1. https://www.sanity.io/manage → **Elektrikzon** → **API** → **CORS origins** → **Add CORS origin**
2. Origin: `https://elektrikzone.netlify.app` (your exact Netlify address), tick **Allow credentials**, Save.
3. Later add your domain too (`https://elektrikzone.in` and `https://www.elektrikzone.in`).

Now `https://elektrikzone.netlify.app/studio` works from any device.

---

## 3. Instant updates when you publish (Sanity webhook)

1. sanity.io/manage → **Elektrikzon** → **API** → **Webhooks** → **Create webhook**
   - **Name:** `Revalidate website`
   - **URL:** `https://elektrikzone.netlify.app/api/revalidate` (switch to your domain later)
   - **Dataset:** `production`
   - **Trigger on:** ✔ Create ✔ Update ✔ Delete
   - **Filter:** leave empty
   - **Projection:** `{_type, "slug": coalesce(productId.current, slug.current)}`
   - **HTTP method:** `POST`
   - **Secret:** exactly the same value as `SANITY_REVALIDATE_SECRET`
2. Save. Test: publish a small change in the Studio → webhook → **Attempts** should show `200`. `401` means the secret does not match.

Without the webhook, changes still appear within 5 minutes.

---

## 4. Connect your domain

1. Netlify → your project → **Domain management → Add a domain** → type `elektrikzone.in` (or your domain) → **Verify** → **Add domain**.
2. Netlify shows the DNS records to add. At your registrar (Hostinger: **Domains → your domain → DNS / Nameservers → Manage DNS records**):
   - Delete any existing `A` record for `@` and `CNAME` for `www` that point to parking pages.
   - Add the records Netlify shows. Usually:
     - `A` record, name `@`, value `75.2.60.5`
     - `CNAME` record, name `www`, value `elektrikzone.netlify.app`
   - Always use the exact values Netlify shows you; they are the source of truth.
3. Wait for Netlify to show the domain as verified (minutes to a few hours). Netlify then issues the free HTTPS certificate automatically (**Domain management → HTTPS**).
4. Then update:
   - Netlify env var `NEXT_PUBLIC_SITE_URL` → `https://elektrikzone.in` → **Trigger deploy**
   - Sanity **CORS origins** → add `https://elektrikzone.in` and `https://www.elektrikzone.in` (with credentials)
   - Sanity **webhook URL** → `https://elektrikzone.in/api/revalidate`
   - Print a fresh QR code from the Contact page (it uses `NEXT_PUBLIC_SITE_URL`)

---

## 5. Updating the site later

- **Products, prices notes, photos, settings:** Studio only, no deploy needed.
- **Code changes:** commit and push; Netlify rebuilds automatically.

```powershell
git add -A
git commit -m "Describe the change"
git push
```

---

## Alternative: Vercel

Vercel also works with no code changes: import the same repo at https://vercel.com, add the same five environment variables, and use `/api/revalidate` on the Vercel address for the webhook. Vercel's free Hobby plan is for non-commercial use, so a business site needs Vercel Pro.
