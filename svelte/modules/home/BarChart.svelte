<script lang="ts">
  import scaleLinear from "d3-scale/src/linear";
  import scaleBand from "d3-scale/src/band";
  import max from "d3-array/src/max";

  import barCharQuery from "graphQL/home/barChart.graphql";

  import { appState } from "app/state/appState";
  import { subjectsState } from "app/state/subjectsState";
  import { query } from "micro-graphql-svelte";
  import { stackGraphData } from "./stackGraphData";
  import RenderBarChart from "./RenderBarChart.svelte";
  import SvgTooltip from "./SvgTooltip.svelte";
  import Axis from "./Axis.svelte";

  export let drilldown;
  export let subjects;
  export let header;
  export let chartIndex;
  export let maxWidth;
  export let width;
  export let height;

  $: ({ subjectHash } = $subjectsState);

  let excluding = {};

  let { publicUserId } = $appState;

  let el;

  const removeBar = id => (excluding = { ...excluding, [id]: true });
  const restoreBar = id => (excluding = { ...excluding, [id]: false });

  const subjectIds = subjects.map(s => s._id);

  const { queryState } = query(barCharQuery, { initialSearch: { subjectIds, searchChildSubjects: true, publicUserId } });

  $: graphData = stackGraphData(subjectHash, subjectIds, $queryState.data);

  $: {
    let _ = { __: $queryState.data, subjects };
    el && el.scrollIntoView({ behavior: "smooth" });
  }

  const scrollInitial = el => {
    el && el.scrollIntoView({ behavior: "smooth" });
  };

  const margin = { top: 20, right: 10, bottom: 180, left: 0 };
  $: showingDataRaw = graphData?.filter(d => !excluding[d.groupId]);

  let showingData: any[];
  $: {
    showingDataRaw?.forEach((data: any) => {
      data.childSubjects = data.entries.reduce((subjects, { children: theseChildren }) => subjects.concat(theseChildren), []);
    });
    showingData = showingDataRaw as any;
  }

  let hoveredMap = {};
  const hoverBar = groupId => (hoveredMap = { ...hoveredMap, [groupId]: true });
  const unHoverBar = groupId => setTimeout(() => (hoveredMap = { ...hoveredMap, [groupId]: false }), 1);

  $: {
    if (showingData?.length) {
      let x = showingData.length * 110 + 60;
      if (width > x) {
        width = x;
      }
    }
  }
  //$: width = Math.min(width, showingData?.length * 110 + 60);

  $: dataValues = showingData?.map(({ count }) => count) ?? [];
  $: displayValues = showingData?.map(({ display }) => display) ?? [];
  $: chartHeight = height - margin.top - margin.bottom;
  $: dataMax = max(dataValues);
  $: dataScale = scaleLinear()
    .domain([0, dataMax ?? []])
    .range([0, chartHeight]);
  $: scaleX = scaleBand().domain(displayValues).range([0, width]).paddingInner([0.1]).paddingOuter([0.3]).align([0.5]);

  $: svgStyle = "display: block; margin-left: auto; margin-right: auto;";

  $: excludedCount = Object.keys(excluding).filter(k => excluding[k]).length;
  $: offsetY = margin.bottom - height;

  $: totalSvgWidth = width;
  $: delta = maxWidth - width;
  let extraOffsetX = 0;
  $: {
    if (totalSvgWidth < maxWidth) {
      totalSvgWidth = maxWidth;
      extraOffsetX = delta / 2;
    }
  }

  $: transform = `scale(1, -1) translate(${margin.left + extraOffsetX}, ${offsetY})`;
</script>

{#if !graphData || !scaleX.bandwidth()}
  <span>Nothing {scaleX.bandwidth()}</span>
{:else if !graphData.length}
  {#if chartIndex == 0}
    <div class="alert alert-warning inline-flex" style="margin-bottom: 75px">
      It looks like there's nothing to show here. Once you add some books to your library, and add subjects to them, they'll show up here.
    </div>
  {:else}
    <div use:scrollInitial class="alert alert-warning" style="margin: 0 auto 75px auto">
      It looks like the child subjects under
      {header}
      currently have no books assigned
    </div>
  {/if}
{:else}
  <div bind:this={el}>
    <div style="height: {height}px">
      <div>
        <h4 style="display: inline">{header}</h4>
        {#if excludedCount}
          <span style="margin-left: 10px">
            Excluding:&nbsp;
            {#each graphData.filter(d => excluding[d.groupId]) as d}
              <span style="margin-left: 10px">
                {d.display}{' '}
                <a style="color: black" onClick={() => restoreBar(d.groupId)}> <i class="far fa-redo" /> </a>
              </span>
            {/each}
          </span>
        {/if}
      </div>
      <svg style={svgStyle} width={totalSvgWidth} {height}>
        <RenderBarChart {showingData} {excluding} {scaleX} {dataScale} {totalSvgWidth} {hoverBar} {unHoverBar} {transform} />
        <g data-x="x" {transform}>
          {#each showingData as d, i}
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
          masterTransform={`translate(${margin.left + extraOffsetX}, ${-1 * margin.bottom})`}
          data={showingData}
          {scaleX}
          graphWidth={width}
          scale={scaleX}
          transform={`translate(0, ${height})`}
        />
      </svg>
    </div>
    <hr />
  </div>
{/if}
