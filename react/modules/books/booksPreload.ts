import { graphqlClient } from "util/graphql";

import GetBooksQuery from "gql/books/getBooks.graphql";
import AllSubjectsQuery from "gql/subjects/allSubjects.graphql";
import GetTags from "gql/tags/getTags.graphql";
import AllLabelColorsQuery from "gql/misc/allLabelColors.graphql";
import PublicUserQuery from "gql/getPublicUser.graphql";

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
