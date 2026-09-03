# usevia.io

Landing page for Via Sales Department.

## Stack

Plain static HTML/CSS in `public/`. No build step, no framework — kept
minimal since the page is currently a placeholder. Move to a framework
(e.g. Astro/Next) if the page grows beyond a few static sections.

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

## Custom domain

`usevia.io` DNS is not yet pointed at this deployment — that requires a
DNS change (CNAME/ALIAS at the registrar) and is tracked as a follow-up
pending CEO sign-off before cutover.
