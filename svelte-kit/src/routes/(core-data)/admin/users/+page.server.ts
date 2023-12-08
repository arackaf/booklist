/*

SELECT userId, DATEDIFF(NOW(), MAX(dateAdded)) daysAgo, MAX(dateAdded) latest
FROM books
GROUP BY userId
ORDER BY MAX(dateAdded) DESC

*/

/*

GS1

GSI1PK
ACCOUNT#google
GSI1SK
ACCOUNT#203374502437829341114

TABLE

pk: USER#c347xxx
sk: USER#c347xxx


*/
