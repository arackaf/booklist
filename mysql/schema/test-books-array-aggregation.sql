SELECT COUNT(*) bookCount, (SELECT JSON_ARRAYAGG(tag) from books_tags bt WHERE book = b.id) tags
FROM books b
# WHERE b.id > 300
GROUP BY tags
HAVING tags IS NOT NULL
ORDER BY bookCount DESC
