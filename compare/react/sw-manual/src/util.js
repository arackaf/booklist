export const doFetch = url =>
  fetch(url, {
    method: "get",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    }
  });

export const gqlResponse = (op, coll) => data => new Response(JSON.stringify({ data: { [op]: { [coll]: data } } }));
export const bookSyncTransform = book => Object.assign(book, { title_ci: (book.title || "").toLowerCase() });
