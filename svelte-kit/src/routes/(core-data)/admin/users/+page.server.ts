import { getUserUsageInfo } from "$data/user-usage-info.js";
import { redirect } from "@sveltejs/kit";

export const load = async ({ parent }) => {
  const parentParams = await parent();
  if (!parentParams.isAdminUser) {
    redirect(302, "/");
  }

  const userUsageInfo = await getUserUsageInfo();

  console.log(Array.isArray(userUsageInfo));

  return { userUsageInfo };
};

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
