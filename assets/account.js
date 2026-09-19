(() => {
  'use strict';
  const element = (id) => document.getElementById(id);
  const status = (message) => { element('account-status').textContent = message; };
  let googleScript;
  async function api(path, body) {
    const response = await fetch(path, { credentials: 'same-origin', cache: 'no-store',
      ...(body === undefined ? {} : { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }) });
    if (response.status === 204) return {};
    const result = await response.json();
    if (!response.ok) throw new Error(result.error?.message || 'Please try again later.');
    return result;
  }
  function loadGoogle() {
    if (!googleScript) googleScript = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.onload = resolve;
      script.onerror = () => { googleScript = null; script.remove(); reject(new Error('Google could not load. Please try again.')); };
      document.head.append(script);
    });
    return googleScript;
  }
  async function orders() {
    const result = await api('/api/billing/orders');
    const list = element('test-orders');
    list.replaceChildren();
    for (const order of result.orders) {
      const item = document.createElement('li');
      item.textContent = `Test payment — ${order.status} — ${new Date(order.created_at * 1000).toLocaleString()}`;
      list.append(item);
    }
    if (!result.orders.length) { const item = document.createElement('li'); item.textContent = 'No test payments yet.'; list.append(item); }
  }
  async function refresh() {
    const [config, me] = await Promise.all([api('/api/membership'), api('/api/me')]);
    element('sign-in-panel').hidden = me.authenticated || !config.accounts.enabled || config.accounts.method !== 'google';
    element('signed-in-panel').hidden = !me.authenticated;
    element('test-billing-panel').hidden = !me.authenticated || !config.testPayments?.enabled;
    element('account-email').textContent = me.user?.email || '';
    status(me.authenticated ? 'You are signed in. Your charts remain stored locally.' : config.accounts.enabled ? 'Sign in when you are ready.' : 'Google sign-in is being prepared. The free chart maker is available now.');
    if (me.authenticated && config.testPayments?.enabled) await orders();
  }
  element('adult-confirmation').addEventListener('change', (event) => {
    element('prepare-google').disabled = !event.target.checked;
    if (!event.target.checked) element('google-button').replaceChildren();
  });
  element('prepare-google').addEventListener('click', async () => {
    const button = element('prepare-google'); button.disabled = true;
    try {
      const challenge = await api('/api/auth/google/challenge', {});
      await loadGoogle();
      window.google.accounts.id.initialize({ client_id: challenge.clientId, nonce: challenge.nonce, auto_select: false,
        callback: async ({ credential }) => {
          try {
            await api('/api/auth/google', { credential, adult: element('adult-confirmation').checked });
            element('google-button').replaceChildren(); await refresh();
          } catch (error) { status(error.message); button.disabled = !element('adult-confirmation').checked; }
        } });
      element('google-button').replaceChildren();
      window.google.accounts.id.renderButton(element('google-button'), { theme: 'outline', size: 'large', text: 'signin_with' });
      status('Use the Google button below to sign in.');
    } catch (error) { status(error.message); }
    finally { button.disabled = !element('adult-confirmation').checked; }
  });
  element('sign-out').addEventListener('click', async () => {
    try { await api('/api/logout', {}); window.google?.accounts.id.disableAutoSelect(); await refresh(); }
    catch (error) { status(error.message); }
  });
  element('test-checkout').addEventListener('click', async () => {
    const button = element('test-checkout'); button.disabled = true;
    try {
      const result = await api('/api/billing/checkout', {});
      if (!result.testMode || new URL(result.url).origin !== 'https://checkout.stripe.com') throw new Error('Invalid checkout destination.');
      window.location.assign(result.url);
    } catch (error) { status(error.message); button.disabled = false; }
  });
  element('refresh-orders').addEventListener('click', () => orders().catch((error) => status(error.message)));
  refresh().catch(() => status('Account services are temporarily unavailable. You can still use the free chart maker.'));
})();
