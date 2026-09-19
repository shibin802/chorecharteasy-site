-- The deployment checks table_info before adding this column.
ALTER TABLE feedback_submissions ADD COLUMN email TEXT;
