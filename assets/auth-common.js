export async function api(path, body) {
  const response = await fetch(path, { credentials: 'same-origin', cache: 'no-store',
    ...(body === undefined ? {} : { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }) });
  if (response.status === 204) return {};
  const result = await response.json();
  if (!response.ok) throw new Error(result.error?.message || 'Please try again later.');
  return result;
}
export function safeReturn(value, origin = location.origin) {
  if (!value || !value.startsWith('/') || value.startsWith('//')) return '/#chart-maker';
  try {
    const url = new URL(value, origin);
    if (url.origin !== origin || /^\/(?:login(?:\.html)?|api)(?:\/|$)/.test(url.pathname)) return '/#chart-maker';
    return url.pathname + url.search + url.hash;
  } catch { return '/#chart-maker'; }
}
export function loginUrl(next = location.pathname + location.search + location.hash) {
  return '/login?next=' + encodeURIComponent(safeReturn(next));
}
