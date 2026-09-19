import { api, loginUrl } from './auth-common.js';
import './auth-nav.js';
const status = document.getElementById('account-status');
async function orders() {
  const result = await api('/api/billing/orders');
  const list = document.getElementById('test-orders'); list.replaceChildren();
  for (const order of result.orders) { const item = document.createElement('li'); item.textContent = `Test payment — ${order.status} — ${new Date(order.created_at * 1000).toLocaleString()}`; list.append(item); }
  if (!result.orders.length) { const item = document.createElement('li'); item.textContent = 'No test payments yet.'; list.append(item); }
}
async function load() {
  try {
    const me = await api('/api/me');
    if (!me.authenticated) { location.replace(loginUrl('/billing-test')); return; }
    const config = await api('/api/membership');
    if (!config.testPayments?.enabled) { status.textContent = 'Payment testing is unavailable.'; return; }
    document.getElementById('test-billing-panel').hidden = false; status.textContent = ''; await orders();
  } catch(error) { status.textContent = error.message; }
}
document.getElementById('test-checkout').addEventListener('click', async event => {
  const button = event.currentTarget; button.disabled = true;
  try { const result = await api('/api/billing/checkout', {});
    if (!result.testMode || new URL(result.url).origin !== 'https://checkout.stripe.com') throw new Error('Invalid checkout destination.');
    location.assign(result.url);
  } catch(error) { status.textContent = error.message; button.disabled = false; }
});
document.getElementById('refresh-orders').addEventListener('click', () => orders().catch(error => { status.textContent = error.message; }));
load();
