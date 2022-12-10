<script lang="ts">
  import { spring } from "svelte/motion";

  // @ts-ignore
  import scaleLinear from "d3-scale/src/linear";
  // @ts-ignore
  import scaleBand from "d3-scale/src/band";
  // @ts-ignore
  import max from "d3-array/src/max";

  import Axis from "../axis/Axis.svelte";
  import RenderBarChart from "./RenderBarChart.svelte";
  import SvgTooltip from "../SvgTooltip.svelte";
  import { onMount } from "svelte";

  export let width: any;
  export let height: any;
  export let margin: any;
  export let header: any;
  export let graphData: any[];
  export let drilldown: any;
  export let chartIndex: any;

  const scrollInitial = (el: any) => {
    el && chartIndex > 0 && el.scrollIntoView({ behavior: "smooth" });
  };

  let excluding: any = {};

  $: showingData = graphData
    .filter(d => !excluding[d.groupId])
    .map(data => {
      data.childSubjects = data.entries.reduce((subjects: any, { children: theseChildren }: any) => subjects.concat(theseChildren), [] as any);
      return data;
    });

  $: adjustedWidth = Math.min(width, showingData.length * 110 + 60) - margin.left - margin.right;

  $: dataValues = showingData.map(({ count }) => count) ?? [];
  $: displayValues = showingData.map(({ display }) => display) ?? [];
  $: chartHeight = height - margin.top - margin.bottom;
  $: dataMax = max(dataValues);
  $: dataScale = scaleLinear()
    .domain([0, dataMax ?? []])
    .range([0, chartHeight]);
  $: scaleX = scaleBand().domain(displayValues).range([0, adjustedWidth]).paddingInner([0.1]).paddingOuter([0.3]).align([0.5]);

  $: excludedCount = Object.keys(excluding).filter(k => excluding[k]).length;
  let offsetYInitial = margin.bottom - height;
  $: offsetY = offsetYInitial;

  $: totalSvgWidth = adjustedWidth + margin.left + margin.right;

  let mounted = false;

  let graphTransformSpring = spring({ x: margin.left, y: offsetYInitial }, { stiffness: 0.1, damping: 0.4 });
  $: graphTransformSpring.set({ x: margin.left, y: offsetY }, { hard: !mounted });

  $: transform = `scale(1, -1) translate(${$graphTransformSpring.x}, ${$graphTransformSpring.y})`;

  let hoveredMap: any = {};
  const removeBar = (id: any) => (excluding = { ...excluding, [id]: true });
  const restoreBar = (id: any) => (excluding = { ...excluding, [id]: false });
  const hoverBar = (groupId: any) => (hoveredMap = { ...hoveredMap, [groupId]: true });
  const unHoverBar = (groupId: any) => setTimeout(() => (hoveredMap = { ...hoveredMap, [groupId]: false }), 1);

  onMount(() => {
    mounted = true;
  });
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
              {d.display}{" "}
              <a style="color: black" on:click={() => restoreBar(d.groupId)} on:keypress={() => {}}> <i class="far fa-redo" /> </a>
            </span>
          {/each}
        </span>
      {/if}
    </div>
    <svg width={totalSvgWidth} {height}>
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
        masterTransformX={margin.left}
        masterTransformY={-1 * margin.bottom}
        data={showingData}
        {scaleX}
        graphWidth={adjustedWidth}
        transform={`translate(0, ${height})`}
      />
    </svg>
  </div>
  <hr />
</div>

<style>
  svg {
    display: block;
    margin-left: auto;
    margin-right: auto;
  }
</style>
