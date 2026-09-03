/**
 * GA4 loader. Safe to include even with no Measurement ID configured: it
 * simply never loads gtag.js, and every caller (ab-test.js, lead-form.js)
 * already checks `typeof window.gtag === "function"` before using it.
 *
 * Activation: set window.__VIA_GA_MEASUREMENT_ID (see index.html <head>) to
 * a real "G-XXXXXXX" ID from a GA4 property. Nothing else needs to change.
 */
(function () {
  "use strict";

  var id = window.__VIA_GA_MEASUREMENT_ID;
  if (!id || id.indexOf("REPLACE_WITH") === 0) return;

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", id);

  var script = document.createElement("script");
  script.async = true;
  script.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(id);
  document.head.appendChild(script);
})();
