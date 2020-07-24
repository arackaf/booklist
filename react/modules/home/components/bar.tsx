import React, { PureComponent } from "react";

import select from "d3-selection/src/select";

export default class Bar extends PureComponent<any, any> {
  el: any;
  tooltip: any;
  tooltipShown: boolean;
  overTooltip: boolean;
  overBar: boolean;

  manageTooltip: any;

  render() {
    let { x, data, height, width, graphWidth, count, hoverBar, unHoverBar } = this.props;

    return data.entries.length == 1 ? (
      <SingleBar
        color={data.entries[0].color}
        children={data.entries[0].children}
        {...{ data, count, height, width, x, graphWidth, hoverBar, unHoverBar }}
      />
    ) : (
      <MultiBar {...{ data, count, height, width, x, graphWidth, hoverBar, unHoverBar }} />
    );
  }
}

class SingleBar extends PureComponent<any, any> {
  el: any;
  constructor(props) {
    super(props);
    this.state = { initialWidth: this.props.graphWidth };
  }
  componentDidMount() {
    this.drawBar();
  }
  componentDidUpdate(prevProps, prevState) {
    this.drawBar();
  }
  drawBar() {
    select(this.el).transition().duration(300).attr("height", this.props.height).attr("width", this.props.width).attr("x", this.props.x);
  }
  render() {
    let { color, hoverBar, unHoverBar, data } = this.props;
    let { initialWidth } = this.state;

    return (
      <g onMouseOver={() => hoverBar(data.groupId)} onMouseOut={() => unHoverBar(data.groupId)}>
        <rect ref={el => (this.el = el)} x={initialWidth} y={0} height={0} width={0} fill={color} />
      </g>
    );
  }
}

class MultiBar extends PureComponent<any, any> {
  el: any;
  constructor(props) {
    super(props);
    this.state = { initialWidth: this.props.graphWidth };
  }
  componentDidMount() {
    this.drawBar();
  }
  componentDidUpdate(prevProps, prevState) {
    this.drawBar();
  }
  drawBar() {
    let { height, width, x, data } = this.props,
      count = data.entries.length,
      colors = data.entries.map(e => e.color),
      sectionHeight = ~~(height / count),
      heightUsed = 0;

    colors.forEach((color, i) => {
      let isLast = i + 1 == count,
        barHeight = isLast ? height - heightUsed : sectionHeight;

      select(this[`el${i}`]).transition().duration(300).attr("height", barHeight).attr("width", width).attr("x", x).attr("y", heightUsed);

      heightUsed += barHeight;
    });
  }
  render() {
    let { data, hoverBar, unHoverBar } = this.props;
    let { initialWidth } = this.state;
    let colors = data.entries.map(e => e.color);

    return (
      <g onMouseOver={() => hoverBar(data.groupId)} onMouseOut={() => unHoverBar(data.groupId)}>
        {colors.map((color, i) => (
          <rect ref={el => (this[`el${i}`] = el)} x={initialWidth} y={0} height={0} fill={color} width={0} key={i} />
        ))}
      </g>
    );
  }
}
