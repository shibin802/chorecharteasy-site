import { api, safeReturn } from './auth-common.js';
const status = document.getElementById('account-status');
const retry = document.getElementById('retry-google');
const target = safeReturn(new URLSearchParams(location.search).get('next'));
let scriptPromise;
function loadGoogle() {
  if (!scriptPromise) scriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.onload = resolve;
    script.onerror = () => { scriptPromise = null; script.remove(); reject(new Error('Google could not load. Check your connection and try again.')); };
    document.head.append(script);
  });
  return scriptPromise;
}
async function prepare() {
  retry.hidden = true;
  status.textContent = 'Loading Google sign-in…';
  document.getElementById('google-button').replaceChildren();
  try {
    const me = await api('/api/me');
    if (me.authenticated) { location.replace(target); return; }
    const challenge = await api('/api/auth/google/challenge', {});
    await loadGoogle();
    window.google.accounts.id.initialize({ client_id: challenge.clientId, nonce: challenge.nonce, auto_select: false,
      callback: async ({ credential }) => {
        status.textContent = 'Signing you in…';
        try {
          await api('/api/auth/google', { credential, adult: true });
          location.replace(target);
        } catch (error) { status.textContent = error.message; retry.hidden = false; }
      } });
    window.google.accounts.id.renderButton(document.getElementById('google-button'), {
      theme: 'outline', size: 'large', text: 'continue_with', shape: 'rectangular',
      width: Math.min(360, document.getElementById('google-button').clientWidth), locale: 'en'
    });
    status.textContent = '';
  } catch (error) { status.textContent = error.message; retry.hidden = false; }
}
retry.addEventListener('click', prepare);
prepare();
