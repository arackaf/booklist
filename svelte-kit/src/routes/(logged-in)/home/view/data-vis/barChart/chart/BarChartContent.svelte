<script lang="ts">
  import { spring } from "svelte/motion";

  import { scaleLinear } from "d3-scale";
  import { scaleBand } from "d3-scale";
  import { max } from "d3-array";

  import Axis from "../axis/Axis.svelte";
  import { onMount } from "svelte";
  import Bar from "../bars/Bar.svelte";

  export let width: any;
  export let height: any;
  export let margin: any;
  export let header: any;
  export let graphData: any[];
  export let drilldown: any;
  export let chartIndex: any;

  onMount(() => {
    mounted = true;
  });

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
  $: scaleX = scaleBand().domain(displayValues).range([0, adjustedWidth]).paddingInner(0.1).paddingOuter(0.3).align(0.5);

  $: excludedCount = Object.keys(excluding).filter(k => excluding[k]).length;
  let offsetYInitial = margin.bottom - height;
  $: offsetY = offsetYInitial;

  $: totalSvgWidth = adjustedWidth + margin.left + margin.right;

  let mounted = false;

  let graphTransformSpring = spring({ x: margin.left, y: offsetYInitial }, { stiffness: 0.1, damping: 0.4 });
  $: graphTransformSpring.set({ x: margin.left, y: offsetY }, { hard: !mounted });

  $: transform = `scale(1, -1) translate(${$graphTransformSpring.x}, ${$graphTransformSpring.y})`;

  const removeBar = (id: any) => (excluding = { ...excluding, [id]: true });
  const restoreBar = (id: any) => (excluding = { ...excluding, [id]: false });

  $: nonExcludedGroups = showingData.filter(d => !excluding[d.groupId]);
</script>

<div use:scrollInitial>
  <div style="height: {height}px">
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
    <svg width={totalSvgWidth} {height}>
      <g {transform}>
        {#each nonExcludedGroups as d, i (d)}
          <Bar
            barCount={nonExcludedGroups.length}
            data={d}
            x={scaleX(d.display)}
            width={scaleX.bandwidth()}
            index={i}
            height={dataScale(d.count)}
            {totalSvgWidth}
            {drilldown}
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
