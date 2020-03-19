import React from "react";
import cn from "classnames";

export default ({ className = "", tighter = false, tightest = false, xsFlowReverse = false, children }) => (
  <div className={cn("flex-row", className, { tighter, tightest, ["xs-pull-reverse"]: xsFlowReverse })}>
    <div>{children}</div>
  </div>
);
