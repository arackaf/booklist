import React from "react";
import cn from "classnames";

export default ({ className = "", tighter = false, tightest = false, children }) => (
  <div className={cn("stack", className, { tighter, tightest })}>{children}</div>
);
