CREATE TABLE IF NOT EXISTS billing_customers (
 user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
 customer_id TEXT NOT NULL UNIQUE,
 checkout_id TEXT, checkout_url TEXT, checkout_expires_at INTEGER NOT NULL DEFAULT 0,
 lock_until INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS billing_subscriptions (
 id TEXT PRIMARY KEY, user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 customer_id TEXT NOT NULL, status TEXT NOT NULL, paid_until INTEGER NOT NULL DEFAULT 0,
 cancel_at_period_end INTEGER NOT NULL DEFAULT 0, observed_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_billing_subscriptions_user ON billing_subscriptions(user_id);
