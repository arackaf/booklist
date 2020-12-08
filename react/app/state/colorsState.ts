import { useSuspenseQuery } from "micro-graphql-react";

import AllLabelColorsQuery from "graphQL/misc/allLabelColors.graphql";
import { QueryOf, Queries } from "graphql-typings";

export function useColors() {
  let { data } = useSuspenseQuery<QueryOf<Queries["allLabelColors"]>>(AllLabelColorsQuery, { cache: 9 });
  return {
    loaded: !!data,
    colors: data ? data.allLabelColors.LabelColors.map(c => c.backgroundColor) : null
  };
}
