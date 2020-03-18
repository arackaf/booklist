import React, { SFC, FC } from "react";
import cn from "classnames";

type Props = {
  className?: string;
  xsFlowReverse?: boolean;
  tighter?: boolean;
  tightest?: boolean;
  vCenter?: boolean;
  pushLast?: boolean;
};

const FlowItems: FC<Props> = ({ className = "", xsFlowReverse, tighter, tightest, vCenter, pushLast, children }) => {
  const cssClasses = {
    tighter,
    tightest,
    ["v-center"]: vCenter,
    ["push-last"]: pushLast,
    ["xs-pull-reverse"]: xsFlowReverse
  };

  return (
    <div className={cn("flow-items", className, cssClasses)}>
      <div>{children}</div>
    </div>
  );
};

export default FlowItems;