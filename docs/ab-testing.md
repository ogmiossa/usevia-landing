# A/B testing

`public/ab-test.js` is a small, dependency-free client-side experimentation
helper. It exists so headline/CTA copy changes can be measured instead of
guessed at. It is intentionally minimal — no backend, no build step, no
third-party experimentation platform.

## How it works

- Experiments are declared in the `EXPERIMENTS` object at the top of
  `public/ab-test.js`: an id plus a map of variant name → copy text.
- On page load, each visitor is assigned a variant per experiment uniformly
  at random, and the assignment is stuck in `localStorage`
  (`via_exp_<experiment id>`) so repeat visits see the same variant.
- The element tagged `data-via-exp="<experiment id>"` has its text replaced
  with the assigned variant's copy.
- Any element tagged `data-via-conversion="<experiment id>"` gets a click
  listener that reports a conversion for that visitor's assigned variant.
- Exposure and conversion events (`via_experiment_exposure` /
  `via_experiment_conversion`, with `experiment_id` and `variant`) are sent
  to `gtag`, `plausible`, and `window.dataLayer` if present, and are always
  logged to the console so bucketing can be verified without any analytics
  tool installed.

## Adding a new copy experiment

1. Add an entry to `EXPERIMENTS` in `public/ab-test.js`:
   ```js
   headline: {
     variants: {
       control: "Current headline copy",
       b: "Challenger headline copy"
     }
   }
   ```
2. Tag the element to vary: `<h1 data-via-exp="headline">Current headline copy</h1>`.
3. If the experiment measures a CTA click rather than (or in addition to)
   page copy, tag the CTA: `<a data-via-conversion="headline" href="...">Get started</a>`.
4. Ship it. No redeploy of anything except the static site is needed.

## Reading results

Until an analytics tool is wired up (tracked separately — see the
"Instrument analytics" work), read results by:
- Filtering `via_experiment_exposure` / `via_experiment_conversion` console
  logs during manual QA, or
- Inspecting `localStorage` keys prefixed `via_exp_` in devtools to confirm
  bucketing.

Once GA4/Plausible is installed, the same events flow there automatically —
no changes to this file are required, since `trackEvent()` already checks
for `gtag`, `plausible`, and `dataLayer`.

## Notes for future landing page changes

When the placeholder copy in `public/index.html` is replaced with real
landing page content, carry the `data-via-exp` / `data-via-conversion`
attributes onto the new headline and primary CTA elements (or add new
experiment ids for them) so copy changes stay measurable.
