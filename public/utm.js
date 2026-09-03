/**
 * First-touch UTM/click-id capture. Persists whichever attribution params
 * were present on the visitor's first landing (localStorage), so a lead
 * captured later in the same browser — possibly on a page with no query
 * string at all — still carries the campaign that originally brought them.
 * First touch wins: an already-stored value is never overwritten by a
 * later visit, so a subsequent organic/direct hit can't clobber the
 * campaign that gets attribution credit.
 *
 * Consumers: lead-form.js copies these into hidden fields on the lead
 * form (so Formspree submissions/emails carry them), and index.html's
 * generate_lead gtag call attaches them as GA4 event params.
 */
(function () {
  "use strict";

  var PARAM_KEYS = [
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_term",
    "utm_content",
    "gclid",
    "fbclid",
  ];
  var STORAGE_KEY = "via_utm";

  function readFromUrl() {
    var params = new URLSearchParams(window.location.search);
    var found = {};
    PARAM_KEYS.forEach(function (key) {
      var value = params.get(key);
      if (value) found[key] = value;
    });
    return found;
  }

  function readStored() {
    try {
      var raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function store(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      // localStorage unavailable (private mode, storage full, etc).
      // Attribution just won't persist past this pageview.
    }
  }

  var fromUrl = readFromUrl();
  var attribution = readStored();

  if (!attribution && Object.keys(fromUrl).length) {
    attribution = fromUrl;
    attribution.landing_page = window.location.pathname;
    store(attribution);
  }

  window.viaUTM = attribution || {};
})();
