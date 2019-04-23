import ajaxUtil from "./ajaxUtil";
import { syncUpdates } from "app/graphqlHelpers";

import GetBooksQuery from "graphQL/books/getBooks.graphql";

export const syncCovers = (_id, img, url) => {
  syncUpdates(GetBooksQuery, { _id, [img]: url }, "allBooks", "Books", { force: true });
};

export const updateSmallCover = ({ _id, url }) => {
  return ajaxUtil
    .post("/book/newSmallImage", { _id, url })
    .then(({ url, failure }) => {
      if (!failure && url) {
        syncUpdates(GetBooksQuery, { _id, smallImage: url }, "allBooks", "Books", { force: true });
      }
      return { url, failure };
    })
    .catch(() => ({ failure: true, url: "" }));
};

export const updateMediumCover = ({ _id, url }) => {
  return ajaxUtil
    .post("/book/newMediumImage", { _id, url })
    .then(({ url, failure }) => {
      if (!failure && url) {
        syncUpdates(GetBooksQuery, { _id, mediumImage: url }, "allBooks", "Books", { force: true });
      }
      return { url, failure };
    })
    .catch(() => ({ failure: true, url: "" }));
};
