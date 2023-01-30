import { redirect } from "@sveltejs/kit";

export async function load({ locals }: any) {
  const session = await locals.getSession();
  if (session?.user) {
    throw redirect(308, "/home/explore");
  } else {
    throw redirect(308, "/home");
  }
}
