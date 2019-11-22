import { graphqlClient } from "util/graphql";
import GetBooksQuery from "graphQL/books/getBooks.graphql";
import { bookSearchVariablesFromCurrentUrl } from "./booksState";

export default function preload() {
  let variables = bookSearchVariablesFromCurrentUrl();
  graphqlClient.preload(GetBooksQuery, variables);
}
