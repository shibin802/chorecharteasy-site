from html.parser import HTMLParser
import json
from pathlib import Path
import re
import unittest
from urllib.parse import urlparse
from xml.etree import ElementTree

ROOT = Path(__file__).resolve().parents[1]
SITEMAP_NS = {"s": "http://www.sitemaps.org/schemas/sitemap/0.9"}


class SeoParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.title = ""
        self.description = None
        self.canonical = None
        self.h1_count = 0
        self.schemas = []
        self._in_title = False
        self._schema = None

    def handle_starttag(self, tag, attrs):
        values = dict(attrs)
        if tag == "title":
            self._in_title = True
        elif tag == "meta" and values.get("name") == "description":
            self.description = values.get("content")
        elif tag == "link" and values.get("rel") == "canonical":
            self.canonical = values.get("href")
        elif tag == "h1":
            self.h1_count += 1
        elif tag == "script" and values.get("type") == "application/ld+json":
            self._schema = ""

    def handle_endtag(self, tag):
        if tag == "title":
            self._in_title = False
        elif tag == "script" and self._schema is not None:
            self.schemas.append(json.loads(self._schema))
            self._schema = None

    def handle_data(self, data):
        if self._in_title:
            self.title += data
        if self._schema is not None:
            self._schema += data


def parse_page(path):
    parser = SeoParser()
    parser.feed(path.read_text(encoding="utf-8"))
    return parser


def schema_nodes(parser):
    nodes = []
    for schema in parser.schemas:
        nodes.extend(schema.get("@graph", [schema]))
    return nodes


class SeoContract(unittest.TestCase):
    def indexed_pages(self):
        root = ElementTree.parse(ROOT / "sitemap.xml").getroot()
        urls = [node.text for node in root.findall("s:url/s:loc", SITEMAP_NS)]
        return [
            (url, ROOT / ("index.html" if url.endswith("/") else f"{urlparse(url).path.strip('/')}.html"))
            for url in urls
        ]

    def test_indexed_pages_have_search_snippet_contract(self):
        titles = set()
        descriptions = set()
        for url, path in self.indexed_pages():
            page = parse_page(path)
            title = page.title.strip()
            self.assertTrue(30 <= len(title) <= 60, f"{path.name}: title length {len(title)}")
            self.assertIsNotNone(page.description, path.name)
            self.assertTrue(120 <= len(page.description) <= 160, f"{path.name}: description length {len(page.description)}")
            self.assertEqual(url, page.canonical, path.name)
            self.assertEqual(1, page.h1_count, path.name)
            self.assertNotIn(title, titles, path.name)
            self.assertNotIn(page.description, descriptions, path.name)
            titles.add(title)
            descriptions.add(page.description)

    def test_home_schema_defines_linked_site_entities(self):
        nodes = schema_nodes(parse_page(ROOT / "index.html"))
        by_type = {node.get("@type"): node for node in nodes}
        for required in ("Organization", "WebSite", "WebApplication", "FAQPage"):
            self.assertIn(required, by_type)
        self.assertEqual("https://chorecharteasy.com/#organization", by_type["Organization"].get("@id"))
        self.assertEqual({"@id": "https://chorecharteasy.com/#organization"}, by_type["WebSite"].get("publisher"))
        self.assertEqual({"@id": "https://chorecharteasy.com/#website"}, by_type["WebApplication"].get("isPartOf"))

    def test_visible_faqs_are_machine_readable_on_guide_pages(self):
        guides = (
            "chores-for-3-year-olds.html",
            "chores-for-5-year-olds.html",
            "chore-chart-for-multiple-kids.html",
            "morning-routine-chart-for-kids.html",
        )
        for name in guides:
            page = parse_page(ROOT / name)
            nodes = schema_nodes(page)
            faq = next((node for node in nodes if node.get("@type") == "FAQPage"), None)
            self.assertIsNotNone(faq, name)
            self.assertGreaterEqual(len(faq.get("mainEntity", [])), 2, name)
            html = (ROOT / name).read_text(encoding="utf-8")
            for question in faq["mainEntity"]:
                self.assertIn(question["name"], html, name)
                self.assertIn(question["acceptedAnswer"]["text"], html, name)

    def test_llms_discovery_file_is_public_and_scoped(self):
        llms = (ROOT / "llms.txt").read_text(encoding="utf-8")
        self.assertIn("# ChoreChartEasy", llms)
        self.assertIn("https://chorecharteasy.com/printable-chore-chart", llms)
        self.assertIn("No account is required", llms)
        builder = (ROOT / "backend/scripts/build_pages_artifact.py").read_text(encoding="utf-8")
        self.assertIn('"llms.txt"', builder)

    def test_public_html_has_no_malformed_event_attribute(self):
        for path in ROOT.glob("*.html"):
            html = path.read_text(encoding="utf-8")
            self.assertNotRegex(html, r'href="[^"]+"event', path.name)


if __name__ == "__main__":
    unittest.main()
