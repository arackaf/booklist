import { goto } from "$app/navigation";
import { page } from "$app/stores";
import { derived, get } from "svelte/store";

export function updateSearchParam(key, value) {
  const q = new URLSearchParams(get(page).url.searchParams);

  if (value) {
    q.set(key, value);
  } else {
    q.delete(key);
  }

  return goto(`?${q}`, {
    noScroll: true
  });
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
