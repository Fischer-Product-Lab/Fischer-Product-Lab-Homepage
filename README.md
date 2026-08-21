# Fischer Product Lab

A cinematic, responsive landing page for the Fischer Product Lab product portfolio. It preserves the existing vinext/Next.js project shape for Sites while providing a native Next.js build for Vercel.

Visual language is locked in [`DESIGN.md`](./DESIGN.md): void navy, ivory, one gold light, film grain, grotesque headline, real product chrome.

## Run locally

```bash
npm install
npm run dev
```

Use `npm run build` for the Sites production build, `npm run build:vercel` for the Vercel production build, and `npm test` for the rendered-page checks.

## Content map

- `app/products.ts` is the typed source of truth for product names, descriptions, statuses, and live destinations. Add or replace products there first.
- `app/page.tsx` is the portfolio landing: hero, featured TrustDesk window, product index, and footer.
- `app/globals.css` holds the design tokens, type scale, one light event, grain, and reduced-motion fallback.
- `app/layout.tsx` loads Geist + Geist Mono via `next/font` and site metadata.
- `public/og.png` is the social preview card.

## Replace project-specific placeholders

- Contact: replace `mailto:hello@fischerproductlab.com` in `app/page.tsx` only when a confirmed email is already in the repo.
- Social links: add confirmed profiles to the footer; no unverified profiles are shipped by default.
- Product figures: update the `metrics` map with verified live values, or drop the numbers. Do not invent them.
- Future products: add the typed product entry in `app/products.ts`. The product index renders from that list.

Reduced-motion visitors skip the rise animation and receive the complete static composition.
