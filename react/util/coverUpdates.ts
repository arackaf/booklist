import ajaxUtil from "./ajaxUtil";
import { syncUpdates } from "util/graphqlCacheHelpers";

import GetBooksQuery from "graphQL/books/getBooks.graphql";

export const syncCovers = (_id, img, url) => {
  syncUpdates(GetBooksQuery, { _id, [img]: url }, "allBooks", "Books", { force: true });
};

