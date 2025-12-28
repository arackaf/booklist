import { ref } from "$lib/state/reactivityHelpers.svelte.js";
import { ensureLoggedIn } from "$lib/util/authCheck";

export async function load({ url, fetch, parent }) {
  await ensureLoggedIn({ parent });

  const resp = await fetch(`/api/recent-scans`);
  const packet = await resp.json();

  const { scans } = packet;

  return {
    scans: ref(scans)
  };
}
