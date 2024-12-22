import { ref } from "$lib/state/reactivityHelpers.svelte.js";
import { ensureLoggedIn } from "$lib/util/authCheck";

export async function load({ url, fetch, parent }) {
  await ensureLoggedIn({ parent });

  const resp = await fetch(`/api/recent-scans?${url.searchParams.toString()}`);
  const packet = await resp.json();

  const { scans, nextPageKey } = packet;

  return {
    scans: ref(scans),
    nextPageKey: ref(nextPageKey)
  };
}
