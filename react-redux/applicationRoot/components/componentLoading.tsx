import React from "react";

export default ({ isLoading, pastDelay }) =>
  isLoading && pastDelay ? (
    <div style={{ position: "fixed", top: 0, left: "50%", marginLeft: "auto", width: "150px", backgroundColor: "#f0ad4e", zIndex: 999999 }}>
      <div style={{ textAlign: "center" }}>
        Loading <i className="fa fa-fw fa-spinner fa-spin" />
      </div>
    </div>
  ) : null;
