import { graphqlClient } from "util/graphql";
import { preloadBookImages } from "util/imagePreload";

import GetBooksQuery from "graphQL/books/getBooks.graphql";
import AllSubjectsQuery from "graphQL/subjects/allSubjects.graphql";
import GetTags from "graphQL/tags/getTags.graphql";
import AllLabelColorsQuery from "graphQL/misc/allLabelColors.graphql";
import { bookSearchVariablesFromCurrentUrl } from "modules/books/booksLoadingUtils";
import localStorage from "util/localStorage";

const COVERS_LIST = "books covers view";

export default function preload() {
  let variables = bookSearchVariablesFromCurrentUrl();
  return Promise.all([
    Promise.resolve(graphqlClient.preload(GetBooksQuery, variables)).then(resp =>
      preloadBookImages(resp, localStorage.get("book-ui") == COVERS_LIST)
    ),
    graphqlClient.preload(AllSubjectsQuery, { publicUserId: variables.publicUserId }),
    graphqlClient.preload(GetTags, { publicUserId: variables.publicUserId }),
    graphqlClient.preload(AllLabelColorsQuery, { cache: 9 })
  ]);
}
