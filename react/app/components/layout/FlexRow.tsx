import React from "react";
import cn from "classnames";

export default ({ tighter = false, tightest = false, children }) => (
  <div className={cn("flex-row", { tighter, tightest })}>
    <div>{children}</div>
  </div>
);
