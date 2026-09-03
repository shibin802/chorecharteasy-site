(() => {
  "use strict";

  const button = document.querySelector("#start-checkout");
  const status = document.querySelector("#checkout-status");
  if (!button || !status) return;

  function setStatus(message, state = "") {
    status.textContent = message;
    status.className = `plus-status${state ? ` ${state}` : ""}`;
  }

  async function readJson(response) {
    try { return await response.json(); } catch { return null; }
  }

  async function loadAvailability() {
    try {
      const response = await fetch("/api/membership", { headers: { Accept: "application/json" } });
      const payload = await readJson(response);
      if (!response.ok || !payload?.payments?.enabled) return;
      button.disabled = false;
      button.textContent = `Buy Plus for ${payload.plus?.price?.display || "$4.99"}`;
      setStatus("Secure Stripe checkout is ready.", "ready");
    } catch {
      setStatus("Checkout availability could not be confirmed. The free maker still works.", "error");
    }
  }

  async function startCheckout() {
    button.disabled = true;
    button.textContent = "Opening secure checkout…";
    setStatus("Creating a Stripe Checkout Session…", "ready");
    window.ChoreConsent?.track("checkout_started", { product: "plus_starter_pack", value: 4.99, currency: "USD" });
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({ product: "plus_starter_pack" }),
      });
      const payload = await readJson(response);
      if (!response.ok) throw new Error(payload?.error?.message || "Secure checkout could not be opened.");
      const checkoutUrl = new URL(payload.url);
      if (checkoutUrl.protocol !== "https:" || checkoutUrl.hostname !== "checkout.stripe.com") {
        throw new Error("The checkout destination could not be verified.");
      }
      window.ChoreConsent?.track("checkout_redirected", { product: "plus_starter_pack" });
      location.assign(checkoutUrl.href);
    } catch (error) {
      button.disabled = false;
      button.textContent = "Try secure checkout again";
      setStatus(error instanceof Error ? error.message : "Secure checkout could not be opened.", "error");
      window.ChoreConsent?.track("checkout_unavailable", { product: "plus_starter_pack" });
    }
  }

  button.addEventListener("click", startCheckout);
  loadAvailability();
})();
