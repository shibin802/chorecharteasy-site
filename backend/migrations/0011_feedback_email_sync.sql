-- Keep the deployed contact writer compatible and show emails in the main table.
CREATE TRIGGER IF NOT EXISTS feedback_email_insert AFTER INSERT ON feedback_contacts
BEGIN
  UPDATE feedback_submissions SET email=NEW.email WHERE id=NEW.feedback_id;
END;
CREATE TRIGGER IF NOT EXISTS feedback_email_update AFTER UPDATE OF email ON feedback_contacts
BEGIN
  UPDATE feedback_submissions SET email=NEW.email WHERE id=NEW.feedback_id;
END;
CREATE TRIGGER IF NOT EXISTS feedback_email_delete AFTER DELETE ON feedback_contacts
BEGIN
  UPDATE feedback_submissions SET email=NULL WHERE id=OLD.feedback_id;
END;
UPDATE feedback_submissions SET email=(SELECT email FROM feedback_contacts WHERE feedback_id=feedback_submissions.id)
WHERE EXISTS (SELECT 1 FROM feedback_contacts WHERE feedback_id=feedback_submissions.id);
DROP VIEW IF EXISTS feedback_details;
CREATE VIEW feedback_details AS SELECT * FROM feedback_submissions;
