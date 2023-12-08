/*

SELECT userId, DATEDIFF(NOW(), MAX(dateAdded)) daysAgo, MAX(dateAdded) latest
FROM books
GROUP BY userId
ORDER BY MAX(dateAdded) DESC

*/
