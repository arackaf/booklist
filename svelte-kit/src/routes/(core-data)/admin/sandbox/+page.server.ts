import { redirect } from "@sveltejs/kit";

export const load = async ({ parent }) => {
  const parentParams = await parent();
  if (!parentParams.isAdminUser) {
    redirect(302, "/");
  }

  return { data: null };
};
