(() => {
  let expiresAt = 0, signedIn = false;
  function apply() {
    const premium = expiresAt > Date.now() / 1000;
    document.documentElement.classList.toggle('watermark-free', premium);
    document.querySelectorAll('[data-print-plan]').forEach(el => { el.textContent = premium ? 'Plus · Watermark-free printing' : 'Free · Includes a ChoreChartEasy watermark'; });
    document.querySelectorAll('[data-print-upgrade]').forEach(el => { el.hidden = premium; });
  }
  let pendingRefresh = null;
  function refresh() {
    // Keep the last verified entitlement while checking. Clearing it first can
    // put a watermark into the browser's print snapshot on visibility changes.
    if (pendingRefresh) return pendingRefresh;
    pendingRefresh = (async () => {
      try {
        const response = await fetch('/api/me', { credentials: 'same-origin', cache: 'no-store' });
        if (response.ok) {
          const me = await response.json();
          signedIn = me.authenticated === true;
          expiresAt = signedIn && me.membership?.entitlements?.includes('watermark_free_print')
            ? Number(me.membership.expiresAt) || 0 : 0;
        } else if (response.status === 401 || response.status === 403) {
          expiresAt = 0;
          signedIn = false;
        }
      } catch { /* Preserve previously verified access only until its expiry. */ }
      apply();
    })().finally(() => { pendingRefresh = null; });
    return pendingRefresh;
  }
  function record(type, chart) {
    if (!signedIn) return;
    // Best effort: telemetry must never prevent printing. No chart text leaves the device.
    fetch('/api/activity/print', {method:'POST',credentials:'same-origin',keepalive:true,
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({id:crypto.randomUUID(),type,paper:chart.paper,starter:chart.starter,taskCount:chart.taskCount ?? chart.tasks.length})
    }).catch(() => {});
  }
  window.ChorePrintAccess = { refresh, record };
  window.addEventListener('beforeprint', apply);
  window.addEventListener('pageshow', refresh);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) refresh(); });
  refresh();
})();
