import { writable } from "svelte/store";

export async function load({ url, fetch }: any) {
  const resp = await fetch(`/api/recent-scans?${url.searchParams.toString()}`);
  const packet = await resp.json();

  const { scans, nextPageKey } = packet;

  console.log({ scans });
  return {
    scans: writable(scans),
    nextPageKey: writable(nextPageKey)
  };
}
