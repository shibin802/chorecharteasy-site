from pathlib import Path
from html.parser import HTMLParser
import re
import struct
import unittest
from urllib.parse import urlparse

ROOT = Path(__file__).resolve().parents[1]


class DocumentParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
        self.ids = set()
        self.scripts = []
        self.title = []
        self.meta = {}
        self._in_title = False

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if values.get("id"):
            self.ids.add(values["id"])
        if tag == "a" and values.get("href"):
            self.links.append(values["href"])
        if tag == "script" and values.get("src"):
            self.scripts.append(values["src"])
        if tag == "meta":
            name = values.get("name")
            if name:
                self.meta[name.lower()] = values.get("content", "") or ""
        if tag == "title":
            self._in_title = True

    def handle_endtag(self, tag):
        if tag == "title":
            self._in_title = False

    def handle_data(self, data):
        if self._in_title:
            self.title.append(data)


class FrontendV2Contract(unittest.TestCase):
    def text(self, name):
        return (ROOT / name).read_text(encoding="utf-8")

    def parse(self, name):
        parser = DocumentParser()
        parser.feed(self.text(name))
        return parser

    def test_homepage_metadata_and_frozen_hero(self):
        html = self.text("index.html")
        doc = self.parse("index.html")
        self.assertEqual(
            "".join(doc.title).strip(),
            "Free Printable Chore Chart Maker for Kids | ChoreChartEasy",
        )
        self.assertEqual(
            doc.meta.get("description"),
            "Make a free printable chore chart for kids ages 3–12. Start with age-based ideas, edit every task, and print on US Letter or A4—no sign-up.",
        )
        required_copy = [
            "Free printable tool · No sign-up · Ages 3–12",
            "Make a printable chore chart that fits your child’s age",
            "Make my free chart",
            "Start with a blank chart",
            "For parents and caregivers. No child account required.",
        ]
        for phrase in required_copy:
            self.assertIn(phrase, html)

    def test_homepage_exposes_real_editor_preview_and_print_contract(self):
        doc = self.parse("index.html")
        required_ids = {
            "chart-maker",
            "chart-editor",
            "chart-title",
            "task-list",
            "add-task",
            "paper-letter",
            "paper-a4",
            "preview-print",
            "print-dialog",
            "print-sheet",
            "clear-local-data",
        }
        self.assertTrue(required_ids.issubset(doc.ids), required_ids - doc.ids)
        js = self.text("assets/site.js")
        for contract in [
            "createStartingChart",
            "openPrintPreview",
            "window.print()",
            "chorecharteasy.activeDraft.v2",
            "beforeprint",
            "afterprint",
        ]:
            self.assertIn(contract, js)

    def test_homepage_uses_age_bands_and_optional_non_sensitive_name(self):
        html = self.text("index.html")
        for band in ["3–4", "5–6", "7–9", "10–12"]:
            self.assertIn(band, html)
        self.assertIn("Nickname or initials (optional)", html)
        self.assertIn("Avoid full names, school names, addresses", html)
        self.assertNotRegex(html, r"Child name|type=\"number\"[^>]+age")

    def test_no_old_saas_or_unsupported_public_claims(self):
        files = [
            "index.html",
            "assets/site.js",
            "privacy.html",
            "terms.html",
            "refund.html",
            "cookies.html",
            "contact.html",
        ]
        forbidden = [
            "Sign in with Google",
            "$4.99/month",
            "Pro Toolkit",
            "Pro Family",
            "test checkout",
            "Lifetime",
            "COPPA compliant",
            "100% private",
            "perfectly fair",
            "fair for siblings",
        ]
        corpus = "\n".join(self.text(name) for name in files)
        for phrase in forbidden:
            self.assertNotIn(phrase.lower(), corpus.lower())

    def test_analytics_is_consent_gated_and_clarity_is_absent(self):
        public_html = list(ROOT.glob("*.html"))
        for path in public_html:
            html = path.read_text(encoding="utf-8")
            self.assertNotIn("clarity.ms", html, path.name)
            self.assertNotIn("googletagmanager.com/gtag/js", html, path.name)
        js = self.text("assets/consent.js")
        for contract in [
            "Accept analytics",
            "Reject non-essential",
            "Cookie settings",
            "globalPrivacyControl",
            "loadAnalytics",
            "deleteAnalyticsCookies",
            "ga-disable-",
            ".chorecharteasy.pages.dev",
        ]:
            self.assertIn(contract, js)
        self.assertRegex(js, r"function\s+loadAnalytics")
        self.assertIn("googletagmanager.com/gtag/js", js)

    def test_analytics_event_payload_is_allowlisted(self):
        js = self.text("assets/consent.js")
        self.assertIn("EVENT_FIELDS", js)
        forbidden_payloads = ["nickname", "child_name", "chart_title", "task_text", "task_name"]
        event_fields = re.search(r"const EVENT_FIELDS\s*=\s*\{(.*?)\};", js, re.S)
        self.assertIsNotNone(event_fields)
        if event_fields is None:
            self.fail("EVENT_FIELDS allowlist is missing")
        fields = event_fields.group(1).lower()
        for field in forbidden_payloads:
            self.assertNotIn(field, fields)

    def test_legal_and_contact_routes_exist_and_are_linked(self):
        for page in ["privacy.html", "terms.html", "cookies.html", "refund.html", "contact.html"]:
            self.assertTrue((ROOT / page).exists(), page)
        home = self.text("index.html")
        for route in ["/privacy", "/terms", "/cookies", "/refund", "/contact"]:
            self.assertIn(f'href="{route}"', home)

    def test_local_links_resolve_and_no_placeholder_href(self):
        html_files = list(ROOT.glob("*.html"))
        failures = []
        for path in html_files:
            doc = self.parse(path.name)
            for href in doc.links:
                if href == "#":
                    failures.append(f"{path.name}: href=#")
                    continue
                parsed = urlparse(href)
                if parsed.scheme in {"http", "https", "mailto"} or href.startswith("#"):
                    continue
                route = parsed.path
                if not route or route == "/":
                    continue
                candidate = ROOT / (route.lstrip("/") + ".html")
                if not candidate.exists():
                    failures.append(f"{path.name}: {href}")
        self.assertEqual([], failures)

    def test_shared_assets_and_security_headers(self):
        home = self.text("index.html")
        self.assertIn('href="/assets/site.css"', home)
        self.assertIn('src="/assets/consent.js"', home)
        self.assertIn('src="/assets/site.js"', home)
        headers = self.text("_headers")
        self.assertIn("Content-Security-Policy:", headers)
        self.assertIn("script-src 'self' https://www.googletagmanager.com", headers)
        self.assertNotIn("script-src 'self' 'unsafe-inline'", headers)
        self.assertNotIn("chorecharteasy-worker", headers)
        self.assertNotIn("googleusercontent.com", headers)

    def test_launch_legal_pages_match_current_free_product(self):
        legal_pages = ["privacy.html", "terms.html", "cookies.html", "refund.html", "contact.html"]
        forbidden = [
            "Legal draft",
            "DRAFT —",
            "DO NOT PUBLISH",
            "[OPERATOR",
            "[MAILING",
            "[MONTH",
            "[VERIFY",
            "[OWNER",
            "[GOVERNING",
            "[REALISTIC",
            "[EMAIL PROVIDER",
            "Printable Family Pack Policy",
        ]
        for page in legal_pages:
            html = self.text(page)
            for phrase in forbidden:
                self.assertNotIn(phrase.lower(), html.lower(), f"{page}: {phrase}")
            self.assertIn("support@chorecharteasy.com", html, page)
        refund = self.text("refund.html")
        self.assertIn("does not currently sell paid products", refund)
        self.assertNotIn("Creem", refund)

    def test_public_html_has_no_inline_styles_and_csp_disallows_them(self):
        for path in ROOT.glob("*.html"):
            html = path.read_text(encoding="utf-8")
            self.assertNotRegex(html, r"<style\b", path.name)
            self.assertNotRegex(html, r"\sstyle\s*=", path.name)
        headers = self.text("_headers")
        csp = next(line for line in headers.splitlines() if "Content-Security-Policy:" in line)
        self.assertNotIn("'unsafe-inline'", csp)

    def test_indexed_pages_use_real_social_image(self):
        image = ROOT / "assets/social/chorecharteasy-og.png"
        self.assertTrue(image.exists())
        data = image.read_bytes()
        self.assertEqual(b"\x89PNG\r\n\x1a\n", data[:8])
        width, height = struct.unpack(">II", data[16:24])
        self.assertEqual((1200, 630), (width, height))
        pages = [
            "index.html",
            "printable-chore-chart.html",
            "chore-randomizer.html",
            "chores-for-3-year-olds.html",
            "chores-for-5-year-olds.html",
            "chore-chart-for-multiple-kids.html",
            "morning-routine-chart-for-kids.html",
        ]
        for page in pages:
            html = self.text(page)
            self.assertIn('property="og:image" content="https://chorecharteasy.com/assets/social/chorecharteasy-og.png"', html, page)
            self.assertIn('name="twitter:card" content="summary_large_image"', html, page)

    def test_starter_tasks_are_reviewed_and_specific(self):
        js = self.text("assets/site.js")
        for task in [
            "Put away personal laundry",
            "Unload unbreakable dishes with adult approval",
            "Empty a small wastebasket",
        ]:
            self.assertIn(task, js)
        for vague_task in ["Fold simple laundry", "Manage personal laundry", "Take out household trash"]:
            self.assertNotIn(vague_task, js)
        review = ROOT / "docs/content/STARTER-CHORES-SAFETY-REVIEW-2026-07-26.md"
        self.assertTrue(review.exists())


if __name__ == "__main__":
    unittest.main()
