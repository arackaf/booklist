import React from "react";

export default ({ ...rest }) => (
  <div {...rest} className="wait-for-loading">
    <i className="fa fa-5x fa-spin fa-spinner" />
  </div>
);

export const SectionLoading = ({ style = {}, ...rest }) => (
  <i
    style={{ position: "absolute", top: "50%", left: "50%", opacity: 0.2, transform: "translate(-50%,-50%)", ...style }}
    className="fa fa-5x fa-spin fa-spinner"
  />
);
