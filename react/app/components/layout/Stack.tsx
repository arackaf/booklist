import React from "react";
import cn from "classnames";

export default ({ className = "", style = {}, tighter = false, tightest = false, looser = false, loosest = false, children }) => (
  <div style={style} className={cn("stack", className, { tighter, tightest, looser, loosest })}>{children}</div>
);
