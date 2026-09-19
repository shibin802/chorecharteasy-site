import { api, loginUrl } from './auth-common.js';
let slots = [...document.querySelectorAll('[data-auth-slot]')];
if (!slots.length) {
  const header = document.querySelector('.header-inner, header.wrap.site-header, header .wrap.site-header');
  if (header) { const slot = document.createElement('span'); slot.dataset.authSlot = ''; header.append(slot); slots = [slot]; }
}
function signedOut() {
  for (const slot of slots) {
    const link = document.createElement('a'); link.href = loginUrl(); link.className = 'auth-sign-in'; link.textContent = 'Sign in';
    slot.replaceChildren(link);
  }
}
signedOut();
api('/api/me').then(me => {
  if (!me.authenticated) return;
  for (const slot of slots) {
    const details = document.createElement('details'); details.className = 'auth-menu';
    const summary = document.createElement('summary'); summary.setAttribute('aria-label', 'Account menu');
    const avatar = document.createElement('span'); avatar.className = 'auth-avatar'; avatar.textContent = me.user.email.charAt(0).toUpperCase(); avatar.setAttribute('aria-hidden', 'true');
    const label = document.createElement('span'); label.textContent = 'My account'; summary.append(avatar, label);
    const panel = document.createElement('div'); panel.className = 'auth-dropdown';
    const email = document.createElement('p'); email.className = 'auth-menu-email'; email.textContent = me.user.email;
    const account = document.createElement('a'); account.href = '/account'; account.textContent = 'Account settings';
    const logout = document.createElement('button'); logout.type = 'button'; logout.textContent = 'Sign out';
    const message = document.createElement('p'); message.setAttribute('role', 'status'); message.className = 'auth-menu-error'; message.hidden = true;
    logout.addEventListener('click', async () => {
      logout.disabled = true;
      try { await api('/api/logout', {}); location.reload(); }
      catch { message.hidden = false; message.textContent = 'Could not sign out. Try again.'; logout.disabled = false; }
    });
    const pricing = document.createElement('a'); pricing.href = '/pricing'; pricing.textContent = 'Plans & billing';
    panel.append(email, account, pricing, logout, message); details.append(summary, panel); slot.replaceChildren(details);
    details.addEventListener('keydown', event => { if (event.key === 'Escape') { details.open = false; summary.focus(); } });
    document.addEventListener('click', event => { if (!details.contains(event.target)) details.open = false; });
  }
}).catch(() => {});
