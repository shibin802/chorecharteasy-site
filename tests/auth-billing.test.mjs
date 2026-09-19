import test from 'node:test';
import assert from 'node:assert/strict';
import { DatabaseSync } from 'node:sqlite';
import { readFileSync } from 'node:fs';
import { generateKeyPair, exportJWK, SignJWT } from 'jose';
import { createHmac } from 'node:crypto';
import { handleApiRequest } from '../functions/_lib/api.mjs';
import { testBillingReady } from '../functions/_lib/billing.mjs';

const { privateKey, publicKey } = await generateKeyPair('RS256');
const jwk = { ...await exportJWK(publicKey), kid: 'test-key', alg: 'RS256', use: 'sig' };
const origin = 'https://chorecharteasy.test';
const env = { AUTH_ENABLED: 'true', GOOGLE_CLIENT_ID: 'client.test', SESSION_SECRET: 's'.repeat(40), RATE_LIMIT_SALT: 'r'.repeat(40), PUBLIC_ORIGIN: origin };
const sql = new DatabaseSync(':memory:');
for (const file of ['0001_initial.sql', '0002_feedback.sql', '0003_google_auth.sql', '0004_stripe_test.sql', '0008_user_activity.sql', '0009_feedback_contacts.sql']) {
  const migration = readFileSync(new URL(`../backend/migrations/${file}`, import.meta.url), 'utf8');
  sql.exec(migration); sql.exec(migration);
}
sql.exec(readFileSync(new URL('../backend/migrations/0010_feedback_email.sql', import.meta.url), 'utf8'));
const syncEmail = readFileSync(new URL('../backend/migrations/0011_feedback_email_sync.sql', import.meta.url), 'utf8');
sql.exec(syncEmail); sql.exec(syncEmail);
function prepared(query, values = []) {
  return { bind: (...args) => prepared(query, args),
    first: async () => sql.prepare(query).get(...values) || null,
    all: async () => ({ results: sql.prepare(query).all(...values) }),
    run: async () => ({ meta: { changes: sql.prepare(query).run(...values).changes } }),
  };
}
env.DB = { prepare: prepared, batch: async (statements) => {
  sql.exec('BEGIN');
  try { const result = []; for (const statement of statements) result.push(await statement.run()); sql.exec('COMMIT'); return result; }
  catch (error) { sql.exec('ROLLBACK'); throw error; }
} };
let checkoutPayload;
globalThis.fetch = async (input, init) => {
  const url = String(input);
  if (url === 'https://www.googleapis.com/oauth2/v3/certs') return Response.json({ keys: [jwk] });
  if (url.includes('/v1/prices/price_test')) return Response.json({ id: 'price_test', active: true, livemode: false, type: 'one_time', unit_amount: 100, currency: 'usd' });
  if (url.includes('/v1/checkout/sessions')) {
    checkoutPayload = new URLSearchParams(init.body);
    return Response.json({ id: 'cs_test_example', livemode: false, url: 'https://checkout.stripe.com/c/pay/cs_test_example', expires_at: Math.floor(Date.now() / 1000) + 3600 });
  }
  throw new Error(`Unexpected outbound request ${url}`);
};
async function call(path, { method = 'GET', body, cookie, requestOrigin = origin, headers = {} } = {}, bindings = env) {
  return handleApiRequest({ request: new Request(origin + path, { method,
    headers: { Origin: requestOrigin, ...(body ? { 'Content-Type': 'application/json' } : {}), ...(cookie ? { Cookie: cookie } : {}), ...headers },
    ...(body ? { body: typeof body === 'string' ? body : JSON.stringify(body) } : {}),
  }), env: bindings });
}
async function challenge() {
  const response = await call('/api/auth/google/challenge', { method: 'POST', body: {} });
  assert.equal(response.status, 200);
  return { ...(await response.json()), cookie: response.headers.get('set-cookie').split(';')[0] };
}
async function credential(nonce, overrides = {}) {
  return new SignJWT({ email: 'parent@example.test', email_verified: true, nonce, ...overrides })
    .setProtectedHeader({ alg: 'RS256', kid: 'test-key' }).setSubject('google-parent').setIssuer('https://accounts.google.com')
    .setAudience(overrides.aud || env.GOOGLE_CLIENT_ID).setIssuedAt().setExpirationTime('5m').sign(privateKey);
}

test('disabled and cross-origin requests fail closed without database access', async () => {
  assert.equal((await call('/api/auth/google/challenge', { method: 'POST', body: {} }, {})).status, 503);
  assert.equal((await call('/api/auth/google/challenge', { method: 'POST', requestOrigin: 'https://attacker.test', body: {} })).status, 403);
  assert.equal(testBillingReady({ ...env, STRIPE_TEST_ENABLED: 'true', STRIPE_SECRET_KEY: 'rk_live_fake', STRIPE_PRICE_ID: 'price_test', STRIPE_WEBHOOK_SECRET: 'fake' }), false);
});

test('Google rejects forged tokens, wrong audience, nonce mismatch and missing adult confirmation', async () => {
  const c = await challenge();
  for (const token of ['forged', await credential(c.nonce, { aud: 'wrong-client' }), await credential('wrong-nonce')]) {
    assert.equal((await call('/api/auth/google', { method: 'POST', cookie: c.cookie, body: { credential: token, adult: true } })).status, 401);
  }
  assert.equal((await call('/api/auth/google', { method: 'POST', cookie: c.cookie, body: { credential: await credential(c.nonce), adult: false } })).status, 422);
  assert.equal(sql.prepare('SELECT count(*) n FROM users').get().n, 0);
});

let sessionCookie;
test('verified Google identity creates a secure session; challenge replay fails; logout revokes it', async () => {
  const c = await challenge();
  const body = { credential: await credential(c.nonce), adult: true };
  const response = await call('/api/auth/google', { method: 'POST', cookie: c.cookie, body });
  assert.equal(response.status, 200);
  sessionCookie = response.headers.getSetCookie().find((value) => value.startsWith('cce_session=')).split(';')[0];
  assert.match(response.headers.get('set-cookie'), /HttpOnly; Secure; SameSite=Lax/);
  assert.equal((await (await call('/api/me', { cookie: sessionCookie })).json()).authenticated, true);
  assert.equal((await call('/api/auth/google', { method: 'POST', cookie: c.cookie, body })).status, 401);
  assert.notEqual(sql.prepare('SELECT token_hash FROM sessions LIMIT 1').get().token_hash, sessionCookie.split('=')[1]);
});

test('signed-in login preparation redirects without creating another nonce', async () => {
 const before=sql.prepare('SELECT count(*) n FROM auth_nonces').get().n;
 const response=await call('/api/auth/google/challenge',{method:'POST',body:{},cookie:sessionCookie});
 assert.equal((await response.json()).authenticated,true);
 assert.equal(sql.prepare('SELECT count(*) n FROM auth_nonces').get().n,before);
 const stale=await call('/api/auth/google/challenge',{method:'POST',body:{},cookie:'cce_session=expired'});
 assert.ok((await stale.json()).nonce);
});

test('feedback stores optional email, defaults to the verified session, and permits clearing it', async () => {
 const base={kind:'idea',message:'A useful improvement',page:'/'};
 for (const [body,cookie,expected] of [[base,undefined,null],[{...base,email:'Reply@Example.com'},undefined,'reply@example.com'],[base,sessionCookie,sql.prepare('SELECT email FROM users LIMIT 1').get().email],[{...base,email:''},sessionCookie,null]]) {
  const response=await call('/api/feedback',{method:'POST',body,cookie});
  assert.equal(response.status,201);
  const {reference}=await response.json();
  assert.equal(sql.prepare('SELECT email FROM feedback_details WHERE reference=?').get(reference).email,expected);
  assert.equal(sql.prepare('SELECT email FROM feedback_submissions WHERE reference=?').get(reference).email,expected);
 }
 const count=sql.prepare('SELECT count(*) n FROM feedback_submissions').get().n;
 for(const email of ['invalid',42,'a'.repeat(255)+'@example.com']) assert.equal((await call('/api/feedback',{method:'POST',body:{...base,email}})).status,422);
 assert.equal(sql.prepare('SELECT count(*) n FROM feedback_submissions').get().n,count);
});

test('authenticated print route validates JSON and persists to D1', async () => {
  const body={id:crypto.randomUUID(),type:'print_requested',paper:'a4',starter:'weekly',taskCount:5};
  const response=await call('/api/activity/print',{method:'POST',cookie:sessionCookie,body});
  assert.equal(response.status,200,JSON.stringify(await response.json()));
  assert.equal(sql.prepare("SELECT count(*) n FROM user_activity WHERE source='browser'").get().n,1);
  assert.equal((await call('/api/activity/print',{method:'POST',cookie:sessionCookie,body:{...body,userId:'other'}})).status,400);
});

test('Stripe checkout requires a session and uses only the server price; webhook signature and idempotency are enforced', async () => {
  Object.assign(env, { STRIPE_TEST_ENABLED: 'true', STRIPE_SECRET_KEY: 'rk_test_fixture', STRIPE_PRICE_ID: 'price_test', STRIPE_WEBHOOK_SECRET: 'whsec_test_fixture' });
  assert.equal((await call('/api/billing/checkout', { method: 'POST', body: {} })).status, 401);
  const response = await call('/api/billing/checkout', { method: 'POST', cookie: sessionCookie, body: { price: 'attacker-price', amount: 1 } });
  assert.equal(response.status, 200);
  assert.equal(checkoutPayload.get('line_items[0][price]'), 'price_test');
  assert.equal(checkoutPayload.has('payment_method_types[0]'), false);
  const order = sql.prepare('SELECT * FROM test_orders').get();
  const event = { id: 'evt_test_paid', type: 'checkout.session.completed', livemode: false, data: { object: {
    id: order.id, metadata: { application: 'chorecharteasy' }, client_reference_id: order.user_id,
    amount_total: 100, currency: 'usd', payment_status: 'paid',
  } } };
  const raw = JSON.stringify(event);
  assert.equal((await call('/api/billing/webhook', { method: 'POST', body: raw })).status, 400);
  async function deliver(data, timestamp = Math.floor(Date.now() / 1000)) {
    const body = JSON.stringify(data);
    const sig = createHmac('sha256', env.STRIPE_WEBHOOK_SECRET).update(`${timestamp}.${body}`).digest('hex');
    return call('/api/billing/webhook', { method: 'POST', body, headers: { 'stripe-signature': `t=${timestamp},v1=${sig}` } });
  }
  assert.equal((await deliver(event, 1)).status, 400);
  assert.equal((await deliver({ ...event, livemode: true })).status, 400);
  assert.equal((await deliver(event)).status, 200);
  assert.equal((await deliver(event)).status, 200);
  assert.equal(sql.prepare('SELECT status FROM test_orders').get().status, 'paid');
  assert.equal(sql.prepare('SELECT count(*) n FROM stripe_test_events').get().n, 1);
  assert.equal(sql.prepare('SELECT count(*) n FROM memberships').get().n, 0);
  await deliver({ ...event, id: 'evt_older_expiry', type: 'checkout.session.expired', data: { object: { ...event.data.object, payment_status: 'unpaid' } } });
  assert.equal(sql.prepare('SELECT status FROM test_orders').get().status, 'paid');
  const other = { ...env, AUTH_ENABLED: 'false' };
  assert.equal((await (await call('/api/membership', {}, other)).json()).payments.enabled, false);
  assert.equal((await call('/api/logout', { method: 'POST', cookie: sessionCookie, body: {} })).status, 204);
  assert.equal((await (await call('/api/me', { cookie: sessionCookie })).json()).authenticated, false);
  assert.equal((await call('/api/billing/orders', { cookie: sessionCookie })).status, 401);
});
