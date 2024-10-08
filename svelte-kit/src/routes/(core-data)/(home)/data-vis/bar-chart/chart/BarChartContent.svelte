<script lang="ts">
  import { spring } from "svelte/motion";
  import { scaleBand, scaleLinear } from "d3-scale";
  import { max } from "d3-array";

  import VerticalAxis from "../vertical-axis/Axis.svelte";
  import Axis from "../axis/Axis.svelte";
  import Bar from "../bars/Bar.svelte";
  import { onMount, setContext } from "svelte";
  import Tooltip from "../../tooltip/Tooltip.svelte";
  import { createTooltipState } from "../../tooltip/tooltipState";
  import LinearGradient from "./LinearGradient.svelte";

  export let showingData: any[];
  export let drilldown: any;
  export let removeBar: (id: any) => void;

  let colorGradients = [] as any[];
  let colorGradientsSetUp = false;

  $: {
    if (!colorGradientsSetUp) {
      colorGradients = showingData
        .filter(e => e.entries.length > 1)
        .map(e => {
          return {
            id: e.groupId.replace(/,/g, "-"),
            colors: e.entries.map(entry => entry.color)
          };
        });
    }
  }

  let barChartHasRendered = false;
  onMount(() => {
    barChartHasRendered = true;
  });

  const MAX_SVG_WIDTH = 1200;
  const MAX_SVG_HEIGHT = 390;
  const height = MAX_SVG_HEIGHT;
  const maxHeightStyle = "max-h-[390px]";

  $: adjustedWidth = Math.min(MAX_SVG_WIDTH, showingData.length * 70 + 60);

  $: dataValues = showingData.map(({ count }) => count) ?? [];
  $: displayValues = showingData.map(({ display }) => display) ?? [];
  $: dataMax = max(dataValues);
  $: dataScale = scaleLinear()
    .domain([0, dataMax ?? []])
    .range([0, height]);

  $: verticalAxisScale = scaleLinear()
    .domain([0, dataMax ?? []])
    .range([0, height])
    .nice();

  $: scaleX = scaleBand().domain(displayValues).range([50, adjustedWidth]).paddingInner(0.1).paddingOuter(0.3).align(0.5);
  $: scaleY = verticalAxisScale.ticks(Math.min(10, dataMax));

  const viewBoxSpring = spring(null as any, { stiffness: 0.1, damping: 0.4 });
  $: viewBoxSpring.set(adjustedWidth);

  let sizeClass = "";
  $: {
    let size = $viewBoxSpring;
    console.log({ size });
    sizeClass = "leading-none ";

    if (size < 400) sizeClass += "text-sm";
    else if (size < 700) sizeClass += "text-base sm:text-sm";
    else if (size < 1000) sizeClass += "text-lg sm:text-base md:text-sm";
    else sizeClass += "text-xl sm:text-base lg:text-xs";
  }

  const tooltipManager = createTooltipState();
  setContext("tooltip-state", tooltipManager);
  $: ({ currentState } = tooltipManager);
</script>

<div>
  <div class="h-[500px] mx-auto mb-36" style="max-width: {MAX_SVG_WIDTH}px">
    <Tooltip shown={$currentState.shown} payload={$currentState.payload} x={$currentState.x} y={$currentState.y} />

    <svg width="100%" class="{sizeClass} block mt-7 overflow-visible {maxHeightStyle}" viewBox="0 0 {$viewBoxSpring ?? 0} {MAX_SVG_HEIGHT}">
      <defs>
        {#each colorGradients as gradient}
          <LinearGradient id={gradient.id} colors={gradient.colors} />
        {/each}
      </defs>
      <g transform={`scale(1, -1) translate(0, ${-1 * height})`}>
        {#each showingData as d, i (d.groupId)}
          <Bar
            barCount={showingData.length}
            data={d}
            x={scaleX(d.display)}
            width={scaleX.bandwidth()}
            index={i}
            height={dataScale(d.count)}
            totalSvgWidth={adjustedWidth}
            drilldown={(...args) => drilldown(...args, "BAR")}
            {removeBar}
            noInitialAnimation={!barChartHasRendered}
          />
        {/each}

        <VerticalAxis scale={verticalAxisScale} data={scaleY} graphHeight={height} />
        <Axis data={showingData} {scaleX} graphWidth={adjustedWidth} />
      </g>
    </svg>
  </div>
  <hr />
</div>
