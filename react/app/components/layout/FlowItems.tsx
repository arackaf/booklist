import React from "react";
import cn from "classnames";

export default ({ className = "", tighter = false, tightest = false, vCenter = false, children }) => (
  <div className={cn("flow-items", className, { tighter, tightest, ["v-center"]: vCenter })}>
    <div>{children}</div>
  </div>
);
