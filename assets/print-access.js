(() => {
  let expiresAt = 0;
  function apply() {
    const premium = expiresAt > Date.now() / 1000;
    document.documentElement.classList.toggle('watermark-free', premium);
    document.querySelectorAll('[data-print-plan]').forEach(el => { el.textContent = premium ? 'Plus · Watermark-free printing' : 'Free · Includes a ChoreChartEasy watermark'; });
    document.querySelectorAll('[data-print-upgrade]').forEach(el => { el.hidden = premium; });
  }
  async function refresh() {
    expiresAt = 0; apply();
    try {
      const response = await fetch('/api/me', { credentials: 'same-origin', cache: 'no-store' });
      if (response.ok) {
        const me = await response.json();
        if (me.authenticated && me.membership?.entitlements?.includes('watermark_free_print')) expiresAt = Number(me.membership.expiresAt) || 0;
      }
    } catch { /* Free printing remains available when account checks fail. */ }
    apply();
  }
  window.ChorePrintAccess = { refresh };
  window.addEventListener('beforeprint', apply);
  window.addEventListener('pageshow', refresh);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh(); });
  refresh();
})();
