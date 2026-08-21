from pathlib import Path
import json
import re
import unittest

ROOT = Path(__file__).resolve().parents[1]


class GrowthPagesContract(unittest.TestCase):
    def text(self, name):
        return (ROOT / name).read_text(encoding="utf-8")

    def test_homepage_targets_maker_and_links_growth_pages(self):
        html = self.text('index.html')
        h1 = re.search(r'<h1[^>]*>(.*?)</h1>', html, re.S | re.I)
        self.assertIsNotNone(h1)
        assert h1 is not None
        heading = re.sub(r'<[^>]+>', ' ', h1.group(1)).lower()
        self.assertIn('make a printable chore chart that fits your child’s age', heading)
        self.assertIn('/printable-chore-chart', html)
        self.assertIn('/chore-randomizer', html)
        self.assertIn('age-based ideas', html.lower())
        self.assertIn('us letter', html.lower())
        self.assertIn('a4', html.lower())

    def test_printable_page_has_unique_search_contract(self):
        html = self.text('printable-chore-chart.html')
        self.assertRegex(html, r'<title>[^<]*Printable Chore Chart[^<]*</title>')
        self.assertIn('https://chorecharteasy.com/printable-chore-chart', html)
        self.assertIn('application/ld+json', html)
        self.assertIn('FAQPage', html)
        self.assertIn('/?template=blank#chart-editor', html)
        self.assertGreaterEqual(len(re.findall(r'<h2', html)), 4)

    def test_randomizer_page_exposes_real_tool(self):
        html = self.text('chore-randomizer.html')
        js = self.text('assets/pages/chore-randomizer.js')
        self.assertIn('id="people-input"', html)
        self.assertIn('id="chores-input"', html)
        self.assertIn('id="randomize-button"', html)
        self.assertIn('id="result-list"', html)
        self.assertIn('function randomizeChores', js)
        self.assertIn('crypto.getRandomValues', js)
        self.assertIn('application/ld+json', html)

    def test_sitemap_contains_growth_pages(self):
        xml = self.text('sitemap.xml')
        self.assertIn('<loc>https://chorecharteasy.com/printable-chore-chart</loc>', xml)
        self.assertIn('<loc>https://chorecharteasy.com/chore-randomizer</loc>', xml)


if __name__ == '__main__':
    unittest.main()
