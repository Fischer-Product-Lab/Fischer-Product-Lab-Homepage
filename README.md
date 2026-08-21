# Fischer Product Lab

A cinematic, responsive landing page for the Fischer Product Lab product portfolio. It preserves the existing vinext/Next.js project shape for Sites while providing a native Next.js build for Vercel.

## Run locally

```bash
npm install
npm run dev
```

Use `npm run build` for the Sites production build, `npm run build:vercel` for the Vercel production build, and `npm test` for the rendered-page checks.

## Content map

- `app/products.ts` is the typed source of truth for product names, descriptions, statuses, accents, landmarks, and live destinations. Add or replace products there first.
- `app/page.tsx` contains the reusable landmark, monument, annotation, product-index, interface-fragment, and section components. Truthful interface metrics sampled from each live demo are grouped in the `metrics` map near the top.
- `app/globals.css` contains the landscape, monument drawing, motion states, desktop-to-mobile recomposition, focus treatments, and reduced-motion fallback.
- `public/og.png` is the social preview card. `public/landscape-hero.webp` and `public/landscape-hero-mobile.webp` are the responsive cinematic background plates; the CSS landscape remains visible as their fallback.

## Replace project-specific placeholders

- Founder: replace the portrait placeholder and founder note in the `builder` section of `app/page.tsx`. For a real portrait, put an optimized WebP or AVIF in `public/` and replace `builder-portrait` with `next/image`.
- Contact: replace both `mailto:hello@fischerproductlab.com` values in `app/page.tsx` with the confirmed email or contact destination.
- Social links: add confirmed profiles to the `footer-meta` block; no unverified profiles are shipped by default.
- Product screens: update the `metrics` map with verified live values or replace each `InterfaceFragment` with optimized local captures. Keep the fragments inside the monuments and provide meaningful alternative text if a capture conveys new information.
- Future products: add the typed product entry, a `metrics` tuple, a monument treatment in `Monument`, and its corresponding accent/position rules in `app/globals.css`.

The session opens with a short animated title card — navy, ivory, one gold light, and grain — then dissolves into the landscape. The card is stored only for the current browser tab. Click or any key dismisses it early. Reduced-motion visitors skip the card and receive the complete static composition.
