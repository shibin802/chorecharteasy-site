const API_VERSION = "v1";
const SESSION_COOKIE = "cce_session";
const MAX_BODY_BYTES = 4096;
const DEFAULT_SESSION_TTL_SECONDS = 30 * 24 * 60 * 60;
const DEFAULT_MAGIC_LINK_TTL_SECONDS = 15 * 60;
const ALLOWED_EARLY_ACCESS_FIELDS = new Set(["email", "consent", "source", "company"]);
const ALLOWED_AUTH_FIELDS = new Set(["email"]);
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PAYMENTS_ENABLED = false;

class ApiError extends Error {
  constructor(status, code, message, headers = {}) {
    super(message);
    this.status = status;
    this.code = code;
    this.safeMessage = message;
    this.headers = headers;
  }
}

function commonHeaders() {
  return {
    "Cache-Control": "no-store",
    "Content-Type": "application/json; charset=utf-8",
    "Referrer-Policy": "no-referrer",
    "X-Content-Type-Options": "nosniff",
  };
}

function jsonResponse(payload, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { ...commonHeaders(), ...extraHeaders },
  });
}

function errorResponse(error, requestId) {
  const status = error instanceof ApiError ? error.status : 500;
  const code = error instanceof ApiError ? error.code : "internal_error";
  const message = error instanceof ApiError ? error.safeMessage : "The request could not be completed.";
  const headers = error instanceof ApiError ? error.headers : {};
  return jsonResponse({ ok: false, error: { code, message, requestId } }, status, headers);
}

function methodNotAllowed(allowed) {
  throw new ApiError(405, "method_not_allowed", "This method is not allowed.", { Allow: allowed.join(", ") });
}

function featureEnabled(env, name) {
  return env?.[name] === "true";
}

function requireFeature(env, name) {
  if (!featureEnabled(env, name)) {
    throw new ApiError(503, "feature_unavailable", "This feature is not available yet.");
  }
}

function requireDatabase(env) {
  if (!env?.DB || typeof env.DB.prepare !== "function") {
    throw new ApiError(503, "database_unavailable", "The service is temporarily unavailable.");
  }
  return env.DB;
}

function requireSecret(env, name) {
  const value = env?.[name];
  if (typeof value !== "string" || value.length < 32) {
    throw new ApiError(503, "service_unconfigured", "The service is temporarily unavailable.");
  }
  return value;
}

function parsePositiveInt(value, fallback, minimum, maximum) {
  const parsed = Number.parseInt(value ?? "", 10);
  if (!Number.isFinite(parsed) || parsed < minimum || parsed > maximum) return fallback;
  return parsed;
}

function normalizeEmail(value) {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  if (!email || email.length > 254 || !EMAIL_PATTERN.test(email)) return null;
  return email;
}

async function parseJsonObject(request, allowedFields) {
  const type = request.headers.get("Content-Type") || "";
  if (!type.toLowerCase().startsWith("application/json")) {
    throw new ApiError(415, "unsupported_media_type", "Send an application/json request.");
  }
  const declaredLength = Number.parseInt(request.headers.get("Content-Length") || "0", 10);
  if (declaredLength > MAX_BODY_BYTES) {
    throw new ApiError(413, "payload_too_large", "The request body is too large.");
  }
  const raw = await request.text();
  if (new TextEncoder().encode(raw).byteLength > MAX_BODY_BYTES) {
    throw new ApiError(413, "payload_too_large", "The request body is too large.");
  }
  let value;
  try {
    value = JSON.parse(raw);
  } catch {
    throw new ApiError(400, "invalid_json", "The request body must be valid JSON.");
  }
  if (!value || Array.isArray(value) || typeof value !== "object") {
    throw new ApiError(400, "invalid_body", "The request body must be a JSON object.");
  }
  const unknown = Object.keys(value).filter((key) => !allowedFields.has(key));
  if (unknown.length) {
    throw new ApiError(400, "unknown_fields", "The request contains unsupported fields.");
  }
  return value;
}

function expectedOrigin(request, env) {
  if (typeof env?.PUBLIC_ORIGIN === "string" && env.PUBLIC_ORIGIN) {
    try {
      return new URL(env.PUBLIC_ORIGIN).origin;
    } catch {
      throw new ApiError(503, "service_unconfigured", "The service is temporarily unavailable.");
    }
  }
  return new URL(request.url).origin;
}

function assertSameOrigin(request, env) {
  const origin = request.headers.get("Origin");
  if (!origin || origin !== expectedOrigin(request, env)) {
    throw new ApiError(403, "origin_not_allowed", "This request origin is not allowed.");
  }
}

function isLoopbackRequest(request) {
  const hostname = new URL(request.url).hostname;
  return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "[::1]" || hostname === "::1";
}

function bytesToHex(bytes) {
  return Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function sha256Hex(value) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return bytesToHex(digest);
}

async function hmacHex(secret, value) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return bytesToHex(signature);
}

function randomToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/u, "");
}

function clientIp(request) {
  return request.headers.get("CF-Connecting-IP") || request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() || "unknown";
}

async function pseudonymousBucket(request, env, scope, discriminator = "") {
  const salt = requireSecret(env, "RATE_LIMIT_SALT");
  const source = `${scope}:${clientIp(request)}:${discriminator}`;
  return hmacHex(salt, source);
}

async function checkRateLimit(db, bucketKey, limit, windowSeconds, now) {
  const resetAt = now + windowSeconds;
  const row = await db.prepare(`
    INSERT INTO rate_limits (bucket_key, request_count, reset_at, updated_at)
    VALUES (?, 1, ?, ?)
    ON CONFLICT(bucket_key) DO UPDATE SET
      request_count = CASE
        WHEN rate_limits.reset_at <= excluded.updated_at THEN 1
        ELSE rate_limits.request_count + 1
      END,
      reset_at = CASE
        WHEN rate_limits.reset_at <= excluded.updated_at THEN excluded.reset_at
        ELSE rate_limits.reset_at
      END,
      updated_at = excluded.updated_at
    RETURNING request_count, reset_at
  `).bind(bucketKey, resetAt, now).first();
  if (!row || Number(row.request_count) > limit) {
    const retryAfter = Math.max(1, Number(row?.reset_at || resetAt) - now);
    throw new ApiError(429, "rate_limited", "Too many requests. Try again later.", { "Retry-After": String(retryAfter) });
  }
}

function parseCookies(request) {
  const source = request.headers.get("Cookie") || "";
  const result = {};
  for (const part of source.split(";")) {
    const index = part.indexOf("=");
    if (index < 1) continue;
    const key = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    if (key) result[key] = value;
  }
  return result;
}

function sessionCookie(token, ttlSeconds) {
  return `${SESSION_COOKIE}=${token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${ttlSeconds}`;
}

function clearSessionCookie() {
  return `${SESSION_COOKIE}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}

async function audit(db, action, resourceType, resourceId, actorUserId = null) {
  await db.prepare(`
    INSERT INTO audit_events (id, actor_user_id, action, resource_type, resource_id, metadata_json, created_at)
    VALUES (?, ?, ?, ?, ?, '{}', ?)
  `).bind(crypto.randomUUID(), actorUserId, action, resourceType, resourceId, Math.floor(Date.now() / 1000)).run();
}

async function health(request, env) {
  if (request.method !== "GET") methodNotAllowed(["GET"]);
  const db = requireDatabase(env);
  const row = await db.prepare("SELECT 1 AS ready").first();
  if (Number(row?.ready) !== 1) {
    throw new ApiError(503, "database_unavailable", "The service is temporarily unavailable.");
  }
  return jsonResponse({ ok: true, service: "chorecharteasy-api", version: API_VERSION, database: "ready" });
}

function membership(request, env) {
  if (request.method !== "GET") methodNotAllowed(["GET"]);
  const hasDatabase = Boolean(env?.DB && typeof env.DB.prepare === "function");
  const hasSessionSecret = typeof env?.SESSION_SECRET === "string" && env.SESSION_SECRET.length >= 32;
  const hasRateLimitSalt = typeof env?.RATE_LIMIT_SALT === "string" && env.RATE_LIMIT_SALT.length >= 32;
  const localAuthReady = featureEnabled(env, "AUTH_ENABLED")
    && featureEnabled(env, "AUTH_DEV_BYPASS")
    && isLoopbackRequest(request)
    && hasDatabase
    && hasSessionSecret
    && hasRateLimitSalt;
  const earlyAccessReady = featureEnabled(env, "EARLY_ACCESS_ENABLED") && hasDatabase && hasRateLimitSalt;
  return jsonResponse({
    ok: true,
    freeMaker: { requiresAccount: false, cloudDrafts: false },
    accounts: { enabled: localAuthReady, method: "email_magic_link" },
    earlyAccess: { enabled: earlyAccessReady },
    familyPack: { status: "planned", chargeToday: false, purchaseOrReservation: false },
    payments: { enabled: PAYMENTS_ENABLED && featureEnabled(env, "PAYMENTS_ENABLED") },
  });
}

async function earlyAccess(request, env) {
  if (request.method !== "POST") methodNotAllowed(["POST"]);
  requireFeature(env, "EARLY_ACCESS_ENABLED");
  assertSameOrigin(request, env);
  const db = requireDatabase(env);
  const body = await parseJsonObject(request, ALLOWED_EARLY_ACCESS_FIELDS);
  if (typeof body.company === "string" && body.company.trim()) {
    return jsonResponse({ ok: true, accepted: true }, 202);
  }
  const email = normalizeEmail(body.email);
  if (!email) throw new ApiError(422, "invalid_email", "Enter a valid email address.");
  if (body.consent !== true) {
    throw new ApiError(422, "consent_required", "Explicit early-access consent is required.");
  }
  if (body.source !== undefined && body.source !== "family_pack") {
    throw new ApiError(422, "invalid_source", "This early-access source is not supported.");
  }
  const now = Math.floor(Date.now() / 1000);
  const bucket = await pseudonymousBucket(request, env, "early_access");
  await checkRateLimit(db, bucket, 10, 60 * 60, now);
  const emailHash = await sha256Hex(email);
  const id = crypto.randomUUID();
  const row = await db.prepare(`
    INSERT INTO early_access_signups (
      id, email, email_hash, source, consent_version, marketing_consent_at,
      status, created_at, updated_at, deleted_at
    ) VALUES (?, ?, ?, 'family_pack', 'v1', ?, 'active', ?, ?, NULL)
    ON CONFLICT(email_hash) DO UPDATE SET
      email = excluded.email,
      consent_version = excluded.consent_version,
      marketing_consent_at = excluded.marketing_consent_at,
      status = 'active',
      updated_at = excluded.updated_at,
      deleted_at = NULL
    RETURNING id
  `).bind(id, email, emailHash, now, now, now).first();
  await audit(db, "early_access_joined", "early_access_signup", row?.id || id);
  return jsonResponse({ ok: true, accepted: true }, 202);
}

async function requestMagicLink(request, env) {
  if (request.method !== "POST") methodNotAllowed(["POST"]);
  requireFeature(env, "AUTH_ENABLED");
  assertSameOrigin(request, env);
  if (!featureEnabled(env, "AUTH_DEV_BYPASS") || !isLoopbackRequest(request)) {
    throw new ApiError(503, "email_delivery_unconfigured", "Email sign-in is not available yet.");
  }
  const db = requireDatabase(env);
  const sessionSecret = requireSecret(env, "SESSION_SECRET");
  const body = await parseJsonObject(request, ALLOWED_AUTH_FIELDS);
  const email = normalizeEmail(body.email);
  if (!email) throw new ApiError(422, "invalid_email", "Enter a valid email address.");
  const emailHash = await sha256Hex(email);
  const now = Math.floor(Date.now() / 1000);
  const bucket = await pseudonymousBucket(request, env, "magic_link", emailHash);
  await checkRateLimit(db, bucket, 5, 15 * 60, now);
  const ttl = parsePositiveInt(env.MAGIC_LINK_TTL_SECONDS, DEFAULT_MAGIC_LINK_TTL_SECONDS, 300, 3600);
  const rawToken = randomToken();
  const tokenHash = await hmacHex(sessionSecret, rawToken);
  const tokenId = crypto.randomUUID();
  await db.prepare(`
    INSERT INTO login_tokens (id, email, email_hash, token_hash, requested_at, expires_at, consumed_at)
    VALUES (?, ?, ?, ?, ?, ?, NULL)
  `).bind(tokenId, email, emailHash, tokenHash, now, now + ttl).run();
  const verifyUrl = new URL("/api/auth/verify", request.url);
  verifyUrl.searchParams.set("token", rawToken);
  return jsonResponse({
    ok: true,
    accepted: true,
    message: "Development magic link created.",
    debug: { token: rawToken, verifyUrl: verifyUrl.toString() },
  }, 202);
}

function authRedirect(env, request, parameter) {
  const target = new URL(expectedOrigin(request, env));
  target.pathname = "/";
  target.search = parameter;
  return target.toString();
}

async function verifyMagicLink(request, env) {
  if (request.method !== "GET") methodNotAllowed(["GET"]);
  requireFeature(env, "AUTH_ENABLED");
  const db = requireDatabase(env);
  const sessionSecret = requireSecret(env, "SESSION_SECRET");
  const token = new URL(request.url).searchParams.get("token") || "";
  if (token.length < 32 || token.length > 128) {
    return new Response(null, { status: 302, headers: { Location: authRedirect(env, request, "?auth_error=invalid_or_expired"), "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" } });
  }
  const now = Math.floor(Date.now() / 1000);
  const bucket = await pseudonymousBucket(request, env, "verify");
  await checkRateLimit(db, bucket, 20, 60 * 60, now);
  const tokenHash = await hmacHex(sessionSecret, token);
  const loginToken = await db.prepare(`
    SELECT id, email, email_hash FROM login_tokens
    WHERE token_hash = ? AND consumed_at IS NULL AND expires_at > ?
  `).bind(tokenHash, now).first();
  if (!loginToken) {
    return new Response(null, { status: 302, headers: { Location: authRedirect(env, request, "?auth_error=invalid_or_expired"), "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" } });
  }
  const consumed = await db.prepare(`
    UPDATE login_tokens SET consumed_at = ?
    WHERE id = ? AND consumed_at IS NULL AND expires_at > ?
  `).bind(now, loginToken.id, now).run();
  if (Number(consumed?.meta?.changes || 0) !== 1) {
    return new Response(null, { status: 302, headers: { Location: authRedirect(env, request, "?auth_error=invalid_or_expired"), "Cache-Control": "no-store", "Referrer-Policy": "no-referrer" } });
  }
  let user = await db.prepare("SELECT id, status FROM users WHERE email_hash = ?").bind(loginToken.email_hash).first();
  if (!user) {
    const userId = crypto.randomUUID();
    await db.prepare(`
      INSERT INTO users (id, email, email_hash, status, created_at, updated_at, deleted_at)
      VALUES (?, ?, ?, 'active', ?, ?, NULL)
    `).bind(userId, loginToken.email, loginToken.email_hash, now, now).run();
    user = { id: userId, status: "active" };
  }
  if (user.status !== "active") {
    throw new ApiError(403, "account_unavailable", "This account is unavailable.");
  }
  const rawSession = randomToken();
  const sessionHash = await hmacHex(sessionSecret, rawSession);
  const sessionTtl = parsePositiveInt(env.SESSION_TTL_SECONDS, DEFAULT_SESSION_TTL_SECONDS, 3600, DEFAULT_SESSION_TTL_SECONDS);
  await db.prepare(`
    INSERT INTO sessions (id, user_id, token_hash, created_at, last_seen_at, expires_at, revoked_at)
    VALUES (?, ?, ?, ?, ?, ?, NULL)
  `).bind(crypto.randomUUID(), user.id, sessionHash, now, now, now + sessionTtl).run();
  await audit(db, "session_created", "user", user.id, user.id);
  return new Response(null, {
    status: 302,
    headers: {
      Location: authRedirect(env, request, "?signed_in=1"),
      "Set-Cookie": sessionCookie(rawSession, sessionTtl),
      "Cache-Control": "no-store",
      "Referrer-Policy": "no-referrer",
    },
  });
}

async function currentUser(request, env) {
  if (request.method !== "GET") methodNotAllowed(["GET"]);
  const token = parseCookies(request)[SESSION_COOKIE];
  if (!token) {
    return jsonResponse({ ok: true, authenticated: false, membership: { plan: "free", status: "none", entitlements: [] } });
  }
  const db = requireDatabase(env);
  const sessionSecret = requireSecret(env, "SESSION_SECRET");
  const now = Math.floor(Date.now() / 1000);
  const tokenHash = await hmacHex(sessionSecret, token);
  const row = await db.prepare(`
    SELECT s.id AS session_id, s.last_seen_at, u.id AS user_id, u.email,
           m.plan AS membership_plan, m.status AS membership_status, m.expires_at
    FROM sessions s
    JOIN users u ON u.id = s.user_id AND u.status = 'active'
    LEFT JOIN memberships m ON m.user_id = u.id AND m.status = 'active'
    WHERE s.token_hash = ? AND s.revoked_at IS NULL AND s.expires_at > ?
    LIMIT 1
  `).bind(tokenHash, now).first();
  if (!row) {
    return jsonResponse(
      { ok: true, authenticated: false, membership: { plan: "free", status: "none", entitlements: [] } },
      200,
      { "Set-Cookie": clearSessionCookie() },
    );
  }
  if (now - Number(row.last_seen_at || 0) > 24 * 60 * 60) {
    await db.prepare("UPDATE sessions SET last_seen_at = ? WHERE id = ?").bind(now, row.session_id).run();
  }
  const activeFamilyPack = row.membership_plan === "family_pack" && row.membership_status === "active" && (!row.expires_at || Number(row.expires_at) > now);
  return jsonResponse({
    ok: true,
    authenticated: true,
    user: { id: row.user_id, email: row.email },
    membership: {
      plan: activeFamilyPack ? "family_pack" : "free",
      status: activeFamilyPack ? "active" : "none",
      entitlements: activeFamilyPack ? ["family_pack_download"] : [],
    },
  });
}

async function logout(request, env) {
  if (request.method !== "POST") methodNotAllowed(["POST"]);
  assertSameOrigin(request, env);
  const token = parseCookies(request)[SESSION_COOKIE];
  if (token && env?.DB && typeof env.DB.prepare === "function" && typeof env.SESSION_SECRET === "string" && env.SESSION_SECRET.length >= 32) {
    const tokenHash = await hmacHex(env.SESSION_SECRET, token);
    const now = Math.floor(Date.now() / 1000);
    await env.DB.prepare("UPDATE sessions SET revoked_at = ? WHERE token_hash = ? AND revoked_at IS NULL").bind(now, tokenHash).run();
  }
  return new Response(null, {
    status: 204,
    headers: {
      "Set-Cookie": clearSessionCookie(),
      "Cache-Control": "no-store",
      "Referrer-Policy": "no-referrer",
    },
  });
}

export async function handleApiRequest({ request, env }) {
  const requestId = crypto.randomUUID();
  try {
    const path = new URL(request.url).pathname.replace(/\/$/u, "") || "/";
    if (path === "/api/health") return await health(request, env);
    if (path === "/api/membership") return membership(request, env);
    if (path === "/api/early-access") return await earlyAccess(request, env);
    if (path === "/api/auth/request-link") return await requestMagicLink(request, env);
    if (path === "/api/auth/verify") return await verifyMagicLink(request, env);
    if (path === "/api/me") return await currentUser(request, env);
    if (path === "/api/logout") return await logout(request, env);
    throw new ApiError(404, "not_found", "The API route was not found.");
  } catch (error) {
    return errorResponse(error, requestId);
  }
}

export {
  ALLOWED_AUTH_FIELDS,
  ALLOWED_EARLY_ACCESS_FIELDS,
  MAX_BODY_BYTES,
  assertSameOrigin,
  checkRateLimit,
};
