import React from "react";
import cn from "classnames";

export default ({ tighter = false, tightest = false, children }) => (
  <div className={cn("flow-items", { tighter, tightest })}>
    <div>{children}</div>
  </div>
);
