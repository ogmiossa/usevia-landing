# usevia.io

Landing page for Via Sales Department.

## Stack

Plain static HTML/CSS in `public/`. No build step, no framework — kept
minimal since it's a single-page v1. Move to a framework (e.g. Astro/Next)
if the page grows beyond a few static sections.

Copy (headline, value props, CTA) is placeholder-quality, written from the
company mission statement since no marketing/growth hire exists yet. Treat
it as a starting point to be replaced once that role is filled.

## Deploy

Every push to `main` deploys automatically via GitHub Actions
(`.github/workflows/deploy.yml`) to GitHub Pages. No manual steps.

Current live URL: see repo Settings → Pages, or the deployment
environment on the latest Actions run.

To deploy manually, use the "Run workflow" button on the
**Deploy to GitHub Pages** Actions workflow.

## A/B testing

`public/ab-test.js` provides minimal client-side A/B testing for headline/CTA
copy — no backend, no third-party platform. See `docs/ab-testing.md` for how
to add an experiment and read results.

## Lead capture

`public/index.html` has an email/name signup form (`#lead-form`); its logic
is in `public/lead-form.js`. Static hosting on GitHub Pages has no backend,
so submissions go to [Formspree](https://formspree.io) — no server code to
run or maintain, free tier covers early traffic, and it stores every
submission durably regardless of whether the request from the browser
succeeds.

**Not yet activated** — needs one manual step:

1. Create a Formspree account (or use one already owned by the company)
   tied to the inbox that should receive lead notifications.
2. Create a form there and copy its endpoint, e.g.
   `https://formspree.io/f/abcdwxyz`.
3. Replace `REPLACE_WITH_FORMSPREE_ID` in two places: the `action`
   attribute of `#lead-form` in `public/index.html`, and `FORM_ENDPOINT` in
   `public/lead-form.js`.
4. Formspree emails a one-time confirmation link to the inbox — click it
   to start receiving notifications.

Until step 3 is done, the form still validates input and shows a clear
error state pointing people at a fallback email (`FALLBACK_EMAIL` in
`lead-form.js`, currently a placeholder `hello@usevia.io`) instead of
silently failing.

Other notes:
- Validation: required email (format-checked client-side), optional name.
  Native HTML5 `required`/`type=email` also gate submission if JS fails to
  load, so the form degrades gracefully rather than breaking.
- Anti-spam: a hidden honeypot field (`_gotcha`) — bots that fill every
  field get a fake success with nothing sent.
- No-JS path: the `<form>` posts directly to Formspree and redirects to
  `public/thank-you.html` via a `_next` hidden field, so submission works
  even without JavaScript once the endpoint above is configured.
- Free tier cap is 50 submissions/month — flag to CEO before upgrading to
  a paid plan if volume approaches that.

## Analytics

GA4 loader lives in `public/analytics.js`, included from `index.html`. It
no-ops until a real Measurement ID is set.

**Not yet activated**:

1. Create a GA4 property (or use one already owned by the company) and
   copy its Measurement ID, e.g. `G-ABC1234XYZ`.
2. Replace `REPLACE_WITH_GA4_MEASUREMENT_ID` in `public/index.html`
   (`window.__VIA_GA_MEASUREMENT_ID`).

Once set, pageviews, the A/B test's `via_experiment_exposure` /
`via_experiment_conversion` events, and a `generate_lead` event on
successful form submission all flow automatically — no other code
changes needed.

## SEO / social sharing

`public/index.html` has meta title/description, canonical link, Open Graph
and Twitter Card tags, and favicons (`favicon.ico`, `favicon-16.png`,
`favicon-32.png`, `apple-touch-icon.png`). `public/og-image.png` (1200x630)
is the share-preview image, generated to match the site's dark theme —
swap it for a designed one once a marketer/designer is on board.
`public/robots.txt` and `public/sitemap.xml` are served at the site root.

All absolute URLs (canonical, `og:url`, `og:image`, `twitter:image`, the
sitemap `<loc>`, and the `robots.txt` `Sitemap:` line) point at
`https://ogmiossa.github.io/usevia-landing/`, **not** `usevia.io`, because
of the domain conflict below — a sitemap/canonical pointing at a domain
that doesn't serve this content is invalid and would make social scrapers
fetch the wrong site. **Update all of these to the real domain once the
custom-domain question is resolved** (search for
`ogmiossa.github.io/usevia-landing` to find every occurrence).

Ran a Lighthouse audit (desktop + mobile-throttled presets) against the
current build: 100/100 on Performance, Accessibility, Best Practices, and
SEO on both, LCP 0.2s (desktop) / 0.9s (mobile), CLS 0, TBT 0ms. No CWV
concerns at this size — re-check after the page gains real images/fonts.

## Custom domain

**`usevia.io` currently resolves to a different, unrelated, already-live
product** — a Framer site titled "Via - Your path from thought to done"
(a planning/scheduling app), last published today, with its own GA4
(`G-RYH9XH2FXG`), Meta Pixel, and a third-party script from
`track.anderro.com` already installed. This is not something this repo
controls, and DNS/Framer account access for it is unknown.

This repo currently deploys to GitHub Pages only
(`https://<owner>.github.io/usevia-landing/`); it is **not** reachable at
`usevia.io`. Pointing the real domain at this deployment would require
either (a) DNS + Framer changes on an account this engineer doesn't have
access to, or (b) a decision that this project's target domain is
different from `usevia.io`. Flagged to the CEO — do not cut over DNS
without explicit sign-off.
