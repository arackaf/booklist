import { goto } from "$app/navigation";
import { page } from "$app/state";

export async function updateSearchParam(key, value) {
  const q = new URLSearchParams(page.url.searchParams);

  if (value) {
    q.set(key, value);
  } else {
    q.delete(key);
  }
  if (key !== "page") {
    q.delete("page");
  }

  const newUrl = new URL(page.url);
  newUrl.search = q.toString();

  goto(newUrl, {});
}

export const publicUserIdPersist = {
  urlTo(url: string) {
    const publicUserId = page.url.searchParams.get("user");
    if (!publicUserId) {
      return url;
    }
    return url + "?user=" + publicUserId;
  }
};
