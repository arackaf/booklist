import React from "react";
import cn from "classnames";

export default ({ className = "", tighter = false, tightest = false, looser = false, loosest = false, children }) => (
  <div className={cn("stack", className, { tighter, tightest, looser, loosest })}>{children}</div>
);
