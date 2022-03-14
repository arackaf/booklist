import { graphqlClient } from "util/graphql";

import GetBooksQuery from "graphQL/books/getBooks.graphql";
import AllSubjectsQuery from "graphQL/subjects/allSubjects.graphql";
import GetTags from "graphQL/tags/getTags.graphql";
import AllLabelColorsQuery from "graphQL/misc/allLabelColors.graphql";
import PublicUserQuery from "graphQL/getPublicUser.graphql";

import { bookSearchVariablesFromCurrentUrl } from "./booksLoadingUtils";

export function subjectsAndTagsNonPublicPreload() {
  graphqlClient.preload(AllSubjectsQuery, {});
  graphqlClient.preload(GetTags, {});
  graphqlClient.preload(AllLabelColorsQuery, {});
}

export default function preload() {
  let variables = bookSearchVariablesFromCurrentUrl();
  graphqlClient.preload(GetBooksQuery, variables);
  graphqlClient.preload(AllSubjectsQuery, { publicUserId: variables.publicUserId });
  graphqlClient.preload(GetTags, { publicUserId: variables.publicUserId });
  graphqlClient.preload(AllLabelColorsQuery, {});
}

export function publicUserPreload() {
  let variables = bookSearchVariablesFromCurrentUrl();
  graphqlClient.preload(PublicUserQuery, { _id: variables.publicUserId });
}
