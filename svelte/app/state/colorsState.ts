import { derived } from "svelte/store";

import AllLabelColorsQuery from "graphQL/misc/allLabelColors.graphql";
import { query } from "micro-graphql-svelte";
import { QueryOf, Queries } from "graphql-typings";

import { appState } from "./appState";

const { queryState, sync } = query(AllLabelColorsQuery);
appState.subscribe(state => sync({}, { active: !!state.userId }));

export default derived(queryState, (state: any) => ({
  loaded: !!state.data,
  colors: state.data ? state.data.allLabelColors.LabelColors.map(c => c.backgroundColor) : null,
}));
