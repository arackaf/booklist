import React, { PureComponent, useLayoutEffect, useRef, useState, useMemo } from "react";
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

  _manageTooltip(show) {
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
      let box = (element as any).getBoundingClientRect();
      let left = box.left + document.documentElement.scrollLeft + 2;
      let top = box.top + window.scrollY + 2;

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
    document.getElementsByTagName("main")[0].addEventListener("scroll", this.hideTooltipImmediate);
    let { data, count, drilldown, chartIndex } = this.props;
    this.manageTooltip = debounce(this._manageTooltip, 50);

    let tooltip = document.createElement("div");
    let childSubjects = data.entries.reduce((subjects, { children: theseChildren }) => subjects.concat(theseChildren), []);
    render(<Tooltip {...{ data, count, childSubjects, drilldown, chartIndex }} removeBar={this.removeBar} />, tooltip);
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
  componentWillUnmount() {
    document.getElementsByTagName("main")[0].removeEventListener("scroll", this.hideTooltipImmediate);
  }
  showTooltip = () => {
    this.manageTooltip(true);
  };
  hideTooltip = () => {
    this.manageTooltip(false);
  };
  hideTooltipImmediate = () => {
    this._manageTooltip(false);
  };
  showTooltipImmediate = () => {
    this._manageTooltip(true);
  };
  _toggleTooltip = () => {
    this._manageTooltip(!this.tooltipShown);
  };
  render() {
    let { x, data, height, width, graphWidth, offsetY, count, index } = this.props;

    return data.entries.length == 1 ? (
      <SingleBar
        showTooltip={this.showTooltip}
        showTooltipImmediate={this.showTooltipImmediate}
        hideTooltip={this.hideTooltip}
        toggleTooltip={this._toggleTooltip}
        ref={el => (this.el = el)}
        color={data.entries[0].color}
        children={data.entries[0].children}
        {...{ data, count, index, height, width, x, graphWidth, offsetY }}
      />
    ) : (
      <MultiBar
        showTooltip={this.showTooltip}
        showTooltipImmediate={this.showTooltipImmediate}
        hideTooltip={this.hideTooltip}
        toggleTooltip={this._toggleTooltip}
        ref={el => (this.el = el)}
        {...{ height, width, x, graphWidth, data, offsetY }}
      />
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
    let { x, height, width, color, data, offsetY, count, index } = this.props;
    let { initialWidth } = this.state;

    return (
      <>
        <g>
          <rect ref={el => (this.el = el)} x={initialWidth} y={0} height={0} width={0} fill={color} />
        </g>
        <SvgTooltip data={data} srcHeight={height} srcWidth={width} srcX={x} offsetY={offsetY} count={count} index={index} />
      </>
    );
  }
}

const SvgTooltip = props => {
  const { srcHeight, srcWidth, srcX, data, offsetY, count, index } = props;
  const OFFSET_LEFT = 5;
  const CONTENT_X_START = 5;
  const CONTAINER_PADDING = 5;

  const display = data?.entries
    .map(e => e.name)
    .sort()
    .join(",");

  const rootEl = useRef(null);
  const contentEl = useRef(null);

  const [adjust, setAdjust] = useState({ x: 0, y: 0 });
  const [tooltipContentsBox, setTooltipContentsBox] = useState({ width: 0, height: 0, x: 0, y: 0 });
  let textAnchorY = srcHeight - CONTAINER_PADDING * 3;

  const tooltipContainer = useMemo(() => {
    return {
      x: tooltipContentsBox.x - CONTAINER_PADDING,
      y: tooltipContentsBox.y - CONTAINER_PADDING,
      width: tooltipContentsBox.width + CONTAINER_PADDING * 4,
      height: tooltipContentsBox.height + CONTAINER_PADDING * 3
    };
  }, [tooltipContentsBox]);

  useLayoutEffect(() => {
    const textEl = rootEl.current.getElementsByTagName("text")[0];
    setTooltipContentsBox(contentEl.current.getBBox());
  }, []);

  useLayoutEffect(() => {
    let newX = 0;
    let newY = 0;
    if (tooltipContainer.y + tooltipContainer.height > 0) {
      newY = -1 * (tooltipContainer.height - -1 * tooltipContainer.y) - 2;
    }

    if (((index / count) > 0.5) && tooltipContainer.width > srcWidth) {
      newX = -1 * (tooltipContainer.width - srcWidth + (2 * CONTAINER_PADDING));
    }

    setAdjust({ x: newX, y: newY });
  }, [tooltipContainer]);

  return (
    <g ref={rootEl} transform={`scale(1, -1) translate(${srcX + OFFSET_LEFT}, 0) translate(${adjust.x}, ${adjust.y})`}>
      <rect rx="5" {...tooltipContainer} fill="green"></rect>
      <g ref={contentEl}>
        <text style={{ fontSize: "26px" }} dominantBaseline="hanging" x={CONTENT_X_START} y={-1 * textAnchorY}>
          {display}
        </text>
        <GraphSvg x={CONTENT_X_START} y={-1 * textAnchorY + 40} width="25" />
      </g>
    </g>
  );
};

const GraphSvg = ({ ...props }) => (
  <svg preserveAspectRatio="xMinYMin" {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <path d="M396.8 352h22.4c6.4 0 12.8-6.4 12.8-12.8V108.8c0-6.4-6.4-12.8-12.8-12.8h-22.4c-6.4 0-12.8 6.4-12.8 12.8v230.4c0 6.4 6.4 12.8 12.8 12.8zm-192 0h22.4c6.4 0 12.8-6.4 12.8-12.8V140.8c0-6.4-6.4-12.8-12.8-12.8h-22.4c-6.4 0-12.8 6.4-12.8 12.8v198.4c0 6.4 6.4 12.8 12.8 12.8zm96 0h22.4c6.4 0 12.8-6.4 12.8-12.8V204.8c0-6.4-6.4-12.8-12.8-12.8h-22.4c-6.4 0-12.8 6.4-12.8 12.8v134.4c0 6.4 6.4 12.8 12.8 12.8zM496 400H48V80c0-8.84-7.16-16-16-16H16C7.16 64 0 71.16 0 80v336c0 17.67 14.33 32 32 32h464c8.84 0 16-7.16 16-16v-16c0-8.84-7.16-16-16-16zm-387.2-48h22.4c6.4 0 12.8-6.4 12.8-12.8v-70.4c0-6.4-6.4-12.8-12.8-12.8h-22.4c-6.4 0-12.8 6.4-12.8 12.8v70.4c0 6.4 6.4 12.8 12.8 12.8z" />
  </svg>
);

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
    let { data, showTooltip, hideTooltip, toggleTooltip, showTooltipImmediate } = this.props;
    let { initialWidth } = this.state;
    let colors = data.entries.map(e => e.color);

    return (
      <g onTouchStart={toggleTooltip} onMouseOver={showTooltip} onMouseMove={showTooltipImmediate} onMouseOut={hideTooltip}>
        {colors.map((color, i) => (
          <rect ref={el => (this[`el${i}`] = el)} x={initialWidth} y={0} height={0} fill={color} width={0} key={i} />
        ))}
      </g>
    );
  }
}
