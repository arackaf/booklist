import { useState, useEffect, useContext } from "react";

import AllLabelColorsQuery from "graphQL/misc/allLabelColors.graphql";
import { graphqlClient } from "util/graphql";
import { AppState } from "./appState";
import { AppContext } from "./renderUI";
import { useQuery, buildQuery } from "micro-graphql-react";
import { QueryOf, Queries } from "graphql-typings";

export function useColors() {
  let appPacket = useContext(AppContext);

  let userId = appPacket && appPacket.length ? appPacket[0].userId : "";

  let { data } = useQuery<QueryOf<Queries["allLabelColors"]>>(buildQuery(AllLabelColorsQuery, { cache: 9 }, { active: !!userId }));
  return { loaded: !!data, colors: data ? data.allLabelColors.LabelColors.map(c => c.backgroundColor) : null };
}
