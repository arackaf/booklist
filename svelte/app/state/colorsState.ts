import { derived } from "svelte/store";
import { query } from "micro-graphql-svelte";

import AllLabelColorsQuery from "graphQL/misc/allLabelColors.graphql";
import type { QueryOf, Queries, QueryAllLabelColorsArgs } from "graphql-typings";

const { queryState } = query<QueryOf<Queries["allLabelColors"]>, Partial<QueryAllLabelColorsArgs>>(AllLabelColorsQuery, {
  initialSearch: { cache: 9 }
});

export default derived(queryState, state => ({
  loaded: !!state,
  colors: state.data ? state.data.allLabelColors.LabelColors.map(c => c.backgroundColor) : []
}));
