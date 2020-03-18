import React from "react";
import cn from "classnames";

export default ({ className = "", tighter = false, tightest = false, vCenter = false, pushLast = false, children }) => (
  <div className={cn("flow-items", className, { tighter, tightest, ["v-center"]: vCenter, ["push-last"]: pushLast })}>
    <div>{children}</div>
  </div>
);
