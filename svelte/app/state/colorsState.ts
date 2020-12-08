import { derived } from "svelte/store";
import { query } from "micro-graphql-svelte";

import AllLabelColorsQuery from "graphQL/misc/allLabelColors.graphql";
import { appState } from "./appState";
import { QueryOf, Queries } from "graphql-typings";

const { queryState, sync } = query<QueryOf<Queries["allLabelColors"]>>(AllLabelColorsQuery);
appState.subscribe(state => sync({}, { active: !!state.userId }));

export default derived(queryState, state => ({
  loaded: !!state,
  colors: state.data ? state.data.allLabelColors.LabelColors.map(c => c.backgroundColor) : null,
}));
