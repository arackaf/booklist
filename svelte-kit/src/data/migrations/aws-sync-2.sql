ALTER TABLE books
    RENAME COLUMN last_rating_items_sync TO last_ratings_items_sync;

ALTER TABLE books
    RENAME COLUMN last_rating_items_sync_success TO last_ratings_items_sync_success;

ALTER TABLE books
    RENAME COLUMN last_rating_items_sync_error TO last_ratings_items_sync_error;