import { graphqlClient } from "applicationRoot/rootReducerActionCreators";

import GetBooksQuery from "./searchBooks.graphql";
import { LOAD_BOOKS_COMPLETE } from "./actionNames";

export const booksSearch = () => (dispatch, getState) => {
  let getBooksVariables: any = {
    page: 1,
    pageSize: 20,
    sort: { title: 1 }
  };
  debugger;
  return graphqlClient.runQuery(GetBooksQuery, getBooksVariables).then(resp => {
    debugger;
    if (resp.data && resp.data.allBooks && resp.data.allBooks.Books && resp.data.allBooks.Meta) {
      dispatch({ type: LOAD_BOOKS_COMPLETE, results: resp.data.allBooks.Books, count: resp.data.allBooks.Meta.count });
    }
  });
};
