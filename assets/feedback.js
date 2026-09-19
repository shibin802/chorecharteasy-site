(() => {
  "use strict";

  const markup = `
    <button class="site-feedback-trigger" type="button" data-site-feedback-open aria-haspopup="dialog"><span aria-hidden="true">✎</span> Feedback</button>
    <dialog class="site-feedback-dialog" id="site-feedback-dialog" aria-labelledby="site-feedback-title" aria-describedby="site-feedback-description">
      <div class="site-feedback-inner">
        <button class="site-feedback-close" type="button" data-site-feedback-close aria-label="Close feedback form">×</button>
        <p class="site-feedback-eyebrow">Made better with you</p>
        <h2 id="site-feedback-title">What’s on your mind?</h2>
        <p class="site-feedback-description" id="site-feedback-description">A small idea can make family routines a little easier.</p>
        <form data-site-feedback-form novalidate>
          <fieldset>
            <legend>I’d like to share…</legend>
            <div class="site-feedback-kinds" role="radiogroup" aria-label="Feedback type">
              <button class="site-feedback-kind" type="button" role="radio" aria-checked="false" data-feedback-kind="idea"><span class="site-feedback-symbol" aria-hidden="true">+</span>Idea</button>
              <button class="site-feedback-kind" type="button" role="radio" aria-checked="false" data-feedback-kind="problem"><span class="site-feedback-symbol" aria-hidden="true">!</span>Problem</button>
              <button class="site-feedback-kind" type="button" role="radio" aria-checked="false" data-feedback-kind="helpful"><span class="site-feedback-symbol" aria-hidden="true">✓</span>Helpful</button>
              <button class="site-feedback-kind" type="button" role="radio" aria-checked="false" data-feedback-kind="other"><span class="site-feedback-symbol" aria-hidden="true">…</span>Other</button>
            </div>
          </fieldset>
          <label class="site-feedback-field" for="site-feedback-message"><span>Your message</span><textarea id="site-feedback-message" name="message" rows="4" aria-describedby="site-feedback-hint site-feedback-count" maxlength="1000" required placeholder="What happened, or what would make this easier?"></textarea></label>
          <label class="site-feedback-honeypot" aria-hidden="true">Website<input name="website" type="text" tabindex="-1" autocomplete="off"></label>
          <div class="site-feedback-meta"><span id="site-feedback-hint">A few details are all we need.</span><span id="site-feedback-count">0 / 1,000</span></div>
          <p class="site-feedback-privacy">Please leave out names, contact details, and children’s information or chart content. <a href="/privacy#support">How feedback is stored</a></p>
          <div class="site-feedback-status" data-site-feedback-status role="status" aria-live="polite"></div>
          <button class="site-feedback-submit" type="submit">Send feedback <span aria-hidden="true">→</span></button>
          <p class="site-feedback-support">Need help with a payment? <a href="/account">Go to your account</a></p>
        </form>
        <section class="site-feedback-success" data-feedback-success hidden aria-labelledby="feedback-success-title">
          <span class="site-feedback-check" aria-hidden="true">✓</span>
          <h3 id="feedback-success-title" tabindex="-1">Thanks for helping us improve.</h3>
          <p>Your feedback has been saved. Keep this reference if you need to contact us about it.</p>
          <p class="site-feedback-reference" data-feedback-reference></p>
          <button class="site-feedback-submit" type="button" data-feedback-done>Done</button>
        </section>
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
    const success = document.querySelector("[data-feedback-success]");
    const counter = document.getElementById("site-feedback-count");
    const prompts = {idea:"What would make the chart maker more useful for you?",problem:"What were you trying to do, and what happened instead?",helpful:"What worked well for you?",other:"What would you like us to know?"};
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
      message.placeholder = prompts[kind] || "What happened, or what would make this easier?";
      kinds.forEach(button => {
        const selected = button.dataset.feedbackKind === kind;
        button.setAttribute("aria-checked", selected ? "true" : "false");
        button.tabIndex = selected || (!kind && button === kinds[0]) ? 0 : -1;
        if (selected && focus) button.focus();
      });
    }

    function openFeedback() {
      if (success.hidden) setStatus();
      if (!dialog.open) dialog.showModal();
      document.body.classList.add("site-feedback-open");
      window.ChoreConsent?.track("feedback_opened", { page: location.pathname });
      (success.hidden ? (selectedKind ? message : kinds[0]) : document.getElementById("feedback-success-title")).focus();
    }

    function closeFeedback() {
      if (dialog.open) dialog.close();
    }

    message.addEventListener("input", () => {
      counter.textContent = `${message.value.length} / 1,000`;
      message.removeAttribute("aria-invalid");
    });
    document.querySelector("[data-feedback-done]").addEventListener("click", () => {
      closeFeedback(); success.hidden = true; form.hidden = false; setStatus();
    });
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
        message.setAttribute("aria-invalid", "true");
        message.focus();
        return;
      }
      busy = true;
      submit.disabled = true;
      form.setAttribute("aria-busy", "true");
      const sentKind = selectedKind;
      setStatus("Sending…");
      try {
        const response = await fetch("/api/feedback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ kind: sentKind, message: text, page: location.pathname, website: form.elements.website.value })
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(response.status === 429 ? "rate_limited" : result?.error?.code || "unavailable");
        setStatus();
        document.querySelector("[data-feedback-reference]").textContent = result.reference ? `Reference: ${result.reference}` : "Feedback received.";
        form.hidden = true; success.hidden = false;
        document.getElementById("feedback-success-title").focus();
        window.ChoreConsent?.track("feedback_submitted", { kind: sentKind, page: location.pathname });
        message.value = "";
        counter.textContent = "0 / 1,000";
        form.elements.website.value = "";
        chooseKind(null);
      } catch (error) {
        setStatus(error.message === "rate_limited" ? "Feedback is busy right now. Try again in about 10 minutes." : "We could not save that message right now. Your text is still here so you can retry.", true);
      } finally {
        busy = false;
        submit.disabled = false;
        form.removeAttribute("aria-busy");
      }
    });

    chooseKind(null);
  }

  document.addEventListener("DOMContentLoaded", initializeFeedback);
})();
