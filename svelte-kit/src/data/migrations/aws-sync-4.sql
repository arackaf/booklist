ALTER TABLE books
ALTER COLUMN last_ratings_sync
TYPE TIMESTAMP
USING last_ratings_sync::timestamp;