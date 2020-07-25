import React, { Component } from "react";

import { axisBottom } from "d3-axis";
import select from "d3-selection/src/select";

export default class Axis extends Component<any, any> {
  //df
  el: any;
  componentDidMount() {
    this.updateAxis();
  }
  componentDidUpdate(prevProps, prevState) {
    this.updateAxis();
  }
  updateAxis() {
    let { scale } = this.props;
    let xAxis = axisBottom().scale(scale);

    select(this.el)
      .transition()
      .duration(200)
      .call(xAxis)
      .selectAll("text")
      //.attr("display", "none")
      .attr("transform", "rotate(290) translate(-10, -10)")
      .style("text-anchor", "end");
  }
  render() {
    let { children, scale, graphWidth, data, scaleX, ...rest } = this.props;
    return (
      <>
        <g ref={el => (this.el = el)} {...rest} />
        <g fontSize="10" {...rest} transform={this.props.transform + " translate(0, 70)"}>
          <path fill="none" stroke="black" d={`M0.5,6 V0.5 H${this.props.graphWidth + 0.5} V 6`} />
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
      </>
    );
  }
}
