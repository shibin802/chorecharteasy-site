CREATE TABLE IF NOT EXISTS test_orders (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  price_id TEXT NOT NULL,
  amount INTEGER NOT NULL,
  currency TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('pending', 'paid', 'expired', 'failed')),
  checkout_url TEXT NOT NULL,
  expires_at INTEGER NOT NULL,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_test_orders_user ON test_orders(user_id, created_at DESC);
CREATE TABLE IF NOT EXISTS stripe_test_events (id TEXT PRIMARY KEY, created_at INTEGER NOT NULL);
