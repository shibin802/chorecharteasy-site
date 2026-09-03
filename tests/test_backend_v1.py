import json
import re
import subprocess
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
MIGRATION = ROOT / "backend/migrations/0001_initial.sql"
FEEDBACK_MIGRATION = ROOT / "backend/migrations/0002_feedback.sql"
API_CONTRACT = ROOT / "backend/contracts/api-v1.json"
ENV_CONTRACT = ROOT / "backend/contracts/env.schema.json"
ROUTE = ROOT / "functions/api/[[path]].js"
API_LIB = ROOT / "functions/_lib/api.mjs"
DEV_SEED = ROOT / "backend/seed/dev.sql"


class BackendArtifactContractTests(unittest.TestCase):
    def test_required_backend_artifacts_exist(self):
        for path in (MIGRATION, FEEDBACK_MIGRATION, API_CONTRACT, ENV_CONTRACT, ROUTE, API_LIB, DEV_SEED):
            with self.subTest(path=path.relative_to(ROOT)):
                self.assertTrue(path.is_file())

    def test_api_contract_is_machine_readable_and_scoped(self):
        contract = json.loads(API_CONTRACT.read_text())
        self.assertEqual(contract["version"], "v1")
        self.assertEqual(contract["basePath"], "/api")
        self.assertFalse(contract["features"]["auth"]["enabledByDefault"])
        self.assertEqual(contract["features"]["familyPack"]["status"], "planned")
        self.assertFalse(contract["features"]["payments"]["enabled"])
        endpoints = {(item["method"], item["path"]): item for item in contract["endpoints"]}
        required = {
            ("GET", "/api/health"),
            ("GET", "/api/membership"),
            ("POST", "/api/checkout"),
            ("GET", "/api/checkout-session"),
            ("POST", "/api/feedback"),
            ("POST", "/api/early-access"),
            ("POST", "/api/auth/request-link"),
            ("GET", "/api/auth/verify"),
            ("GET", "/api/me"),
            ("POST", "/api/logout"),
        }
        self.assertTrue(required.issubset(endpoints))
        serialized = json.dumps(contract).lower()
        for forbidden in ("child_name", "chart_title", "chore_text", "completion_status"):
            self.assertNotIn(forbidden, serialized)

    def test_env_contract_marks_secrets_and_production_blocks(self):
        contract = json.loads(ENV_CONTRACT.read_text())
        props = contract["properties"]
        self.assertTrue(props["SESSION_SECRET"]["secret"])
        self.assertTrue(props["RATE_LIMIT_SALT"]["secret"])
        self.assertEqual(props["AUTH_ENABLED"]["default"], "false")
        self.assertEqual(props["PAYMENTS_ENABLED"]["default"], "false")
        self.assertEqual(set(props["PAYMENTS_ENABLED"]["enum"]), {"true", "false"})
        self.assertTrue(props["STRIPE_SECRET_KEY"]["secret"])
        self.assertTrue(props["RESEND_API_KEY"]["secret"])
        self.assertRegex(props["STRIPE_PRICE_ID"]["pattern"], r"price_")
        self.assertNotIn("CREEM_API_KEY", contract.get("required", []))

    def test_migration_is_idempotent_and_has_minimum_tables(self):
        sql = MIGRATION.read_text().lower()
        for table in (
            "users",
            "login_tokens",
            "sessions",
            "memberships",
            "early_access_signups",
            "rate_limits",
            "audit_events",
        ):
            self.assertRegex(sql, rf"create table if not exists\s+{table}\b")
        self.assertIn("foreign key", sql)
        self.assertIn("unique", sql)
        self.assertNotIn("child_name", sql)
        self.assertNotIn("chart_title", sql)
        self.assertNotIn("chore_text", sql)

        feedback_sql = FEEDBACK_MIGRATION.read_text().lower()
        self.assertRegex(feedback_sql, r"create table if not exists\s+feedback_submissions\b")
        self.assertIn("check (kind in", feedback_sql)
        for forbidden in ("email", "child_name", "chart_title", "chore_text", "ip_address"):
            self.assertNotIn(forbidden, feedback_sql)

    def test_route_is_pages_functions_catch_all(self):
        route = ROUTE.read_text()
        self.assertIn("onRequest", route)
        self.assertIn("handleApiRequest", route)

    def test_api_uses_secure_server_side_session(self):
        source = API_LIB.read_text()
        for fragment in ("HttpOnly", "Secure", "SameSite=Lax", "Path=/", "Cache-Control"):
            self.assertIn(fragment, source)
        self.assertIn("crypto.subtle.digest", source)
        self.assertNotRegex(source, r"console\.(log|info|debug)\s*\(")

    def test_auth_and_payments_are_fail_closed(self):
        source = API_LIB.read_text()
        stripe_source = (ROOT / "functions/_lib/stripe.mjs").read_text()
        self.assertIn("AUTH_ENABLED", source)
        self.assertIn("AUTH_DEV_BYPASS", source)
        self.assertIn("checkoutConfigured(env)", source)
        self.assertIn('path === "/api/checkout"', source)
        self.assertIn('env?.PAYMENTS_ENABLED === "true"', stripe_source)
        self.assertIn("STRIPE_SECRET_KEY", stripe_source)
        self.assertIn("STRIPE_PRICE_ID", stripe_source)
        self.assertIn("checkout.stripe.com", source)
        self.assertIn("requireAuthenticatedUser(request, env)", source)
        self.assertIn("https://api.resend.com/emails", source)
        self.assertNotIn("payment_method_types", source)
        self.assertNotIn("/api/webhook/creem", source)
        self.assertNotIn("accounts.google.com", source)

    def test_checkout_returns_503_without_server_configuration(self):
        script = r'''
import("./functions/_lib/api.mjs").then(async ({ handleApiRequest }) => {
  const request = new Request("https://chorecharteasy.com/api/checkout", {
    method: "POST",
    headers: { "Origin": "https://chorecharteasy.com", "Content-Type": "application/json" },
    body: JSON.stringify({ product: "plus_starter_pack" }),
  });
  const response = await handleApiRequest({ request, env: { PUBLIC_ORIGIN: "https://chorecharteasy.com", PAYMENTS_ENABLED: "false" } });
  process.stdout.write(JSON.stringify({ status: response.status, body: await response.json() }));
});
'''
        result = subprocess.run(["node", "-e", script], cwd=ROOT, check=True, capture_output=True, text=True)
        payload = json.loads(result.stdout)
        self.assertEqual(payload["status"], 503)
        self.assertEqual(payload["body"]["error"]["code"], "checkout_unavailable")

    def test_state_changes_require_same_origin_and_rate_limit(self):
        source = API_LIB.read_text()
        self.assertIn("assertSameOrigin", source)
        self.assertIn("checkRateLimit", source)
        self.assertIn("RATE_LIMIT_SALT", source)
        self.assertIn("CF-Connecting-IP", source)

    def test_body_fields_are_allowlisted_and_small(self):
        source = API_LIB.read_text()
        self.assertRegex(source, r"MAX_BODY_BYTES\s*=\s*4096")
        self.assertIn("ALLOWED_EARLY_ACCESS_FIELDS", source)
        self.assertIn("ALLOWED_AUTH_FIELDS", source)
        self.assertIn("ALLOWED_FEEDBACK_FIELDS", source)
        self.assertNotIn("request.json()", source)

    def test_feedback_is_minimized_and_protected(self):
        source = API_LIB.read_text()
        self.assertIn('path === "/api/feedback"', source)
        self.assertIn('checkRateLimit(db, "feedback:global", 120, 10 * 60, now)', source)
        self.assertIn("assertSameOrigin(request, env)", source)
        self.assertIn("feedback_submissions", source)
        self.assertNotRegex(source, r"ALLOWED_FEEDBACK_FIELDS[^\n]*email")

    def test_dev_seed_is_obviously_non_production(self):
        seed = DEV_SEED.read_text().lower()
        self.assertIn("example.test", seed)
        self.assertNotIn("@gmail.com", seed)
        self.assertNotIn("@chorecharteasy.com", seed)

    def test_local_secret_files_are_ignored(self):
        ignore = (ROOT / ".gitignore").read_text()
        self.assertIn(".dev.vars", ignore)
        self.assertIn("*.local", ignore)


if __name__ == "__main__":
    unittest.main()
