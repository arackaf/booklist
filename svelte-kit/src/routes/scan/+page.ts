import { ensureLoggedIn } from "$lib/util/authCheck";

export async function load({ parent }) {
  await ensureLoggedIn({ parent });
}
