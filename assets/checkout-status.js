(() => {
  "use strict";
  const status = document.querySelector("#payment-status");
  if (!status) return;
  const sessionId = new URLSearchParams(location.search).get("session_id");
  if (!sessionId) {
    status.textContent = "This confirmation link is incomplete. Check your Stripe receipt or contact support.";
    return;
  }
  fetch(`/api/checkout-session?session_id=${encodeURIComponent(sessionId)}`, { headers: { Accept: "application/json" } })
    .then(async response => ({ response, payload: await response.json() }))
    .then(({ response, payload }) => {
      if (!response.ok || !payload?.paid) throw new Error(payload?.error?.message || "Payment is still processing.");
      status.textContent = "Payment confirmed. Your Stripe receipt is the record of this test purchase.";
      document.querySelector("#payment-title").textContent = "Payment confirmed";
      window.ChoreConsent?.track("purchase_confirmed", { product: "plus_starter_pack", value: 4.99, currency: "USD" });
    })
    .catch(error => {
      document.querySelector("#payment-title").textContent = "We couldn't confirm payment";
      status.textContent = error instanceof Error ? error.message : "Payment confirmation is temporarily unavailable.";
    });
})();
