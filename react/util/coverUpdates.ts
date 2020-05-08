import ajaxUtil from "./ajaxUtil";
import { syncUpdates } from "util/graphqlHelpers";

import GetBooksQuery from "graphQL/books/getBooks.graphql";

export const syncCovers = (_id, img, url) => {
  syncUpdates(GetBooksQuery, { _id, [img]: url }, "allBooks", "Books", { force: true });
};

export const updateSmallCover = ({ _id, url }) => {
  return ajaxUtil.post("/book/newSmallImage", { _id, url }).catch(() => ({ failure: true, url: "" }));
};

export const updateMediumCover = ({ _id, url }) => {
  return ajaxUtil.post("/book/newMediumImage", { _id, url }).catch(() => ({ failure: true, url: "" }));
};
