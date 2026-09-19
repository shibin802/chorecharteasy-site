-- Append-only operational records. No chart contents, card data or checkout URLs.
CREATE TABLE IF NOT EXISTS user_activity (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  source TEXT NOT NULL CHECK(source IN ('browser','server','stripe')),
  resource_id TEXT,
  subscription_id TEXT,
  status TEXT,
  amount INTEGER,
  currency TEXT,
  plan TEXT,
  paper TEXT,
  starter TEXT,
  task_count INTEGER,
  livemode INTEGER NOT NULL CHECK(livemode IN (0,1)),
  occurred_at INTEGER NOT NULL,
  recorded_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_activity_user_time ON user_activity(user_id,occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_type_time ON user_activity(event_type,occurred_at DESC);
CREATE VIEW IF NOT EXISTS user_activity_details AS
SELECT a.*,u.email,datetime(a.occurred_at,'unixepoch') AS occurred_at_utc
FROM user_activity a JOIN users u ON u.id=a.user_id;
