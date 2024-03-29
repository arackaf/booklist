import { db, executeDrizzle } from "$data/dbUtils";
import { userInfoCache } from "$data/drizzle-schema.js";
import { getUserInfoFromDynamo, getUserUsageInfo, type DynamoUserInfo } from "$data/user-usage-info";
import { redirect } from "@sveltejs/kit";
import { eq } from "drizzle-orm";

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

  for (const x of missingUsers) {
    console.log("Missing", x.userId);
  }

  const missingUserInfo = Promise.all(
    missingUsers.map<Promise<DynamoUserInfo | null>>(row => {
      return Promise.race([
        getUserInfoFromDynamo(row.userId),
        // 2 seconds
        new Promise<DynamoUserInfo | null>(res => setTimeout(() => res(null), 2000))
      ]);
    })
  );

  Promise.resolve(missingUserInfo).then(async allUsers => {
    console.log("------\n\n");

    for (const user of allUsers) {
      if (user && user.provider !== "Legacy") {
        console.log(user.userId, user.provider);

        const existingUser = await db.select().from(userInfoCache).where(eq(userInfoCache.userId, user.userId));
        if (!existingUser.length) {
          await executeDrizzle(
            "Insert into user cache",
            db.insert(userInfoCache).values({
              lastSync: +new Date(),
              ...user
            })
          );
        } else {
          await executeDrizzle(
            "Update user cache",
            db
              .update(userInfoCache)
              .set({
                lastSync: +new Date(),
                ...user
              })
              .where(eq(userInfoCache.userId, user.userId))
          );
        }
      }
    }
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
