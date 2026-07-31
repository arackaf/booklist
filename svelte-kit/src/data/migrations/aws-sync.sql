ALTER TABLE books
    DROP COLUMN last_amazon_sync,
    DROP COLUMN last_amazon_sync_success,
    DROP COLUMN last_amazon_sync_error,

    ADD COLUMN last_similar_items_sync DATE,
    ADD COLUMN last_similar_items_sync_success BOOLEAN,
    ADD COLUMN last_similar_items_sync_error TEXT,

    ADD COLUMN last_rating_items_sync DATE,
    ADD COLUMN last_rating_items_sync_success BOOLEAN,
    ADD COLUMN last_rating_items_sync_error TEXT;