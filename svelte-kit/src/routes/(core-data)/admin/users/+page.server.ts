import { db, executeDrizzle } from "$data/dbUtils";
import { userInfoCache } from "$data/drizzle-schema.js";
import type { DynamoUserInfo as StoredUserInfo } from "$data/types.js";
import { getUserInfoFromDynamo, getUserUsageInfo } from "$data/user-usage-info";
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

  const missingUserInfo: Promise<StoredUserInfo[]> = Promise.all(
    missingUsers
      .filter((user, idx) => idx <= 10)
      .map(row => {
        return Promise.race([
          getUserInfoFromDynamo(row.userId),
          // 2 seconds
          new Promise<null>(res => setTimeout(() => res(null), 2000))
        ]);
      })
      .filter(val => val != null) as Promise<StoredUserInfo>[]
  );

  await Promise.resolve(missingUserInfo).then(async allUsers => {
    for (const user of allUsers) {
      const existingUser = await db.select().from(userInfoCache).where(eq(userInfoCache.userId, user.userId));
      if (!existingUser.length) {
        try {
          console.log("Inserting user", user.userId, user.provider);
          await executeDrizzle(
            "Insert into user cache",
            db.insert(userInfoCache).values({
              lastSync: +new Date(),
              ...user
            })
          );
        } catch (er) {
          console.log("Error inserting into user info cache for", user.userId, er);
        }
      } else {
        if (user.provider !== "Legacy") {
          try {
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
          } catch (er) {
            console.log("Error updating user info cache for", user.userId, er);
          }
        }
      }
    }
  });

  return { userUsageInfo, missingUserInfo };
};
