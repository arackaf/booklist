#SELECT * FROM books WHERE similarBooksLastSyncSuccess = false

SELECT COUNT(*)
FROM books
WHERE (CHAR_LENGTH(isbn) = 10 OR CHAR_LENGTH(isbn) = 13) AND similarBooksLastSync IS NULL

# 64 last null / map error