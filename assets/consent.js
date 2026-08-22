(() => {
  "use strict";

  const CONSENT_KEY = "chorecharteasy.consent.v2";
  const CONSENT_VERSION = 2;
  const ANALYTICS_ID = "G-WZL9EYQM8E";
  const MAX_AGE_MS = 180 * 24 * 60 * 60 * 1000;

  const EVENT_FIELDS = {
    cta_click: ["source"],
    chart_started: ["starter", "children_count", "task_count"],
    chart_edited: ["source", "starter", "task_count", "checked_count"],
    task_added: ["starter", "task_count"],
    task_removed: ["starter", "task_count"],
    task_checked: ["starter", "checked", "checked_count", "task_count"],
    draft_cleared: ["source"],
    starter_loaded: ["starter"],
    plan_ready: ["starter", "children_count"],
    print_clicked: ["paper", "starter", "task_count"],
    print_preview_opened: ["paper"],
    afterprint_returned: ["paper"],
    randomize_chores: ["people_count", "chore_count"],
    print_randomized_chores: [],
    randomizer_cleared: [],
    feedback_opened: [],
    feedback_submitted: ["kind"],
    cookie_preference_updated: ["analytics"]
  };

  let analyticsLoaded = false;
  let currentPreference = readPreference();
  let lastFocusedElement = null;

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };

  function storageAvailable() {
    try {
      const key = "__cce_consent_test__";
      localStorage.setItem(key, "1");
      localStorage.removeItem(key);
      return true;
    } catch (_) {
      return false;
    }
  }

  function gpcEnabled() {
    return navigator.globalPrivacyControl === true;
  }

  function readPreference() {
    if (!storageAvailable()) return null;
    try {
      const value = JSON.parse(localStorage.getItem(CONSENT_KEY));
      if (!value || value.version !== CONSENT_VERSION || !value.savedAt) return null;
      if (Date.now() - value.savedAt > MAX_AGE_MS) return null;
      return { analytics: Boolean(value.analytics), version: value.version, savedAt: value.savedAt };
    } catch (_) {
      return null;
    }
  }

  function savePreference(analytics) {
    currentPreference = { analytics: Boolean(analytics), version: CONSENT_VERSION, savedAt: Date.now() };
    if (storageAvailable()) {
      try {
        localStorage.setItem(CONSENT_KEY, JSON.stringify(currentPreference));
      } catch (_) {}
    }
    updateAnalyticsConsent(currentPreference.analytics && !gpcEnabled());
    updateSettingsStatus();
    hideBanner();
  }

  function deleteCookie(name, domain) {
    const domainPart = domain ? `; domain=${domain}` : "";
    const securePart = location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${name}=; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domainPart}; SameSite=Lax${securePart}`;
  }

  function deleteAnalyticsCookies() {
    const names = document.cookie.split(";").map(part => part.split("=")[0].trim()).filter(name => name === "_ga" || name.startsWith("_ga_"));
    const domains = ["", location.hostname, `.${location.hostname}`, ".chorecharteasy.com"];
    if (location.hostname === "chorecharteasy.pages.dev" || location.hostname.endsWith(".chorecharteasy.pages.dev")) {
      domains.push(".chorecharteasy.pages.dev");
    }
    names.forEach(name => domains.forEach(domain => deleteCookie(name, domain)));
  }

  function denyAnalytics() {
    updateAnalyticsConsent(false);
  }

  function updateAnalyticsConsent(granted) {
    window.gtag("consent", "update", { analytics_storage: granted ? "granted" : "denied" });
    if (granted) return;
    deleteAnalyticsCookies();
    window.setTimeout(() => {
      if (!currentPreference?.analytics || gpcEnabled()) deleteAnalyticsCookies();
    }, 0);
    window.setTimeout(() => {
      if (!currentPreference?.analytics || gpcEnabled()) deleteAnalyticsCookies();
    }, 250);
  }

  function loadAnalytics() {
    if (analyticsLoaded) return;
    analyticsLoaded = true;
    const analyticsGranted = Boolean(currentPreference?.analytics && !gpcEnabled());
    window.gtag("consent", "default", {
      analytics_storage: analyticsGranted ? "granted" : "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
      personalization_storage: "denied"
    });
    window.gtag("set", "ads_data_redaction", true);
    window.gtag("js", new Date());
    window.gtag("config", ANALYTICS_ID, {
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      send_page_view: true
    });
    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ANALYTICS_ID)}`;
    script.dataset.consentLoaded = "analytics";
    document.head.appendChild(script);
  }

  function safeValue(value) {
    if (typeof value === "number") return Number.isFinite(value) ? value : undefined;
    if (typeof value === "boolean") return value;
    if (typeof value === "string" && /^[a-z0-9_-]{1,40}$/i.test(value)) return value;
    return undefined;
  }

  function track(eventName, params = {}) {
    if (!analyticsLoaded) return;
    const allowed = EVENT_FIELDS[eventName];
    if (!allowed) return;
    const payload = {};
    allowed.forEach(key => {
      const value = safeValue(params[key]);
      if (value !== undefined) payload[key] = value;
    });
    window.gtag("event", eventName, payload);
  }

  function bannerMarkup() {
    const gpc = gpcEnabled();
    return `
      <aside class="consent-banner" id="consent-banner" aria-labelledby="consent-title" role="region">
        <h2 id="consent-title">Analytics cookies</h2>
        <p>We always collect basic usage data without cookies. Accept analytics cookies to help us improve the site. We never use advertising cookies.</p>
        ${gpc ? '<p class="gpc-note">Global Privacy Control is enabled, so Analytics cookie storage will remain off.</p>' : ""}
        <div class="consent-actions">
          <button class="button button-tool" id="accept-analytics" type="button" ${gpc ? "disabled" : ""}>Accept</button>
          <button class="button button-secondary" id="reject-analytics" type="button">Reject analytics</button>
          <button class="button button-quiet settings" type="button" data-cookie-settings>Settings</button>
        </div>
        <button class="consent-close" id="close-consent" type="button" aria-label="Close and continue without analytics cookies">×</button>
      </aside>`;
  }

  function settingsMarkup() {
    return `
      <dialog class="dialog" id="cookie-settings-dialog" aria-labelledby="cookie-settings-title">
        <div class="dialog-head">
          <h2 id="cookie-settings-title">Cookie settings</h2>
          <button class="icon-button" type="button" data-close-cookie-settings aria-label="Close cookie settings">×</button>
        </div>
        <div class="dialog-body narrow">
          <section>
            <h3>Essential storage</h3>
            <p>Always enabled. It stores your consent choice and, when available, one active chart draft in this browser.</p>
          </section>
          <section>
            <h3>Analytics</h3>
            <p>Cookieless measurement is active on every visit. If accepted, Google Analytics may also use analytics cookies. Nicknames, chart titles, task text, and completion details are never event parameters.</p>
          </section>
          <p id="cookie-settings-status" class="consent-status" aria-live="polite"></p>
          <div class="consent-actions">
            <button class="button button-tool" id="settings-accept" type="button" ${gpcEnabled() ? "disabled" : ""}>Accept Analytics cookies</button>
            <button class="button button-secondary" id="settings-reject" type="button">Continue without Analytics cookies</button>
          </div>
        </div>
      </dialog>`;
  }

  function ensureUi() {
    if (!document.getElementById("cookie-settings-dialog")) {
      document.body.insertAdjacentHTML("beforeend", settingsMarkup());
    }
    if (!currentPreference && !document.getElementById("consent-banner")) {
      document.body.insertAdjacentHTML("beforeend", bannerMarkup());
    }
    bindUi();
    updateSettingsStatus();
  }

  function bindUi() {
    document.getElementById("accept-analytics")?.addEventListener("click", () => savePreference(true), { once: true });
    document.getElementById("reject-analytics")?.addEventListener("click", () => savePreference(false), { once: true });
    document.getElementById("close-consent")?.addEventListener("click", () => savePreference(false), { once: true });
    document.getElementById("settings-accept")?.addEventListener("click", () => {
      savePreference(true);
      closeSettings();
      track("cookie_preference_updated", { analytics: true });
    });
    document.getElementById("settings-reject")?.addEventListener("click", () => {
      savePreference(false);
      closeSettings();
    });
    document.querySelectorAll("[data-cookie-settings]").forEach(button => button.addEventListener("click", openSettings));
    document.querySelectorAll("[data-close-cookie-settings]").forEach(button => button.addEventListener("click", closeSettings));
    document.getElementById("cookie-settings-dialog")?.addEventListener("cancel", event => {
      event.preventDefault();
      closeSettings();
    });
  }

  function updateSettingsStatus() {
    const status = document.getElementById("cookie-settings-status");
    if (!status) return;
    if (gpcEnabled()) {
      status.textContent = "Global Privacy Control is enabled. Analytics cookies are off; cookieless measurement remains active.";
    } else if (!currentPreference) {
      status.textContent = "Analytics cookies are off because no choice has been saved. Cookieless measurement is active.";
    } else {
      status.textContent = currentPreference.analytics ? "Analytics cookies are currently accepted." : "Analytics cookies are off; cookieless measurement remains active.";
    }
  }

  function hideBanner() {
    document.getElementById("consent-banner")?.remove();
  }

  function openSettings() {
    const dialog = document.getElementById("cookie-settings-dialog");
    if (!(dialog instanceof HTMLDialogElement)) return;
    lastFocusedElement = document.activeElement;
    updateSettingsStatus();
    if (!dialog.open) dialog.showModal();
    document.body.classList.add("dialog-open");
  }

  function closeSettings() {
    const dialog = document.getElementById("cookie-settings-dialog");
    if (dialog instanceof HTMLDialogElement && dialog.open) dialog.close();
    document.body.classList.remove("dialog-open");
    if (lastFocusedElement instanceof HTMLElement) lastFocusedElement.focus();
  }

  function delegatedTracking(event) {
    const target = event.target instanceof Element ? event.target.closest("[data-track]") : null;
    if (!target) return;
    track("cta_click", { source: target.getAttribute("data-track") || "unknown" });
  }

  document.addEventListener("click", delegatedTracking);
  document.addEventListener("DOMContentLoaded", () => {
    loadAnalytics();
    ensureUi();
    if (!currentPreference?.analytics || gpcEnabled()) denyAnalytics();
  });

  window.ChoreConsent = {
    track,
    openSettings,
    hasAnalyticsConsent: () => Boolean(currentPreference?.analytics && !gpcEnabled()),
    deleteAnalyticsCookies
  };
})();
