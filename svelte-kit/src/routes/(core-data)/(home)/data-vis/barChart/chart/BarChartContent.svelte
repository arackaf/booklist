<script lang="ts">
  import { spring } from "svelte/motion";
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

  const MAX_SVG_WIDTH = 1200;
  const MAX_SVG_HEIGHT = 600;

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

  $: dataValues = showingData.map(({ count }) => count) ?? [];
  $: displayValues = showingData.map(({ display }) => display) ?? [];
  $: chartHeight = height - margin.top - margin.bottom;
  $: dataMax = max(dataValues);
  $: dataScale = scaleLinear()
    .domain([0, dataMax ?? []])
    .range([0, chartHeight]);
  $: scaleX = scaleBand().domain(displayValues).range([0, adjustedWidth]).paddingInner(0.1).paddingOuter(0.3).align(0.5);

  $: excludedCount = Object.keys(excluding).filter(k => excluding[k]).length;
  const offsetY = margin.bottom - height;

  const viewBoxSpring = spring(null as any, { stiffness: 0.1, damping: 0.4 });
  $: viewBoxSpring.set(adjustedWidth);

  const removeBar = (id: any) => (excluding = { ...excluding, [id]: true });
  const restoreBar = (id: any) => (excluding = { ...excluding, [id]: false });

  $: nonExcludedGroups = showingData.filter(d => !excluding[d.groupId]);

  let sizeClass = "";
  $: {
    let size = $viewBoxSpring;
    sizeClass = "leading-none ";

    if (size < 400) sizeClass += "text-base lg:text-lg";
    else if (size < 700) sizeClass += "text-base lg:text-lg";
    else if (size < 1000) sizeClass += "text-lg sm:text-base lg:text-lg";
    else sizeClass += "text-xl sm:text-lg lg:text-xs";
  }

  let rootElement: HTMLDivElement;
  $: rendered = !!rootElement;
</script>

<div use:scrollInitial bind:this={rootElement}>
  <div class="h-[600px] mx-auto" style="max-width: {MAX_SVG_WIDTH}px">
    <div>
      <h4 style="display: inline" class="text-xl font-semibold">{header}</h4>
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
    <svg width="100%" class="{sizeClass} block" style="max-height: {height}px" viewBox="0 0 {$viewBoxSpring ?? 0} {MAX_SVG_HEIGHT}">
      <g transform={`scale(1, -1) translate(0, ${offsetY})`}>
        {#each nonExcludedGroups as d, i (d.groupId)}
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
            noInitialAnimation={chartIndex === 0 && !rendered}
          />
        {/each}
      </g>

      <Axis
        masterTransformX={0}
        masterTransformY={-1 * margin.bottom}
        data={showingData}
        {scaleX}
        graphWidth={adjustedWidth}
        transform="translate(0, {height})"
      />
    </svg>
  </div>
  <hr />
</div>
