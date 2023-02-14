import { ensureLoggedIn } from "$lib/util/authCheck";
import { writable } from "svelte/store";

export async function load({ url, fetch, parent }: any) {
  await ensureLoggedIn({ parent });
  const resp = await fetch(`/api/recent-scans?${url.searchParams.toString()}`);
  const packet = await resp.json();

  const { scans, nextPageKey } = packet;

  return {
    scans: writable(scans),
    nextPageKey: writable(nextPageKey)
  };
}
