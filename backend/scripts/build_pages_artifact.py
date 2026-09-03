#!/usr/bin/env python3
"""Build a minimal Cloudflare Pages static artifact.

Pages Functions are compiled separately with:
  rm -rf .wrangler/pages-functions-build
  npx wrangler pages functions build functions \
    --outdir .wrangler/pages-functions-build \
    --build-output-directory dist \
    --output-routes-path dist/_routes.json \
    --compatibility-date 2026-04-08
  cp .wrangler/pages-functions-build/index.js dist/_worker.js
"""

from __future__ import annotations

import argparse
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]

ROOT_FILES = (
    "index.html",
    "404.html",
    "checkout-success.html",
    "checkout-cancelled.html",
    "printable-chore-chart.html",
    "chore-randomizer.html",
    "chores-for-3-year-olds.html",
    "chores-for-5-year-olds.html",
    "chore-chart-for-multiple-kids.html",
    "morning-routine-chart-for-kids.html",
    "privacy.html",
    "terms.html",
    "cookies.html",
    "refund.html",
    "contact.html",
    "favicon.svg",
    "guide.css",
    "robots.txt",
    "llms.txt",
    "sitemap.xml",
    "_headers",
)

STATIC_DIRECTORIES = ("assets",)
FORBIDDEN_TOP_LEVEL = {
    ".git",
    ".github",
    ".wrangler",
    "backend",
    "docs",
    "functions",
    "tests",
}


def build(output: Path) -> None:
    output = output.resolve()
    if output == ROOT or ROOT in output.parents and output.name in {"assets", "functions"}:
        raise SystemExit(f"Refusing unsafe output path: {output}")

    if output.exists():
        shutil.rmtree(output)
    output.mkdir(parents=True)

    missing = [name for name in ROOT_FILES if not (ROOT / name).is_file()]
    missing += [name for name in STATIC_DIRECTORIES if not (ROOT / name).is_dir()]
    if missing:
        raise SystemExit("Missing required production inputs: " + ", ".join(missing))

    for name in ROOT_FILES:
        shutil.copy2(ROOT / name, output / name)
    for name in STATIC_DIRECTORIES:
        shutil.copytree(ROOT / name, output / name)

    leaked = sorted(path.name for path in output.iterdir() if path.name in FORBIDDEN_TOP_LEVEL)
    if leaked:
        raise SystemExit("Forbidden directories leaked into artifact: " + ", ".join(leaked))

    files = [path for path in output.rglob("*") if path.is_file()]
    total_bytes = sum(path.stat().st_size for path in files)
    print(f"artifact=PASS files={len(files)} bytes={total_bytes} output={output}")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("output", nargs="?", default=str(ROOT / "dist"))
    args = parser.parse_args()
    build(Path(args.output))


if __name__ == "__main__":
    main()
