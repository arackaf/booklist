import { getUserInfoFromDynamo, getUserUsageInfo, type DynamoUserInfo } from "$data/user-usage-info.js";
import { redirect } from "@sveltejs/kit";

// 7 days
const syncDelta = 1000 * 60 * 60 * 24 * 7;

export const load = async ({ parent }) => {
  const parentParams = await parent();
  if (!parentParams.isAdminUser) {
    redirect(302, "/");
  }

  const userUsageInfo = await getUserUsageInfo();

  const currentTime = +new Date();
  const missingUsers = userUsageInfo.filter(row => row.userName == null || row.lastSync == null || currentTime - row.lastSync > syncDelta);

  const missingUserInfo = Promise.all(
    missingUsers.map<Promise<DynamoUserInfo | null>>(row => {
      return Promise.race([
        getUserInfoFromDynamo(row.userId),
        // 2 seconds
        new Promise<DynamoUserInfo | null>(res => setTimeout(() => res(null), 2000))
      ]);
    })
  );

  Promise.resolve(missingUserInfo).then(allUsers => {
    allUsers.forEach(user => {
      console.log(user?.name ?? "Not gotten from Dynamo");
    });
  });

  return { userUsageInfo, missingUserInfo };
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
