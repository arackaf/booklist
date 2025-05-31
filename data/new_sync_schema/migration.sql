ALTER TABLE books DROP COLUMN similar_books_last_sync;
ALTER TABLE books DROP COLUMN similar_books_last_sync_success;
ALTER TABLE books DROP COLUMN similar_books_last_sync_failure_reason;
ALTER TABLE books DROP COLUMN sync_eligible;

ALTER TABLE books ADD COLUMN average_review numeric(2, 1) NULL;
ALTER TABLE books ADD COLUMN number_reviews INT NULL;
ALTER TABLE books ADD COLUMN amazon_sync_eligible BOOL NULL;
ALTER TABLE books ADD COLUMN last_amazon_sync DATE NULL;
ALTER TABLE books ADD COLUMN last_amazon_sync_success BOOL NULL;
ALTER TABLE books ADD COLUMN last_amazon_sync_error VARCHAR NULL;
