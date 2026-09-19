CREATE TABLE IF NOT EXISTS feedback_contacts (
  feedback_id TEXT PRIMARY KEY REFERENCES feedback_submissions(id) ON DELETE CASCADE,
  email TEXT NOT NULL CHECK(length(email) BETWEEN 3 AND 254)
);
CREATE VIEW IF NOT EXISTS feedback_details AS
SELECT f.*, c.email FROM feedback_submissions f LEFT JOIN feedback_contacts c ON c.feedback_id=f.id;
