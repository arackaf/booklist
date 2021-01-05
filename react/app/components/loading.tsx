import React from "react";

export default ({ ...rest }) => (
  <div {...rest} className="wait-for-loading">
    <i className="fa fa-5x fa-spin fa-spinner" />
  </div>
);

export const LongLoading = ({ ...rest }) => (
  <div {...rest} className="wait-for-long-loading">
    <div>
      <h1>Still loading, sorry</h1> &nbsp;&nbsp;&nbsp; <i className="fa fa-5x fa-spin fa-spinner" />
    </div>
  </div>
);

export const LocalLoading = ({ style = {}, ...rest }) => (
  <div style={{ display: "flex", justifyContent: "center" }}>
    <div {...rest} style={{ opacity: 0.2, ...style }}>
      <i className="fa fa-5x fa-spin fa-spinner" />
    </div>
  </div>
);
