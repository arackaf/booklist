import X, { goto } from "$app/navigation";
import { page } from "$app/stores";
import { tick } from "svelte";
import { derived, get } from "svelte/store";

export async function updateSearchParam(key, value) {
  // const q = new URLSearchParams(get(page).url.searchParams);

  // if (value) {
  //   q.set(key, value);
  // } else {
  //   q.delete(key);
  // }

  // await tick();
  await goto(`/books`, { replaceState: true })
    .then(x => {
      // debugger;
    })
    .catch(err => {
      // debugger;
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
