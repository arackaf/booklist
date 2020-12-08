import { useContext } from "react";
import { useSuspenseQuery } from "micro-graphql-react";

import AllLabelColorsQuery from "graphQL/misc/allLabelColors.graphql";
import { AppContext } from "../renderUI";
import { QueryOf, Queries } from "graphql-typings";

export function useColors() {
  let appPacket = useContext(AppContext); 
  let userId = appPacket && appPacket.length ? appPacket[0].userId : "";

  let { data } = useSuspenseQuery<QueryOf<Queries["allLabelColors"]>>(AllLabelColorsQuery, { cache: 9 }, { active: !!userId });
  return { loaded: !!data, colors: data ? data.allLabelColors.LabelColors.map(c => c.backgroundColor) : null };
}
