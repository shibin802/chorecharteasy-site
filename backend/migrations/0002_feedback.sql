-- Minimal site feedback collection.
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS feedback_submissions (
  id TEXT PRIMARY KEY,
  reference TEXT NOT NULL UNIQUE,
  kind TEXT NOT NULL CHECK (kind IN ('idea', 'problem', 'helpful', 'other')),
  message TEXT NOT NULL CHECK (length(message) BETWEEN 3 AND 1000),
  page_path TEXT NOT NULL CHECK (length(page_path) BETWEEN 1 AND 160),
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewed', 'resolved', 'deleted')),
  created_at INTEGER NOT NULL,
  reviewed_at INTEGER,
  deleted_at INTEGER
);

CREATE INDEX IF NOT EXISTS idx_feedback_status_created
  ON feedback_submissions(status, created_at DESC);
