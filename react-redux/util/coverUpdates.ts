import ajaxUtil from "./ajaxUtil";
import { syncUpdates } from "applicationRoot/graphqlHelpers";

import GetBooksQuery from "graphQL/books/getBooks.graphql";

export const updateSmallCover = ({ _id, userId, url }) => {
  return ajaxUtil
    .post("/book/newSmallImage", { _id, userId, url })
    .then(({ url, failure }) => {
      if (!failure && url) {
        syncUpdates(GetBooksQuery, { _id, smallImage: url }, "allBooks", "Books", { force: true });
      }
      return { url, failure };
    })
    .catch(() => ({ failure: true, url: "" }));
};

export const updateMediumCover = ({ _id, userId, url }) => {
  return ajaxUtil
    .post("/book/newMediumImage", { _id, userId, url })
    .then(({ url, failure }) => {
      if (!failure && url) {
        syncUpdates(GetBooksQuery, { _id, mediumImage: url }, "allBooks", "Books", { force: true });
      }
      return { url, failure };
    })
    .catch(() => ({ failure: true, url: "" }));
};
