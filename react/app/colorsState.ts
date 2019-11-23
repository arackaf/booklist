import { useState, useEffect, useContext } from "react";

import AllLabelColorsQuery from "graphQL/misc/allLabelColors.graphql";
import { graphqlClient } from "util/graphql";
import { AppState } from "./appState";
import { AppContext } from "./renderUI";

export function useColors() {
  let appPacket = useContext(AppContext);
  let [{ loaded, colors }, update] = useState({ loaded: false, colors: [] });
  let userId = "";
  if (appPacket && appPacket.length) {
    userId = appPacket[0].userId;
  }

  useEffect(() => {
    if (userId) {
      Promise.resolve(graphqlClient.runQuery(AllLabelColorsQuery, { cache: 9 })).then<any>(({ data: { allLabelColors } }) => {
        let { LabelColors: labelColors } = allLabelColors;
        update({ loaded: true, colors: labelColors.map(c => c.backgroundColor) });
      });
    }
  }, [userId]);

  return { loaded, colors };
}
