import { api, safeReturn } from './auth-common.js';
const status = document.getElementById('account-status');
const retry = document.getElementById('retry-google');
const target = safeReturn(new URLSearchParams(location.search).get('next'));
const googleAssets = new Map();
function loadGoogleAsset(kind, url) {
  if (googleAssets.has(url)) return googleAssets.get(url);
  const promise = new Promise((resolve, reject) => {
    const element = document.createElement(kind);
    if (kind === 'link') { element.rel = 'stylesheet'; element.href = url; }
    else element.src = url;
    const fail = () => {
      clearTimeout(timer);
      element.onload = element.onerror = null;
      element.remove();
      reject(new Error('Google could not load. Check your connection and try again.'));
    };
    const timer = setTimeout(fail, 10000);
    element.onload = () => { clearTimeout(timer); element.onload = element.onerror = null; resolve(); };
    element.onerror = fail;
    document.head.append(element);
  }).catch(error => { googleAssets.delete(url); throw error; });
  googleAssets.set(url, promise);
  return promise;
}
async function loadGoogle() {
  // GIS inserts a fallback SVG before its iframe is ready. Its stylesheet must
  // already be loaded or the unstyled SVG expands to the full container width.
  await Promise.all([
    loadGoogleAsset('link', 'https://accounts.google.com/gsi/style'),
    loadGoogleAsset('script', 'https://accounts.google.com/gsi/client')
  ]);
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
