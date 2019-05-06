import React from "react";
import { useQuery, buildQuery } from "micro-graphql-react";

import SummaryQuery from "graphQL/admin/bookSummaryCoverInfo.graphql";

export default props => {
  const { data, loaded } = useQuery(buildQuery(SummaryQuery, {}));
  const bookSummaries = loaded ? data : [];

  debugger;

  return <div>{loaded ? <div>A</div> : <div>X</div>}</div>;
};
