import { graphqlClient } from "applicationRoot/rootReducerActionCreators";

import GetBooksQuery from "./searchBooks.graphql";
import { SET_SEARCH_VALUES, SEARCH_BOOKS_COMPLETE } from "./actionNames";

export const setSearchValues = values => dispatch => dispatch({ type: SET_SEARCH_VALUES, values });

export const booksSearch = () => (dispatch, getState) => {
  let getBooksVariables: any = {
    page: 1,
    pageSize: 20,
    sort: { title: 1 }
  };
  return graphqlClient.runQuery(GetBooksQuery, getBooksVariables).then(resp => {
    if (resp.data && resp.data.allBooks && resp.data.allBooks.Books && resp.data.allBooks.Meta) {
      dispatch({ type: SEARCH_BOOKS_COMPLETE, results: resp.data.allBooks.Books, count: resp.data.allBooks.Meta.count });
    }
  });
};
