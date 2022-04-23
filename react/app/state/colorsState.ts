import { useSuspenseQuery } from "micro-graphql-react";

import AllLabelColorsQuery from "gql/misc/allLabelColors.graphql";
import { QueryOf, Queries } from "gql/graphql-typings";

export function useColors() {
  let { data } = useSuspenseQuery<QueryOf<Queries["allLabelColors"]>>(AllLabelColorsQuery, {});
  return {
    loaded: !!data,
    colors: data ? data.allLabelColors.LabelColors.map(c => c.backgroundColor) : []
  };
}
