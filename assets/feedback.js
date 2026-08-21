(() => {
  "use strict";

  const markup = `
    <button class="site-feedback-trigger" type="button" data-site-feedback-open aria-haspopup="dialog">Feedback</button>
    <dialog class="site-feedback-dialog" id="site-feedback-dialog" aria-labelledby="site-feedback-title" aria-describedby="site-feedback-description">
      <div class="site-feedback-inner">
        <button class="site-feedback-close" type="button" data-site-feedback-close aria-label="Close feedback form">×</button>
        <p class="site-feedback-eyebrow">Private product note</p>
        <h2 id="site-feedback-title">Help improve ChoreChartEasy</h2>
        <p class="site-feedback-description" id="site-feedback-description">Share an idea, report a problem, or tell us what helped.</p>
        <form data-site-feedback-form novalidate>
          <fieldset>
            <legend>What kind of feedback is this?</legend>
            <div class="site-feedback-kinds" role="radiogroup" aria-label="Feedback type">
              <button class="site-feedback-kind" type="button" role="radio" aria-checked="false" data-feedback-kind="idea"><span class="site-feedback-symbol" aria-hidden="true">+</span>Idea</button>
              <button class="site-feedback-kind" type="button" role="radio" aria-checked="false" data-feedback-kind="problem"><span class="site-feedback-symbol" aria-hidden="true">!</span>Problem</button>
              <button class="site-feedback-kind" type="button" role="radio" aria-checked="false" data-feedback-kind="helpful"><span class="site-feedback-symbol" aria-hidden="true">✓</span>Helpful</button>
              <button class="site-feedback-kind" type="button" role="radio" aria-checked="false" data-feedback-kind="other"><span class="site-feedback-symbol" aria-hidden="true">…</span>Other</button>
            </div>
          </fieldset>
          <label class="site-feedback-field" for="site-feedback-message"><span>Your message</span><textarea id="site-feedback-message" name="message" rows="5" maxlength="1000" required placeholder="What happened, or what would make this easier?"></textarea></label>
          <label class="site-feedback-honeypot" aria-hidden="true">Website<input name="website" type="text" tabindex="-1" autocomplete="off"></label>
          <p class="site-feedback-privacy">Do not include names, child details, chart content, email addresses, or other personal information. We store the category, message, page path, and submission time so we can improve the site.</p>
          <div class="site-feedback-status" data-site-feedback-status role="status" aria-live="polite"></div>
          <button class="site-feedback-submit" type="submit">Send feedback</button>
        </form>
      </div>
    </dialog>`;

  function initializeFeedback() {
    if (document.querySelector("[data-site-feedback-open]")) return;
    document.body.insertAdjacentHTML("beforeend", markup);
    const dialog = document.getElementById("site-feedback-dialog");
    const opener = document.querySelector("[data-site-feedback-open]");
    const form = document.querySelector("[data-site-feedback-form]");
    const message = document.getElementById("site-feedback-message");
    const status = document.querySelector("[data-site-feedback-status]");
    const submit = form.querySelector(".site-feedback-submit");
    const kinds = [...document.querySelectorAll("[data-feedback-kind]")];
    let selectedKind = null;
    let busy = false;

    function setStatus(text = "", error = false) {
      status.textContent = text;
      status.classList.toggle("is-error", error);
    }

    function chooseKind(kind, focus = false) {
      selectedKind = kind;
      kinds.forEach(button => {
        const selected = button.dataset.feedbackKind === kind;
        button.setAttribute("aria-checked", selected ? "true" : "false");
        button.tabIndex = selected || (!kind && button === kinds[0]) ? 0 : -1;
        if (selected && focus) button.focus();
      });
    }

    function openFeedback() {
      setStatus();
      if (!dialog.open) dialog.showModal();
      document.body.classList.add("site-feedback-open");
      window.ChoreConsent?.track("feedback_opened", { page: location.pathname });
      (selectedKind ? message : kinds[0]).focus();
    }

    function closeFeedback() {
      if (dialog.open) dialog.close();
    }

    opener.addEventListener("click", openFeedback);
    document.querySelector("[data-site-feedback-close]").addEventListener("click", closeFeedback);
    dialog.addEventListener("close", () => {
      document.body.classList.remove("site-feedback-open");
      opener.focus();
    });
    dialog.addEventListener("cancel", () => document.body.classList.remove("site-feedback-open"));

    kinds.forEach((button, index) => {
      button.addEventListener("click", () => chooseKind(button.dataset.feedbackKind));
      button.addEventListener("keydown", event => {
        if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) return;
        event.preventDefault();
        const direction = event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 1;
        const next = kinds[(index + direction + kinds.length) % kinds.length];
        chooseKind(next.dataset.feedbackKind, true);
      });
    });

    form.addEventListener("submit", async event => {
      event.preventDefault();
      if (busy) return;
      const text = message.value.trim();
      if (!selectedKind) {
        setStatus("Choose a feedback type first.", true);
        kinds[0].focus();
        return;
      }
      if (text.length < 3) {
        setStatus("Write a short message first.", true);
        message.focus();
        return;
      }
      busy = true;
      submit.disabled = true;
      setStatus("Sending…");
      try {
        const response = await fetch("/api/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ kind: selectedKind, message: text, page: location.pathname, website: form.elements.website.value })
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(response.status === 429 ? "rate_limited" : result?.error?.code || "unavailable");
        setStatus(`Thanks — feedback saved. Reference: ${result.reference}`);
        window.ChoreConsent?.track("feedback_submitted", { kind: selectedKind, page: location.pathname });
        message.value = "";
        form.elements.website.value = "";
        chooseKind(null);
      } catch (error) {
        setStatus(error.message === "rate_limited" ? "Feedback is busy right now. Try again in about 10 minutes." : "We could not save that message right now. Your text is still here so you can retry.", true);
      } finally {
        busy = false;
        submit.disabled = false;
      }
    });

    chooseKind(null);
  }

  document.addEventListener("DOMContentLoaded", initializeFeedback);
})();
