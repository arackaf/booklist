import React, { Component, PureComponent } from "react";
import { findDOMNode, render } from "react-dom";

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
      .duration(300)
      .call(xAxis)
      .selectAll("text")
      .attr("transform", "rotate(290) translate(-10, -10)")
      .style("text-anchor", "end");
  }
  render() {
    let { children, scale, ...rest } = this.props;
    return <g ref={el => (this.el = el)} {...rest} />;
  }
}
