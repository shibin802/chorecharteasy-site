CREATE TABLE IF NOT EXISTS billing_checkout_attempts (
 user_id TEXT PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
 id TEXT NOT NULL UNIQUE, price_id TEXT NOT NULL, created_at INTEGER NOT NULL,
 checkout_id TEXT, expires_at INTEGER NOT NULL DEFAULT 0
);
