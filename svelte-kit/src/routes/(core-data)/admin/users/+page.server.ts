import { getUserUsageInfo, type UserUsageEntry } from "$data/user-usage-info";
import { redirect } from "@sveltejs/kit";

export const load = async ({ parent, locals }) => {
  const parentParams = await parent();
  if (!parentParams.isAdminUser) {
    redirect(302, "/");
  }

  const userUsageInfo: UserUsageEntry[] = await getUserUsageInfo(locals.db);

  return { userUsageInfo };
};
