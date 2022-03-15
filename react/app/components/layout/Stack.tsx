import React from "react";
import cn from "classnames";

export default ({
  className = "",
  style = {},
  inline = false,
  tighter = false,
  tightest = false,
  looser = false,
  loosest = false,
  children,
  ...rest
}) => (
  <div style={style} className={cn("stack", className, { inline, tighter, tightest, looser, loosest })} {...rest}>
    {children}
  </div>
);
