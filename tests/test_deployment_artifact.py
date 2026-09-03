from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest


ROOT = Path(__file__).resolve().parents[1]


class DeploymentArtifactContract(unittest.TestCase):
    def test_builder_emits_only_public_static_inputs(self):
        with tempfile.TemporaryDirectory() as tmp:
            output = Path(tmp) / "artifact"
            subprocess.run(
                ["python3", str(ROOT / "backend/scripts/build_pages_artifact.py"), str(output)],
                cwd=ROOT,
                check=True,
                capture_output=True,
                text=True,
            )

            for required in (
                "index.html",
                "checkout-success.html",
                "checkout-cancelled.html",
                "login.html",
                "_headers",
                "assets/site.css",
                "assets/site.js",
                "assets/feedback.js",
                "assets/feedback.css",
                "assets/social/chorecharteasy-og.png",
                "llms.txt",
            ):
                self.assertTrue((output / required).is_file(), required)

            for forbidden in ("docs", "tests", "backend", "functions", ".git", ".wrangler"):
                self.assertFalse((output / forbidden).exists(), forbidden)

    def test_ci_builds_and_deploys_dist_not_repository_root(self):
        workflow = (ROOT / ".github/workflows/deploy.yml").read_text(encoding="utf-8")
        self.assertIn("build_pages_artifact.py dist", workflow)
        self.assertIn("npm ci", workflow)
        self.assertIn("pages functions build functions", workflow)
        self.assertIn("cp .wrangler/pages-functions-build/index.js dist/_worker.js", workflow)
        self.assertIn("pages deploy dist", workflow)
        self.assertIn("wranglerVersion: 4.80.0", workflow)
        self.assertIn("pull_request:", workflow)
        self.assertIn("0002_feedback.sql", workflow)
        self.assertIn('database="chorecharteasy-preview"', workflow)
        self.assertIn('database="chorecharteasy-production"', workflow)
        self.assertIn("github.head_ref", workflow)
        self.assertIn("github.event.pull_request.head.sha", workflow)
        self.assertIn("github.event.pull_request.head.repo.full_name == github.repository", workflow)
        self.assertIn('--commit-message="GitHub Actions deploy"', workflow)
        self.assertIn("--commit-dirty=false", workflow)
        self.assertNotIn("github.event.head_commit.message", workflow)
        self.assertNotIn("pages deploy . ", workflow)


if __name__ == "__main__":
    unittest.main()
