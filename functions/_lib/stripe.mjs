import Stripe from "stripe";

const STRIPE_API_VERSION = "2026-07-29.dahlia";

export function checkoutConfigured(env) {
  let validOrigin = false;
  try {
    const origin = new URL(env?.PUBLIC_ORIGIN);
    validOrigin = origin.protocol === "https:" && origin.origin === env.PUBLIC_ORIGIN;
  } catch {}
  return env?.PAYMENTS_ENABLED === "true"
    && typeof env?.STRIPE_SECRET_KEY === "string"
    && /^(?:sk|rk)_(?:test|live)_/u.test(env.STRIPE_SECRET_KEY)
    && typeof env?.STRIPE_PRICE_ID === "string"
    && /^price_[A-Za-z0-9]+$/u.test(env.STRIPE_PRICE_ID)
    && validOrigin;
}

export function stripeClient(env) {
  if (!checkoutConfigured(env)) throw new Error("Stripe checkout is not configured");
  return new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: STRIPE_API_VERSION,
    httpClient: Stripe.createFetchHttpClient(),
  });
}

export function integrationIdentifier() {
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  const suffix = Array.from(bytes, (byte) => String.fromCharCode(97 + (byte % 26))).join("");
  return `chorecharteasy_${suffix}`;
}
