SELECT
    COUNT(*) count,
    agg.subjects
FROM books b
JOIN (
    SELECT
        bs.book,
        JSON_ARRAYAGG(bs.subject) subjects
    FROM books_subjects bs
    JOIN subjects s
    ON bs.subject = s.id
    GROUP BY bs.book
) agg
ON b.id = agg.book
WHERE b.userId = 'test-user1'
GROUP BY agg.subjects
HAVING agg.subjects IS NOT NULL
#ORDER BY subjects DESC
