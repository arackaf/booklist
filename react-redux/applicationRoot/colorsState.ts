import { useState, useEffect } from "react";

import AllLabelColorsQuery from "graphQL/misc/allLabelColors.graphql";
import { graphqlClient } from "./rootReducer";

export function useColors() {
  let [{ loaded, colors }, update] = useState({ loaded: false, colors: [] });

  useEffect(() => {
    Promise.resolve(graphqlClient.runQuery(AllLabelColorsQuery, { cache: 9 })).then<any>(({ data: { allLabelColors } }) => {
      let { LabelColors: labelColors } = allLabelColors;
      update({ loaded: true, colors: labelColors });
    });
  }, []);

  return { loaded, colors };
}
