CREATE TABLE IF NOT EXISTS refund_requests (
 id TEXT PRIMARY KEY,
 user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 invoice_id TEXT NOT NULL UNIQUE,
 reason TEXT NOT NULL,
 status TEXT NOT NULL CHECK(status IN ('pending','approved','declined','refunded')),
 resolution TEXT,
 created_at INTEGER NOT NULL,
 updated_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_refund_user ON refund_requests(user_id,created_at);
CREATE INDEX IF NOT EXISTS idx_refund_pending ON refund_requests(status,created_at);
