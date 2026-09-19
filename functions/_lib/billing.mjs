import Stripe from 'stripe';

// Sandbox only until the merchant specifies the product, delivery and refund terms.
export function testBillingReady(env) {
  return env?.STRIPE_TEST_ENABLED === 'true'
    && /^(rk|sk)_test_/.test(env.STRIPE_SECRET_KEY || '')
    && /^price_/.test(env.STRIPE_PRICE_ID || '')
    && Boolean(env.STRIPE_WEBHOOK_SECRET && env.DB && env.PUBLIC_ORIGIN);
}

export function stripeClient(env) {
  if (!testBillingReady(env)) throw new Error('Billing is not configured');
  return new Stripe(env.STRIPE_SECRET_KEY, { httpClient: Stripe.createFetchHttpClient(), maxNetworkRetries: 2 });
}

export async function testCheckout(request, env, helpers) {
  const { ApiError, assertSameOrigin, currentUser, jsonResponse, checkRateLimit, pseudonymousBucket } = helpers;
  if (request.method !== 'POST') throw new ApiError(405, 'method_not_allowed', 'Use POST.', { Allow: 'POST' });
  assertSameOrigin(request, env);
  if (!testBillingReady(env)) throw new ApiError(503, 'billing_unavailable', 'Test checkout is not available yet.');
  const me = await (await currentUser(new Request(request.url, { headers: request.headers }), env)).json();
  if (!me.authenticated) throw new ApiError(401, 'sign_in_required', 'Please sign in first.');
  const now = Math.floor(Date.now() / 1000);
  await checkRateLimit(env.DB, await pseudonymousBucket(request, env, 'checkout', me.user.id), 10, 3600, now);
  const stripe = stripeClient(env);
  const price = await stripe.prices.retrieve(env.STRIPE_PRICE_ID);
  if (price.livemode || !price.active || price.type !== 'one_time' || !Number.isInteger(price.unit_amount) || price.unit_amount <= 0) {
    throw new ApiError(503, 'billing_unavailable', 'A one-time test price must be configured.');
  }
  const pending = await env.DB.prepare("SELECT id, checkout_url FROM test_orders WHERE user_id = ? AND status = 'pending' AND expires_at > ? ORDER BY created_at DESC LIMIT 1")
    .bind(me.user.id, now + 60).first();
  if (pending?.checkout_url) return jsonResponse({ ok: true, url: pending.checkout_url, testMode: true });
  // Stable per user/price/time window: double-clicks and request retries reuse the same Checkout session.
  const idempotencyKey = `cce-test-${me.user.id}-${price.id}-${Math.floor(now / 1800)}`;
  const origin = new URL(env.PUBLIC_ORIGIN).origin;
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    adaptive_pricing: { enabled: false },
    line_items: [{ price: price.id, quantity: 1 }],
    client_reference_id: me.user.id,
    metadata: { application: 'chorecharteasy', user_id: me.user.id },
    payment_intent_data: { metadata: { application: 'chorecharteasy', user_id: me.user.id } },
    integration_identifier: 'chorecharteasy_llqgpsod',
    success_url: `${origin}/billing-test?checkout=returned`,
    cancel_url: `${origin}/billing-test?checkout=cancelled`,
  }, { idempotencyKey });
  if (session.livemode || !session.url?.startsWith('https://checkout.stripe.com/')) throw new Error('Unexpected checkout mode');
  await env.DB.prepare("INSERT INTO test_orders (id, user_id, price_id, amount, currency, status, checkout_url, expires_at, created_at, updated_at) VALUES (?, ?, ?, ?, ?, 'pending', ?, ?, ?, ?) ON CONFLICT(id) DO NOTHING")
    .bind(session.id, me.user.id, price.id, price.unit_amount, price.currency, session.url, session.expires_at, now, now).run();
  return jsonResponse({ ok: true, url: session.url, testMode: true });
}

export async function testWebhook(request, env, helpers) {
  const { ApiError, jsonResponse } = helpers;
  if (request.method !== 'POST') throw new ApiError(405, 'method_not_allowed', 'Use POST.', { Allow: 'POST' });
  if (!testBillingReady(env)) throw new ApiError(503, 'billing_unavailable', 'Test billing is unavailable.');
  const raw = await request.text();
  if (new TextEncoder().encode(raw).length > 262144) throw new ApiError(413, 'payload_too_large', 'Webhook too large.');
  let event;
  try {
    event = await stripeClient(env).webhooks.constructEventAsync(raw, request.headers.get('stripe-signature') || '', env.STRIPE_WEBHOOK_SECRET,
      300, Stripe.createSubtleCryptoProvider());
  } catch { throw new ApiError(400, 'invalid_signature', 'Invalid webhook signature.'); }
  if (event.livemode) throw new ApiError(400, 'wrong_mode', 'Only test events are accepted.');
  const supported = ['checkout.session.completed', 'checkout.session.async_payment_succeeded', 'checkout.session.expired', 'checkout.session.async_payment_failed'];
  if (!supported.includes(event.type)) return jsonResponse({ ok: true });
  const session = event.data.object;
  if (session.metadata?.application !== 'chorecharteasy') return jsonResponse({ ok: true });
  const order = await env.DB.prepare('SELECT * FROM test_orders WHERE id = ?').bind(session.id).first();
  // Retry if Stripe beats the database write after session creation.
  if (!order) throw new ApiError(503, 'order_pending', 'Order not available yet.');
  if (session.client_reference_id !== order.user_id || session.amount_total !== order.amount || session.currency !== order.currency) {
    throw new ApiError(400, 'order_mismatch', 'Checkout details do not match.');
  }
  const paid = session.payment_status === 'paid' && ['checkout.session.completed', 'checkout.session.async_payment_succeeded'].includes(event.type);
  const status = paid ? 'paid' : event.type === 'checkout.session.expired' ? 'expired' : event.type === 'checkout.session.async_payment_failed' ? 'failed' : 'pending';
  const now = Math.floor(Date.now() / 1000);
  await env.DB.batch([
    env.DB.prepare("UPDATE test_orders SET status = ?, updated_at = ? WHERE id = ? AND status != 'paid' AND NOT EXISTS (SELECT 1 FROM stripe_test_events WHERE id = ?)")
      .bind(status, now, order.id, event.id),
    env.DB.prepare('INSERT INTO stripe_test_events (id, created_at) VALUES (?, ?) ON CONFLICT(id) DO NOTHING').bind(event.id, now),
  ]);
  // Test payments never grant real product entitlements.
  return jsonResponse({ ok: true });
}
