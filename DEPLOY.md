# Deploying ElektrikZone

Free stack: **GitHub** (code) → **Vercel** (hosting) → **Sanity** (content).
All commands are PowerShell, run in the project folder.

---

## 1. Push the code to GitHub

1. Create an empty repository on https://github.com/new (for example `elektrikzone-website`, Private is fine). Do **not** add a README.
2. In PowerShell (the project already has a git repository from the scaffold):

```powershell
git add -A
git commit -m "ElektrikZone website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/elektrikzone-website.git
git push -u origin main
```

`.env.local` is in `.gitignore`, so your secrets are not uploaded. Check with:

```powershell
git status --ignored
```

---

## 2. Import the repository in Vercel

1. Sign in at https://vercel.com with GitHub.
2. **Add New… → Project** → pick `elektrikzone-website` → **Import**.
3. Framework preset: **Next.js** (detected automatically). Leave build settings as they are.
4. Before clicking Deploy, open **Environment Variables** and add (same values as `.env.local`):

| Name | Value |
| --- | --- |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | your project ID |
| `NEXT_PUBLIC_SANITY_DATASET` | `production` |
| `NEXT_PUBLIC_SANITY_API_VERSION` | `2024-10-01` |
| `SANITY_REVALIDATE_SECRET` | the long random value from `.env.local` |
| `NEXT_PUBLIC_SITE_URL` | `https://YOUR-PROJECT.vercel.app` (change later to your custom domain) |

5. Click **Deploy**. When it finishes, open the `.vercel.app` link.

> After changing environment variables in Vercel, go to **Deployments → ⋯ → Redeploy** so they take effect.

---

## 3. Allow the live Studio to talk to Sanity (CORS)

1. https://www.sanity.io/manage → your project → **API** → **CORS origins** → **Add CORS origin**.
2. Origin: `https://YOUR-PROJECT.vercel.app`
3. Tick **Allow credentials** (needed for logging in to `/studio`).
4. Save. Repeat later for your custom domain (both `https://elektrikzone.in` and `https://www.elektrikzone.in` if you use both).

Keep `http://localhost:3000` in the list for local work.

---

## 4. Create the revalidate webhook (instant updates)

Without this, published changes appear within 5 minutes. With it, within seconds.

1. https://www.sanity.io/manage → your project → **API** → **Webhooks** → **Create webhook**.
2. Fill in:
   - **Name:** `Revalidate website`
   - **URL:** `https://YOUR-PROJECT.vercel.app/api/revalidate`
   - **Dataset:** `production`
   - **Trigger on:** ✔ Create ✔ Update ✔ Delete
   - **Filter:** leave empty
   - **Projection:** `{_type, "slug": coalesce(productId.current, slug.current)}`
   - **Status:** Enabled
   - **HTTP method:** `POST`
   - **Secret:** the exact value of `SANITY_REVALIDATE_SECRET`
3. Save. Test it: publish any small change in the Studio, then open the webhook → **Attempts** and check for status `200`. A `401` means the secret does not match.

Update the URL when you move to a custom domain.

---

## 5. Connect a custom domain

1. Vercel → your project → **Settings → Domains** → **Add** → type your domain (e.g. `elektrikzone.in`).
2. Vercel shows DNS records. At your domain registrar (GoDaddy, Hostinger, BigRock…), add exactly those records (usually an `A` record for the root and a `CNAME` for `www`).
3. Wait until Vercel shows **Valid Configuration** (minutes to a few hours).
4. Then update:
   - Vercel env var `NEXT_PUBLIC_SITE_URL` → `https://elektrikzone.in` and **Redeploy**
   - Sanity **CORS origins** → add the new domain with credentials
   - Sanity **webhook URL** → `https://elektrikzone.in/api/revalidate`
   - Print a new QR code from the Contact page (it uses `NEXT_PUBLIC_SITE_URL`)

---

## 6. Updating the site later

Content: use the Studio, no deploy needed.
Code: commit and push; Vercel deploys automatically.

```powershell
git add -A
git commit -m "Describe the change"
git push
```
