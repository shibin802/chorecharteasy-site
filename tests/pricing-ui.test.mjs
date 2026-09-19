import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const source = readFileSync(new URL('../assets/pricing.js', import.meta.url), 'utf8').replace(/^import .*;$/gm, '');
async function page(me, action) {
  const elements = Object.fromEntries(['subscribe', 'manage-existing-billing', 'pricing-status', 'monthly-price', 'checkout-step', 'billing-mode'].map(id => [id, { addEventListener(type, handler) { this.click = handler; } }]));
  const calls = [], redirects = [];
  vm.runInNewContext(source, {
    document: { getElementById: id => elements[id] }, Intl, URL,
    location: { assign: url => redirects.push(url) }, loginUrl: next => '/login?next=' + encodeURIComponent(next),
    api: async (path) => {
      calls.push(path);
      if (path === '/api/billing/plan') return { enabled: true, amount: 100 };
      if (path === '/api/me') return me;
      return action(path);
    },
  });
  await new Promise(resolve => setImmediate(resolve));
  return { elements, calls, redirects };
}
test('existing free billing accounts can recover payments without blocking resubscription', async () => {
  const p = await page({ authenticated: true, billingAccount: true, membership: { plan: 'free' } }, path => ({ url: path.endsWith('/portal') ? 'https://billing.stripe.com/session' : 'https://checkout.stripe.com/session' }));
  assert.equal(p.elements['manage-existing-billing'].hidden, false);
  assert.equal(p.elements.subscribe.textContent, 'Get watermark-free prints');
  await p.elements['manage-existing-billing'].click();
  assert.equal(p.calls.at(-1), '/api/billing/portal');
  assert.equal(p.redirects.at(-1), 'https://billing.stripe.com/session');
  await p.elements.subscribe.click();
  assert.equal(p.calls.at(-1), '/api/billing/subscribe');
});
test('Plus cancellation is explained and failed billing requests can be retried', async () => {
  let attempts = 0;
  const p = await page({ authenticated: true, billingAccount: true, membership: { plan: 'plus', cancelAtPeriodEnd: true } }, () => { if (++attempts === 1) throw Error('Temporary failure'); return { url: 'https://billing.stripe.com/session' }; });
  assert.equal(p.elements['manage-existing-billing'].hidden, true);
  assert.match(p.elements['pricing-status'].textContent, /Renewal is canceled/);
  await p.elements.subscribe.click();
  assert.equal(p.elements.subscribe.disabled, false);
  assert.equal(p.elements['manage-existing-billing'].disabled, false);
  assert.equal(p.elements['pricing-status'].textContent, 'Temporary failure');
  await p.elements.subscribe.click();
  assert.equal(p.calls.at(-1), '/api/billing/portal');
  assert.equal(p.redirects.at(-1), 'https://billing.stripe.com/session');
});
test('guests return to pricing after sign-in and have no billing-management action', async () => {
  const p = await page({ authenticated: false, membership: { plan: 'free' } }, () => { throw Error('Unexpected billing request'); });
  assert.equal(p.elements['manage-existing-billing'].hidden, true);
  await p.elements.subscribe.click();
  assert.deepEqual(p.redirects, ['/login?next=%2Fpricing']);
  assert.equal(p.calls.length, 2);
});
