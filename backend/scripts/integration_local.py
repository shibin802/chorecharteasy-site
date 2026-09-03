#!/usr/bin/env python3
"""Black-box integration test for the local Pages Functions + D1 backend."""

from __future__ import annotations

import argparse
import json
import time
import urllib.error
import urllib.parse
import urllib.request
from typing import Any


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


OPENER = urllib.request.build_opener(NoRedirect)


def call(
    base: str,
    method: str,
    path: str,
    *,
    body: Any = None,
    origin: str | None = None,
    cookie: str | None = None,
) -> tuple[int, Any, Any]:
    headers = {"Accept": "application/json"}
    payload = None
    if body is not None:
        payload = json.dumps(body).encode()
        headers["Content-Type"] = "application/json"
    if origin:
        headers["Origin"] = origin
    if cookie:
        headers["Cookie"] = cookie
    request = urllib.request.Request(base + path, data=payload, headers=headers, method=method)
    try:
        response = OPENER.open(request, timeout=10)
    except urllib.error.HTTPError as error:
        response = error
    raw = response.read()
    parsed = None
    if raw:
        try:
            parsed = json.loads(raw)
        except json.JSONDecodeError:
            parsed = raw.decode(errors="replace")
    status_code = response.getcode()
    if status_code is None:
        raise AssertionError("HTTP response did not include a status code")
    return status_code, response.headers, parsed


def expect(condition: bool, label: str):
    if not condition:
        raise AssertionError(label)


def wait_ready(base: str):
    last = None
    for _ in range(30):
        try:
            status, _, body = call(base, "GET", "/api/health")
            if status == 200 and body and body.get("database") == "ready":
                return
            last = (status, body)
        except OSError as error:
            last = repr(error)
        time.sleep(0.25)
    raise AssertionError(f"backend not ready: {last}")


def run(base: str):
    base = base.rstrip("/")
    origin = urllib.parse.urlsplit(base)._replace(path="", query="", fragment="").geturl()
    checks = []

    wait_ready(base)
    checks.append("health_ready")

    status, _, body = call(base, "GET", "/api/membership")
    expect(status == 200, "membership status")
    expect(body["freeMaker"]["requiresAccount"] is False, "free maker account boundary")
    expect(body["familyPack"]["status"] == "planned", "family pack status")
    expect(body["payments"]["enabled"] is False, "payments must stay disabled")
    checks.append("public_membership_contract")

    status, _, body = call(base, "GET", "/api/me")
    expect(status == 200 and body["authenticated"] is False, "anonymous me")
    checks.append("anonymous_me")

    status, _, body = call(
        base,
        "POST",
        "/api/early-access",
        body={"email": "interest@example.test", "consent": True, "source": "family_pack"},
    )
    expect(status == 403 and body["error"]["code"] == "origin_not_allowed", "missing origin")
    checks.append("origin_required")

    status, _, body = call(
        base,
        "POST",
        "/api/early-access",
        body={"email": "interest@example.test", "consent": True, "source": "family_pack", "unexpected": 1},
        origin=origin,
    )
    expect(status == 400 and body["error"]["code"] == "unknown_fields", "field allowlist")
    checks.append("field_allowlist")

    status, _, body = call(
        base,
        "POST",
        "/api/early-access",
        body={"email": "interest@example.test", "consent": False, "source": "family_pack"},
        origin=origin,
    )
    expect(status == 422 and body["error"]["code"] == "consent_required", "explicit consent")
    checks.append("explicit_consent")

    for _ in range(2):
        status, _, body = call(
            base,
            "POST",
            "/api/early-access",
            body={"email": "interest@example.test", "consent": True, "source": "family_pack", "company": ""},
            origin=origin,
        )
        expect(status == 202 and body["accepted"] is True, "early access upsert")
    checks.append("early_access_idempotent_response")

    status, _, body = call(
        base,
        "POST",
        "/api/auth/request-link",
        body={"email": "member@example.test"},
        origin=origin,
    )
    expect(status == 202 and body["accepted"] is True, "dev magic link")
    token = body.get("debug", {}).get("token")
    verify_url = body.get("debug", {}).get("verifyUrl", "")
    expect(isinstance(token, str) and len(token) >= 32, "debug token exists only in local bypass")
    expect(verify_url.startswith(base + "/api/auth/verify?token="), "verify URL is same origin")
    checks.append("magic_link_created")

    encoded = urllib.parse.quote(token, safe="")
    status, headers, _ = call(base, "GET", f"/api/auth/verify?token={encoded}")
    expect(status == 302, "verify redirect")
    expect(headers.get("Location") == base + "/?signed_in=1#plus", "safe verify redirect")
    set_cookie = headers.get("Set-Cookie") or ""
    for attribute in ("cce_session=", "HttpOnly", "Secure", "SameSite=Lax", "Path=/"):
        expect(attribute in set_cookie, f"session cookie {attribute}")
    cookie = set_cookie.split(";", 1)[0]
    checks.append("secure_session_created")

    status, headers, _ = call(base, "GET", f"/api/auth/verify?token={encoded}")
    expect(status == 302 and "auth_error=invalid_or_expired" in (headers.get("Location") or ""), "one-time token replay")
    checks.append("magic_link_one_time")

    status, _, body = call(base, "GET", "/api/me", cookie=cookie)
    expect(status == 200 and body["authenticated"] is True, "authenticated me")
    expect(body["membership"]["plan"] == "family_pack", "seeded family pack membership")
    expect(body["membership"]["entitlements"] == ["family_pack_download"], "entitlement")
    checks.append("member_entitlement")

    status, headers, body = call(base, "POST", "/api/logout", origin=origin, cookie=cookie)
    expect(status == 204 and body is None, "logout status")
    expect("Max-Age=0" in (headers.get("Set-Cookie") or ""), "logout clears cookie")
    status, _, body = call(base, "GET", "/api/me", cookie=cookie)
    expect(status == 200 and body["authenticated"] is False, "revoked session")
    checks.append("logout_revokes_session")

    status, headers, body = call(base, "POST", "/api/health", body={}, origin=origin)
    expect(status == 405 and headers.get("Allow") == "GET", "method allowlist")
    checks.append("method_allowlist")

    status, _, body = call(base, "GET", "/api/not-real")
    expect(status == 404 and body["error"]["code"] == "not_found", "unknown API route")
    checks.append("api_404")

    print(json.dumps({"status": "PASS", "checks": checks, "count": len(checks)}, indent=2))


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--base", default="http://127.0.0.1:8790")
    args = parser.parse_args()
    run(args.base)
