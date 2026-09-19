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
    status.textContent = '';
  } catch { status.textContent = 'Your account could not load. Please refresh to try again.'; }
}
document.getElementById('sign-out').addEventListener('click', async () => {
  try { await api('/api/logout', {}); location.assign('/'); }
  catch (error) { status.textContent = error.message; }
});
load();
