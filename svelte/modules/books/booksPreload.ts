import { graphqlClient } from "util/graphql";
import { preloadBookImages } from "util/imagePreload";

import GetBooksQuery from "gql/books/getBooks.graphql";
import AllSubjectsQuery from "gql/subjects/allSubjects.graphql";
import GetTags from "gql/tags/getTags.graphql";
import AllLabelColorsQuery from "gql/misc/allLabelColors.graphql";
import { bookSearchVariablesFromCurrentUrl } from "modules/books/booksLoadingUtils";
import localStorage from "util/localStorage";

const COVERS_LIST = "books covers view";

export default function preload() {
  let variables = bookSearchVariablesFromCurrentUrl();
  return Promise.all([
    graphqlClient.preload(GetBooksQuery, variables),
    graphqlClient.preload(AllSubjectsQuery, { publicUserId: variables.publicUserId }),
    graphqlClient.preload(GetTags, { publicUserId: variables.publicUserId }),
    graphqlClient.preload(AllLabelColorsQuery, { cache: 9 })
  ]);
}
