import { graphqlClient } from "util/graphql";
import AllSubjectsQuery from "gql/subjects/allSubjects.graphql";
import AllLabelColorsQuery from "gql/misc/allLabelColors.graphql";

import { getCurrentUrlState } from "util/urlHelpers";

export default function preload() {
  let variables = getCurrentUrlState().searchState;
  graphqlClient.preload(AllSubjectsQuery, { publicUserId: variables.publicUserId });
  graphqlClient.preload(AllLabelColorsQuery, {});
}
