import { redirect } from "@sveltejs/kit";

export async function load({ url }) {
  const redirectUrl = new URL(url);
  redirectUrl.searchParams.set("user", redirectUrl.searchParams.get("userId") || "");
  redirectUrl.searchParams.delete("userId");
  redirectUrl.pathname = "/books";

  return redirect(308, redirectUrl.toString());
}
