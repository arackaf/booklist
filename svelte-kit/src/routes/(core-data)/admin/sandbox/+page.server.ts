import { redirect } from "@sveltejs/kit";
import { env } from "$env/dynamic/private";
const { ADMIN_USER } = env;

export const load = async ({ parent, url }) => {
  const parentParams = await parent();
  if (!parentParams.isAdminUser) {
    redirect(302, "/");
  }
  const token = env.FLY_TOKEN;
  const app = env.FLY_BOOK_SCAN_SAVE_APP;

  const response = await fetch(`https://api.machines.dev/v1/apps/${app}/machines`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  const data = await response.json();
  console.log({ data });

  return { data };
};
