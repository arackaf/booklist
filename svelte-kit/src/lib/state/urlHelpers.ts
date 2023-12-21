import { goto } from "$app/navigation";
import { page } from "$app/stores";
import { derived, get } from "svelte/store";

export async function updateSearchParam(key, value) {
  const q = new URLSearchParams(get(page).url.searchParams);

  if (value) {
    q.set(key, value);
  } else {
    q.delete(key);
  }

  const newUrl = new URL(get(page).url);
  newUrl.search = q.toString();

  goto(newUrl, { replaceState: true });
}

export const publicUserIdPersist = derived(page, $page => {
  return {
    urlTo(url: string) {
      const publicUserId = $page.url.searchParams.get("user");
      if (!publicUserId) {
        return url;
      }
      return url + "?user=" + publicUserId;
    }
  };
});
