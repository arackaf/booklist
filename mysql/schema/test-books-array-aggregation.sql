SELECT
    COUNT(*) bookCount,
    (SELECT JSON_ARRAYAGG(bs.subject)
     FROM books_subjects bs
     JOIN subjects s
     ON bs.subject = s.id
     WHERE book = b.id
     ORDER BY s.name
    ) subjects
FROM books b
WHERE b.userId = 'test-user1'
GROUP BY subjects
HAVING subjects IS NOT NULL
#ORDER BY subjects DESC
