import { api, loginUrl } from './auth-common.js';
import './auth-nav.js';
const button = document.getElementById('subscribe');
const billingButton = document.getElementById('manage-existing-billing');
const status = document.getElementById('pricing-status');
let signedIn = false, plus = false, ready = false;
async function load() {
  try {
    const [plan, me] = await Promise.all([api('/api/billing/plan'), api('/api/me')]);
    ready = true;
    signedIn = me.authenticated;
    plus = me.membership?.plan === 'plus';
    document.getElementById('monthly-price').textContent = new Intl.NumberFormat('en-US', {style:'currency', currency:'USD', maximumFractionDigits:2}).format(plan.amount / 100);
    button.textContent = plus ? 'Manage subscription' : signedIn ? 'Subscribe to Plus' : 'Continue with Google';
    button.disabled = !plan.enabled;
    billingButton.hidden = !signedIn || !me.billingAccount || plus;
    status.textContent = !plan.enabled ? 'Subscription checkout is being prepared. Please check back soon.'
      : plus ? (me.membership.cancelAtPeriodEnd ? 'Your Plus plan ends at the end of your paid period. Renewal is canceled.' : 'Your Plus subscription is active.') : '';
  } catch {
    button.textContent = 'Try again';
    button.disabled = false;
    billingButton.hidden = true;
    status.textContent = 'Unable to load pricing. Please try again.';
    ready = false;
  }
}
async function openBilling(portal) {
  button.disabled = true;
  billingButton.disabled = true;
  status.textContent = portal ? 'Opening subscription management…' : 'Opening secure checkout…';
  try {
    const result = await api(portal ? '/api/billing/portal' : '/api/billing/subscribe', {});
    const url = new URL(result.url);
    if (url.origin !== (portal ? 'https://billing.stripe.com' : 'https://checkout.stripe.com')) throw new Error('Unable to open billing.');
    location.assign(url.href);
  } catch (error) {
    status.textContent = error.message;
    button.disabled = false;
    billingButton.disabled = false;
  }
}
button.addEventListener('click', async () => {
  if (!ready) { await load(); return; }
  if (!signedIn) { location.assign(loginUrl('/pricing')); return; }
  await openBilling(plus);
});
billingButton.addEventListener('click', () => openBilling(true));
load();
