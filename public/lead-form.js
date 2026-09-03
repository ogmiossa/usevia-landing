(function () {
  "use strict";

  // Backend: Formspree (https://formspree.io). Set up an account against the
  // inbox that should receive leads, create a form, then replace the
  // placeholder below (and the form's `action` in index.html) with the real
  // endpoint, e.g. https://formspree.io/f/abcdwxyz. See README "Lead capture".
  var FORM_ENDPOINT = "https://formspree.io/f/REPLACE_WITH_FORMSPREE_ID";
  var FALLBACK_EMAIL = "hello@usevia.io";

  var form = document.getElementById("lead-form");
  if (!form) return;

  var status = document.getElementById("lead-form-status");
  var submitButton = form.querySelector("button[type=submit]");
  var emailInput = document.getElementById("lead-email");
  var honeypot = form.querySelector('[name="_gotcha"]');

  var isEndpointConfigured = FORM_ENDPOINT.indexOf("REPLACE_WITH") === -1;

  function applyUtmFields() {
    var utm = window.viaUTM || {};
    ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "landing_page"].forEach(
      function (key) {
        var field = form.querySelector('[name="' + key + '"]');
        if (field && utm[key]) field.value = utm[key];
      }
    );
    return utm;
  }

  function setStatus(message, tone) {
    status.textContent = message;
    status.className = "form-status" + (tone ? " form-status--" + tone : "");
  }

  function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (honeypot && honeypot.value) {
      // Bot tripped the honeypot: fake a success, submit nothing.
      form.reset();
      setStatus("Thanks! We'll be in touch.", "success");
      return;
    }

    var email = emailInput.value.trim();
    if (!email || !isValidEmail(email)) {
      setStatus("Enter a valid email address.", "error");
      emailInput.focus();
      return;
    }

    if (!isEndpointConfigured) {
      setStatus(
        "Thanks! Sign-up is still being wired up — email us at " +
          FALLBACK_EMAIL +
          " and we'll add you personally.",
        "error"
      );
      return;
    }

    var utm = applyUtmFields();

    submitButton.disabled = true;
    var originalText = submitButton.textContent;
    submitButton.textContent = "Sending…";
    setStatus("Sending…", "pending");

    fetch(FORM_ENDPOINT, {
      method: "POST",
      body: new FormData(form),
      headers: { Accept: "application/json" },
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error("Submission failed");
        }
        if (typeof window.gtag === "function") {
          window.gtag("event", "generate_lead", utm);
        }
        form.reset();
        setStatus("Thanks! We'll be in touch.", "success");
      })
      .catch(function () {
        setStatus(
          "Something went wrong. Email us at " + FALLBACK_EMAIL + " and we'll add you personally.",
          "error"
        );
      })
      .finally(function () {
        submitButton.disabled = false;
        submitButton.textContent = originalText;
      });
  });
})();
