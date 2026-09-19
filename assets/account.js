import { api, loginUrl } from './auth-common.js';
import './auth-nav.js';
const status = document.getElementById('account-status');
async function load() {
  try {
    const me = await api('/api/me');
    if (!me.authenticated) { location.replace(loginUrl('/account')); return; }
    document.getElementById('account-email').textContent = me.user.email;
    document.getElementById('account-avatar').textContent = me.user.email.charAt(0).toUpperCase();
    document.getElementById('account-details').hidden = false;
    document.getElementById('manage-billing').hidden = !me.billingAccount;
    document.getElementById('refresh-plan').hidden = !new URLSearchParams(location.search).has('subscription');
    document.getElementById('account-plan').textContent = me.membership.plan === 'plus' ? 'Plus' : 'Free';
    document.getElementById('upgrade-plan').hidden = me.membership.plan === 'plus';
    document.getElementById('subscription-status').textContent = me.membership.plan === 'plus' ? (me.membership.cancelAtPeriodEnd ? 'Ends ' : 'Current paid period ends ') + new Date(me.membership.expiresAt * 1000).toLocaleDateString() : 'Free prints include a watermark. Upgrade to Plus to remove it.';
    status.textContent = new URLSearchParams(location.search).has('subscription') && me.membership.plan !== 'plus' ? 'Waiting for payment confirmation. Refresh your plan in a moment.' : '';
  } catch { status.textContent = 'Your account could not load. Please refresh to try again.'; }
}
document.getElementById('sign-out').addEventListener('click', async () => {
  try { await api('/api/logout', {}); location.assign('/'); }
  catch (error) { status.textContent = error.message; }
});
load();

document.getElementById('refresh-plan').addEventListener('click', load);
document.getElementById('manage-billing').addEventListener('click', async () => { try { const result=await api('/api/billing/portal',{}); if(new URL(result.url).origin !== 'https://billing.stripe.com') throw new Error('Unable to open billing.'); location.assign(result.url); } catch(error) {status.textContent=error.message;} });
