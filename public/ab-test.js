/**
 * Minimal client-side A/B testing for landing page copy/CTAs.
 *
 * Add an experiment: add an entry to EXPERIMENTS below, then tag the
 * element whose text should vary with data-via-exp="<experiment id>".
 * Tag any clickable element that counts as a conversion with
 * data-via-conversion="<experiment id>".
 *
 * See docs/ab-testing.md for the full guide.
 */
(function () {
  "use strict";

  var EXPERIMENTS = {
    tagline: {
      variants: {
        control: "Via runs outbound prospecting and follow-up on autopilot, so qualified conversations keep landing on your calendar.",
        b: "Turn more conversations into closed deals — without hiring a bigger sales team."
      }
    }
  };

  var STORAGE_PREFIX = "via_exp_";
  var active = {};

  function assignVariant(experimentId, variantIds) {
    var key = STORAGE_PREFIX + experimentId;
    try {
      var stored = localStorage.getItem(key);
      if (stored && variantIds.indexOf(stored) !== -1) return stored;
      var choice = variantIds[Math.floor(Math.random() * variantIds.length)];
      localStorage.setItem(key, choice);
      return choice;
    } catch (e) {
      // localStorage unavailable (private mode, storage full, etc).
      // Fall back to per-pageview random assignment so the experiment
      // still runs, just without stickiness across visits.
      return variantIds[Math.floor(Math.random() * variantIds.length)];
    }
  }

  function trackEvent(name, payload) {
    if (typeof window.gtag === "function") {
      window.gtag("event", name, payload);
    }
    if (typeof window.plausible === "function") {
      window.plausible(name, { props: payload });
    }
    if (window.dataLayer && typeof window.dataLayer.push === "function") {
      var dlPayload = { event: name };
      for (var k in payload) dlPayload[k] = payload[k];
      window.dataLayer.push(dlPayload);
    }
    // Always log locally so bucketing/results are inspectable even
    // before an analytics tool is wired up.
    console.log("[via-experiment]", name, payload);
  }

  function trackConversion(experimentId, extra) {
    var variant = active[experimentId];
    if (!variant) return;
    var payload = { experiment_id: experimentId, variant: variant };
    for (var k in extra) payload[k] = extra[k];
    trackEvent("via_experiment_conversion", payload);
  }

  function init() {
    Object.keys(EXPERIMENTS).forEach(function (experimentId) {
      var config = EXPERIMENTS[experimentId];
      var variantIds = Object.keys(config.variants);
      var variant = assignVariant(experimentId, variantIds);
      active[experimentId] = variant;

      var el = document.querySelector('[data-via-exp="' + experimentId + '"]');
      if (el) {
        el.textContent = config.variants[variant];
      }

      trackEvent("via_experiment_exposure", {
        experiment_id: experimentId,
        variant: variant
      });
    });

    document.querySelectorAll("[data-via-conversion]").forEach(function (el) {
      el.addEventListener("click", function () {
        trackConversion(el.getAttribute("data-via-conversion"));
      });
    });
  }

  window.viaExperiments = {
    active: active,
    trackConversion: trackConversion
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
