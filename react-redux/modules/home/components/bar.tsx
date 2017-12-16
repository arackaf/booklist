import React, { Component, PureComponent } from "react";
import { findDOMNode, render } from "react-dom";

import select from "d3-selection/src/select";
import debounce from "lodash.debounce";

import Tooltip from "./tooltip";

export default class Bar extends PureComponent<any, any> {
  el: any;
  tooltip: any;
  tooltipShown: boolean;
  overTooltip: boolean;
  overBar: boolean;

  manageTooltip: any;

  _manageTooltip(show, evt?) {
    if (show && this.tooltipShown) {
      return;
    }
    if (show) {
      this.tooltipShown = true;

      this.tooltip.style.display = "block";
      this.tooltip.style.visibility = "hidden";

      let { count, index } = this.props;
      let tBox = this.tooltip.getBoundingClientRect();
      let element = findDOMNode(this.el);
      let box = element.getBoundingClientRect();
      let left = box.left + document.documentElement.scrollLeft + 2;
      let top = box.top + document.documentElement.scrollTop + 2;

      if (tBox.width > box.width && index / count > 0.5) {
        left -= tBox.width - box.width + 4;
      }

      if (tBox.height > box.height && box.top >= 54 + 7) {
        top -= tBox.height - box.height + 4;
      }

      if (box.top < 54) {
        top += 51 - box.top;
      }

      this.tooltip.style.left = left + "px";
      this.tooltip.style.top = top + "px";

      this.tooltip.style.visibility = "";
      this.tooltip.style.display = "block";
    } else {
      this.tooltipShown = false;
      this.tooltip.style.display = "none";
    }
  }

  removeBar = () => {
    this.props.removeBar(this.props.data.groupId);
    this._manageTooltip(false);
  };
  componentDidMount() {
    let { data, count } = this.props;
    this.manageTooltip = debounce(this._manageTooltip, 50);

    let tooltip = document.createElement("div");
    let childSubjects = data.entries.reduce((subjects, { children: theseChildren }) => subjects.concat(theseChildren), []);
    render(<Tooltip {...{ data, count, childSubjects }} removeBar={this.removeBar} />, tooltip);
    tooltip.setAttribute("class", "d3-tooltip");
    tooltip.style.display = "none";

    tooltip.onmouseenter = () => {
      this.manageTooltip(true);
    };

    tooltip.onmouseleave = e => {
      let el = document.elementFromPoint(e.clientX, e.clientY);

      do {
        if (tooltip === el) {
          //false positive
          return;
        }
      } while ((el = el.parentNode as any));

      this.manageTooltip(false);
    };

    this.tooltip = tooltip;
    document.body.appendChild(tooltip);
  }
  _showTooltip = evt => {
    evt.persist();
    this.manageTooltip(true, evt);
  };
  _hideTooltip = evt => {
    evt.persist();
    this.manageTooltip(false);
  };
  render() {
    let { x, data, height, width, graphWidth } = this.props;

    return data.entries.length == 1 ? (
      <SingleBar
        showTooltip={this._showTooltip}
        hideTooltip={this._hideTooltip}
        ref={el => (this.el = el)}
        color={data.entries[0].color}
        children={data.entries[0].children}
        {...{ height, width, x, graphWidth }}
      />
    ) : (
      <MultiBar
        showTooltip={this._showTooltip}
        hideTooltip={this._hideTooltip}
        ref={el => (this.el = el)}
        {...{ height, width, x, graphWidth, data }}
      />
    );
  }
}

class SingleBar extends PureComponent<any, any> {
  el: any;
  componentDidMount() {
    this.drawBar();
  }
  componentDidUpdate(prevProps, prevState) {
    this.drawBar();
  }
  drawBar() {
    select(this.el)
      .transition()
      .duration(300)
      .attr("height", this.props.height)
      .attr("width", this.props.width)
      .attr("x", this.props.x);
  }
  render() {
    let { x, height, width, color, graphWidth, showTooltip, hideTooltip } = this.props;

    return (
      <rect onMouseOver={showTooltip} onMouseOut={hideTooltip} ref={el => (this.el = el)} x={graphWidth} y={0} height={0} fill={color} width={0} />
    );
  }
}

class MultiBar extends PureComponent<any, any> {
  el: any;
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

      select(this[`el${i}`])
        .transition()
        .duration(300)
        .attr("height", barHeight)
        .attr("width", width)
        .attr("x", x)
        .attr("y", heightUsed);

      heightUsed += barHeight;
    });
  }
  render() {
    let { x, height, width, data, graphWidth, showTooltip, hideTooltip } = this.props,
      colors = data.entries.map(e => e.color);

    return (
      <g onMouseOver={showTooltip} onMouseOut={hideTooltip}>
        {colors.map((color, i) => <rect ref={el => (this[`el${i}`] = el)} x={graphWidth} y={0} height={0} fill={color} width={0} />)}
      </g>
    );
  }
}
