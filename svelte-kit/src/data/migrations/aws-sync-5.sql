ALTER TABLE books
ALTER COLUMN last_similar_items_sync
TYPE TIMESTAMP
USING last_similar_items_sync::timestamp;