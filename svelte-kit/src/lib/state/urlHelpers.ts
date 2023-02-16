import { page } from "$app/stores";
import { derived } from "svelte/store";

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
