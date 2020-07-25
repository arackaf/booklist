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
      .attr("display", "none")
      // .attr("transform", "rotate(290) translate(-10, -10)")
      .style("text-anchor", "end");

  }
  render() {
    let { children, scale, graphWidth, ...rest } = this.props;
    return (
      <>
        <g ref={el => (this.el = el)} {...rest} />
        <g {...rest} transform={this.props.transform + " translate(0, 10)"}>
          <path fill="none" stroke="black" d={`M0.5,6 V0.5 H${this.props.graphWidth + 0.5} V 6`} />
        </g>
      </>
    );
  }
}
