import React, { useRef, useState, useMemo, useLayoutEffect } from "react";

const SvgTooltip = props => {
  const { srcHeight, srcWidth, srcX, data, drilldown, chartIndex, childSubjects, count, index } = props;
  const OFFSET_LEFT = 10;
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
    setTooltipContentsBox(contentEl.current.getBBox());
  }, [srcX, display, srcWidth, srcHeight]);

  useLayoutEffect(() => {
    let newX = 0;
    let newY = 0;
    if (tooltipContainer.y + tooltipContainer.height > 0) {
      newY = -1 * (tooltipContainer.height - -1 * tooltipContainer.y) - 2;
    }

    if (index / count > 0.5 && tooltipContainer.width > srcWidth) {
      newX = -1 * (tooltipContainer.width - srcWidth + 2 * CONTAINER_PADDING);
    }

    setAdjust({ x: newX, y: newY });
  }, [tooltipContainer]);

  const removeBar = () => props.removeBar(props.data.groupId);

  return (
    <g ref={rootEl} transform={`scale(1, -1) translate(${srcX + OFFSET_LEFT}, 0) translate(${adjust.x}, ${adjust.y})`}>
      <rect rx="5" {...tooltipContainer} fill="black"></rect>
      <g style={{ fill: "white" }} ref={contentEl}>
        <text style={{ fontSize: "20px" }} dominantBaseline="hanging" x={CONTENT_X_START} y={-1 * textAnchorY}>
          {display}: {data.count}
        </text>
        {childSubjects.length ? (
          <g onClick={() => drilldown(chartIndex, childSubjects, display)} className="svgPointer">
            <rect x={CONTENT_X_START - 5} y={-1 * textAnchorY + 30} width="30" height="20" fill="black"></rect>
            <GraphSvg x={CONTENT_X_START} y={-1 * textAnchorY + 30} width="20" />
          </g>
        ) : null}

        <g onClick={removeBar} className="svgPointer">
          <rect x={CONTENT_X_START + 40} y={-1 * textAnchorY + 30} width="20" height="20" fill="black"></rect>

          <RemoveSvg x={CONTENT_X_START + 40} y={-1 * textAnchorY + 30} width="20" />
        </g>
      </g>
    </g>
  );
};

const GraphSvg = props => (
  <svg preserveAspectRatio="xMinYMin" {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <path d="M396.8 352h22.4c6.4 0 12.8-6.4 12.8-12.8V108.8c0-6.4-6.4-12.8-12.8-12.8h-22.4c-6.4 0-12.8 6.4-12.8 12.8v230.4c0 6.4 6.4 12.8 12.8 12.8zm-192 0h22.4c6.4 0 12.8-6.4 12.8-12.8V140.8c0-6.4-6.4-12.8-12.8-12.8h-22.4c-6.4 0-12.8 6.4-12.8 12.8v198.4c0 6.4 6.4 12.8 12.8 12.8zm96 0h22.4c6.4 0 12.8-6.4 12.8-12.8V204.8c0-6.4-6.4-12.8-12.8-12.8h-22.4c-6.4 0-12.8 6.4-12.8 12.8v134.4c0 6.4 6.4 12.8 12.8 12.8zM496 400H48V80c0-8.84-7.16-16-16-16H16C7.16 64 0 71.16 0 80v336c0 17.67 14.33 32 32 32h464c8.84 0 16-7.16 16-16v-16c0-8.84-7.16-16-16-16zm-387.2-48h22.4c6.4 0 12.8-6.4 12.8-12.8v-70.4c0-6.4-6.4-12.8-12.8-12.8h-22.4c-6.4 0-12.8 6.4-12.8 12.8v70.4c0 6.4 6.4 12.8 12.8 12.8z" />
  </svg>
);

const RemoveSvg = props => (
  <svg preserveAspectRatio="xMinYMin" {...props} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <path d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 448c-110.5 0-200-89.5-200-200S145.5 56 256 56s200 89.5 200 200-89.5 200-200 200zm101.8-262.2L295.6 256l62.2 62.2c4.7 4.7 4.7 12.3 0 17l-22.6 22.6c-4.7 4.7-12.3 4.7-17 0L256 295.6l-62.2 62.2c-4.7 4.7-12.3 4.7-17 0l-22.6-22.6c-4.7-4.7-4.7-12.3 0-17l62.2-62.2-62.2-62.2c-4.7-4.7-4.7-12.3 0-17l22.6-22.6c4.7-4.7 12.3-4.7 17 0l62.2 62.2 62.2-62.2c4.7-4.7 12.3-4.7 17 0l22.6 22.6c4.7 4.7 4.7 12.3 0 17z" />
  </svg>
);

export default SvgTooltip;
