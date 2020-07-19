import React, { PureComponent, useLayoutEffect, useRef, useState } from "react";
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
    let { x, data, height, width, graphWidth, offsetY } = this.props;

    return data.entries.length == 1 ? (
      <SingleBar
        showTooltip={this.showTooltip}
        showTooltipImmediate={this.showTooltipImmediate}
        hideTooltip={this.hideTooltip}
        toggleTooltip={this._toggleTooltip}
        ref={el => (this.el = el)}
        color={data.entries[0].color}
        children={data.entries[0].children}
        {...{ data, height, width, x, graphWidth, offsetY }}
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
    let { x, height, width, color, data, showTooltip, hideTooltip, toggleTooltip, showTooltipImmediate, offsetY } = this.props;
    let { initialWidth } = this.state;

    return (
      <>
        <g>
          <rect
            onTouchStart={toggleTooltip}
            onMouseMove={showTooltipImmediate}
            onMouseOver={showTooltip}
            onMouseOut={hideTooltip}
            ref={el => (this.el = el)}
            x={initialWidth}
            y={0}
            height={0}
            width={0}
            fill={color}
          />
        </g>
        <SvgTooltip data={data} srcHeight={height} srcWidth={width} srcX={x} offsetY={offsetY} />
      </>
    );
  }
}

const SvgTooltip = props => {
  const { srcHeight, srcWidth, srcX, data, offsetY } = props;
  const OFFSET_LEFT = 5;
  const TEXT_OFFSET = 5;

  const display = data?.entries
    .map(e => e.name)
    .sort()
    .join(",");

  const rootEl = useRef(null);

  const [textOffset, setTextOffset] = useState(0);
  let textAnchorY = srcHeight - textOffset - 30;

  if (textOffset > 0 && textAnchorY < textOffset) {
    textAnchorY = textOffset;
  }

  useLayoutEffect(() => {
    const textEl = rootEl.current.getElementsByTagName("text")[0];
    const box = textEl.getBBox();
    setTextOffset(textEl.getElementsByTagName("tspan")?.[1]?.getBBox()?.height ?? 0);
  }, []);

  return (
    <>
      <g ref={rootEl} transform={`scale(1, -1) translate(${srcX + OFFSET_LEFT}, 0)`}>
        <text style={{ fontSize: "26px" }} x={TEXT_OFFSET} y={-1 * textAnchorY}>
          {display}
        </text>
        <GraphSvg />
      </g>
    </>
  );
};

const GraphSvg = () => (
  <svg preserveAspectRatio="xMinYMin" xmlns="http://www.w3.org/2000/svg" x="5" y="-370" viewBox="0 0 640 512" width="40">
    <path d="M208 288h-32c-4.42 0-8 3.58-8 8v208c0 4.42 3.58 8 8 8h32c4.42 0 8-3.58 8-8V296c0-4.42-3.58-8-8-8zM80 384H48c-4.42 0-8 3.58-8 8v112c0 4.42 3.58 8 8 8h32c4.42 0 8-3.58 8-8V392c0-4.42-3.58-8-8-8zm256-192h-32c-4.42 0-8 3.58-8 8v304c0 4.42 3.58 8 8 8h32c4.42 0 8-3.58 8-8V200c0-4.42-3.58-8-8-8z" />
  </svg>
);

const GraphSvg2 = () => (
  <g transform="translate(200 200)">
    <path d="M208 288h-32c-4.42 0-8 3.58-8 8v208c0 4.42 3.58 8 8 8h32c4.42 0 8-3.58 8-8V296c0-4.42-3.58-8-8-8zM80 384H48c-4.42 0-8 3.58-8 8v112c0 4.42 3.58 8 8 8h32c4.42 0 8-3.58 8-8V392c0-4.42-3.58-8-8-8zm256-192h-32c-4.42 0-8 3.58-8 8v304c0 4.42 3.58 8 8 8h32c4.42 0 8-3.58 8-8V200c0-4.42-3.58-8-8-8z" />
  </g>
);

const GraphSvg3 = () => (
  <path d="M208 288h-32c-4.42 0-8 3.58-8 8v208c0 4.42 3.58 8 8 8h32c4.42 0 8-3.58 8-8V296c0-4.42-3.58-8-8-8zM80 384H48c-4.42 0-8 3.58-8 8v112c0 4.42 3.58 8 8 8h32c4.42 0 8-3.58 8-8V392c0-4.42-3.58-8-8-8zm256-192h-32c-4.42 0-8 3.58-8 8v304c0 4.42 3.58 8 8 8h32c4.42 0 8-3.58 8-8V200c0-4.42-3.58-8-8-8z" />
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
