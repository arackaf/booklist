<script lang="ts">
  import { spring } from "svelte/motion";
  import { writable } from "svelte/store";
  import { scaleLinear } from "d3-scale";
  import { scaleBand } from "d3-scale";
  import { max } from "d3-array";

  import Axis from "../axis/Axis.svelte";
  import Bar from "../bars/Bar.svelte";

  export let height: any;
  export let margin: { top: number; bottom: number };
  export let header: any;
  export let graphData: any[];
  export let drilldown: any;
  export let chartIndex: any;

  const MAX_SVG_WIDTH = 600;

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

  $: adjustedWidth = Math.min(MAX_SVG_WIDTH, showingData.length * 110 + 60);

  const initialChartWidth = writable(0);
  $: {
    let currentAdjustedWidth = adjustedWidth;
    initialChartWidth.update(current => (current ? current : currentAdjustedWidth));
  }

  $: leftOffsetAdjust = (MAX_SVG_WIDTH - adjustedWidth) / 2;

  $: dataValues = showingData.map(({ count }) => count) ?? [];
  $: displayValues = showingData.map(({ display }) => display) ?? [];
  $: chartHeight = height - margin.top - margin.bottom;
  $: dataMax = max(dataValues);
  $: dataScale = scaleLinear()
    .domain([0, dataMax ?? []])
    .range([0, chartHeight]);
  $: scaleX = scaleBand().domain(displayValues).range([0, adjustedWidth]).paddingInner(0.1).paddingOuter(0.3).align(0.5);

  $: excludedCount = Object.keys(excluding).filter(k => excluding[k]).length;
  let offsetYInitial = margin.bottom - height;
  $: offsetY = offsetYInitial;

  $: graphTransform = { x: 0, y: offsetY };

  let initialGraphTransformSet = false;
  const graphTransformSpring = spring({ leftOffsetAdjust: isNaN(leftOffsetAdjust) ? -10 : 0 }, { stiffness: 0.1, damping: 0.4 });
  $: {
    graphTransformSpring.set({ leftOffsetAdjust }, { hard: !initialGraphTransformSet });
    if (!isNaN(leftOffsetAdjust)) {
      initialGraphTransformSet = true;
    }
  }

  $: transform = `scale(1, -1) translate(${$graphTransformSpring.leftOffsetAdjust + graphTransform.x}, ${graphTransform.y})`;

  const removeBar = (id: any) => (excluding = { ...excluding, [id]: true });
  const restoreBar = (id: any) => (excluding = { ...excluding, [id]: false });

  $: nonExcludedGroups = showingData.filter(d => !excluding[d.groupId]);
</script>

<div use:scrollInitial>
  <div class="chart-container">
    <div>
      <h4 style="display: inline">{header}</h4>
      {#if excludedCount}
        <span style="margin-left: 10px">
          Excluding:
          {#each graphData.filter(d => excluding[d.groupId]) as d}
            <span style="margin-left: 10px">
              {" " + d.display}
              <button class="raw-button" style="color: black" on:click={() => restoreBar(d.groupId)}>
                <i class="far fa-redo" />
              </button>
            </span>
          {/each}
        </span>
      {/if}
    </div>
    <svg width="100%" {height} viewBox="0 0 {$initialChartWidth} {MAX_SVG_WIDTH}">
      <g {transform}>
        {#each nonExcludedGroups as d, i (d)}
          <Bar
            barCount={nonExcludedGroups.length}
            data={d}
            x={scaleX(d.display)}
            width={scaleX.bandwidth()}
            index={i}
            height={dataScale(d.count)}
            totalSvgWidth={adjustedWidth}
            {drilldown}
            {removeBar}
            noInitialAnimation={chartIndex === 0}
          />
        {/each}
      </g>

      <Axis
        masterTransformX={0}
        masterTransformY={-1 * margin.bottom}
        data={showingData}
        {scaleX}
        graphWidth={adjustedWidth}
        transform="translate({$graphTransformSpring.leftOffsetAdjust}, {height})"
      />
    </svg>
  </div>
  <hr />
</div>

<style>
  .chart-container {
    height: 600px;
    max-width: 600px;
    margin-right: auto;
    margin-left: auto;
  }

  svg {
    display: block;
  }
</style>
