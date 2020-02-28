import { graphqlClient } from "util/graphql";
import AllSubjectsQuery from "graphQL/subjects/allSubjects.graphql";
import AllLabelColorsQuery from "graphQL/misc/allLabelColors.graphql";

import { getCurrentUrlState } from "util/urlHelpers";

export default function preload() {
  let variables = getCurrentUrlState().searchState;
  graphqlClient.preload(AllSubjectsQuery, { publicUserId: variables.publicUserId });
  graphqlClient.preload(AllLabelColorsQuery , { cache: 9 });
}
