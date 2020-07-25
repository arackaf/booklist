import React, { Component } from "react";

const Axis = props => {
  let { children, scale, graphWidth, data, scaleX, ...rest } = props;
  return (
    <g fontSize="10" {...rest} transform={props.transform}>
      <path fill="none" stroke="black" d={`M0.5,6 V0.5 H${props.graphWidth + 0.5} V 6`} />
      {data.map(d => {
        let x = scaleX(d.display);
        let width = scaleX.bandwidth();
        let translateX = x + width / 2;

        return (
          <g transform={`translate(${translateX}, 0)`}>
            <line stroke="#000" y1="0" y2="6" x1="0" x2="0"></line>
            <text fill="#000" style={{ textAnchor: "end" }} transform="translate(0, 10) rotate(300)">
              {d.display}
            </text>
          </g>
        );
      })}
    </g>
  );
};

export default Axis;
