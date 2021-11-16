import React from "react";

import Query from "./graphQL/admin/bookSummaryCoverInfo.graphql";

export default () => {
  const XXX = process.env.UPLOAD_BOOK_COVER;
  const A = process.env.DEV;
  return (
    <div style={{ margin: "20px" }}>
      <h1>Ayyyy</h1>
      <h1>{XXX}</h1>
      <h1>{Query}</h1>
      <h1>{A}</h1>
    </div>
  );
};
