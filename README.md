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

## Custom domain

`usevia.io` DNS is not yet pointed at this deployment — that requires a
DNS change (CNAME/ALIAS at the registrar) and is tracked as a follow-up
pending CEO sign-off before cutover.
