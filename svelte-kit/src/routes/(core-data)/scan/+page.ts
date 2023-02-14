import { ensureLoggedIn } from "$lib/util/authCheck";

export async function load({ parent }: any) {
  await ensureLoggedIn({ parent });
}
