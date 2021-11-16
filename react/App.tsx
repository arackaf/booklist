import React from "react";

export default () => {
  const XXX = process.env.UPLOAD_BOOK_COVER;
  return (
    <div style={{ margin: "20px" }}>
      <h1>Ayyyy</h1>
      <h1>{XXX}</h1>
    </div>
  );
};
