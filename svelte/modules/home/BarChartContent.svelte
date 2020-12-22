<script lang="ts">
  import { spring } from "svelte/motion";
  import { fade } from "svelte/transition";
  import { quadOut } from "svelte/easing";

  import scaleLinear from "d3-scale/src/linear";
  import scaleBand from "d3-scale/src/band";
  import max from "d3-array/src/max";

  import { makeContentTransition } from "app/animationHelpers";
  import Axis from "./Axis.svelte";
  import RenderBarChart from "./RenderBarChart.svelte";
  import SvgTooltip from "./SvgTooltip.svelte";

  const scrollInitial = el => {
    el && el.scrollIntoView({ behavior: "smooth" });
  };

  export let width;
  export let height;
  export let margin;
  export let maxWidth;
  export let header;
  export let graphData: any[];
  export let drilldown;
  export let chartIndex;

  let excluding: any = {};

  $: showingData = graphData
    .filter(d => !excluding[d.groupId])
    .map(data => {
      data.childSubjects = data.entries.reduce((subjects, { children: theseChildren }) => subjects.concat(theseChildren), []);
      return data;
    });

  $: adjustedWidth = Math.min(width, showingData?.length * 110 + 60);

  $: dataValues = showingData.map(({ count }) => count) ?? [];
  $: displayValues = showingData.map(({ display }) => display) ?? [];
  $: chartHeight = height - margin.top - margin.bottom;
  $: dataMax = max(dataValues);
  $: dataScale = scaleLinear()
    .domain([0, dataMax ?? []])
    .range([0, chartHeight]);
  $: scaleX = scaleBand().domain(displayValues).range([0, adjustedWidth]).paddingInner([0.1]).paddingOuter([0.3]).align([0.5]);

  $: svgStyle = "display: block; margin-left: auto; margin-right: auto;";

  $: excludedCount = Object.keys(excluding).filter(k => excluding[k]).length;
  let offsetYInitial = margin.bottom - height;
  $: offsetY = offsetYInitial;

  $: totalSvgWidth = adjustedWidth;
  $: delta = maxWidth - adjustedWidth;
  let extraOffsetX = 0;
  $: {
    if (totalSvgWidth < maxWidth) {
      totalSvgWidth = maxWidth;
      extraOffsetX = delta / 2;
    }
  }

  let graphTransformSpring = spring({ x: margin.left + extraOffsetX, y: offsetYInitial }, { stiffness: 0.1, damping: 0.4 });
  $: graphTransformSpring.set({ x: margin.left + extraOffsetX, y: offsetY });

  $: transform = `scale(1, -1) translate(${$graphTransformSpring.x}, ${$graphTransformSpring.y})`;

  const contentTransition = makeContentTransition();

  let hoveredMap = {};
  const removeBar = id => (excluding = { ...excluding, [id]: true });
  const restoreBar = id => (excluding = { ...excluding, [id]: false });
  const hoverBar = groupId => (hoveredMap = { ...hoveredMap, [groupId]: true });
  const unHoverBar = groupId => setTimeout(() => (hoveredMap = { ...hoveredMap, [groupId]: false }), 1);
</script>

<div use:scrollInitial>
  <div style="height: {height}px">
    <div>
      <h4 style="display: inline">{header}</h4>
      {#if excludedCount}
        <span style="margin-left: 10px">
          Excluding:&nbsp;
          {#each graphData.filter(d => excluding[d.groupId]) as d}
            <span style="margin-left: 10px">
              {d.display}{' '}
              <a style="color: black" on:click={() => restoreBar(d.groupId)}> <i class="far fa-redo" /> </a>
            </span>
          {/each}
        </span>
      {/if}
    </div>
    <svg transition:fade={contentTransition({ duration: 200, easing: quadOut })} style={svgStyle} width={totalSvgWidth} {height}>
      <RenderBarChart {showingData} {excluding} {scaleX} {dataScale} {totalSvgWidth} {hoverBar} {unHoverBar} {transform} />
      <g {transform}>
        {#each showingData.filter(d => !excluding[d.groupId]) as d, i (d.groupId)}
          <SvgTooltip
            data={d}
            srcHeight={dataScale(d.count)}
            srcWidth={scaleX.bandwidth()}
            srcX={scaleX(d.display)}
            count={showingData.length}
            index={i}
            childSubjects={d.childSubjects}
            hovered={hoveredMap[d.groupId]}
            {drilldown}
            {chartIndex}
            {removeBar}
          />
        {/each}
      </g>
      <Axis
        masterTransformX={margin.left + extraOffsetX}
        masterTransformY={-1 * margin.bottom}
        masterTransform={`translate(${margin.left + extraOffsetX}, ${-1 * margin.bottom})`}
        data={showingData}
        {scaleX}
        graphWidth={adjustedWidth}
        scale={scaleX}
        transform={`translate(0, ${height})`}
      />
    </svg>
  </div>
  <hr />
</div>
