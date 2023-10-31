<script lang="ts">
  import { spring } from "svelte/motion";
  import { scaleBand, scaleLinear } from "d3-scale";
  import { max } from "d3-array";

  import VerticalAxis from "../vertical-axis/Axis.svelte";
  import Axis from "../axis/Axis.svelte";
  import Bar from "../bars/Bar.svelte";

  export let showingData: any[];
  export let drilldown: any;
  export let chartIndex: any;
  export let removeBar: (id: any) => void;

  export let hasScrolledIntoView: boolean;
  export let onInitialScroll: () => void;

  const MAX_SVG_WIDTH = 1200;
  const MAX_SVG_HEIGHT = 390;
  const height = MAX_SVG_HEIGHT;
  const maxHeightStyle = "max-h-[390px]";

  console.log({ hasScrolledIntoView });

  const scrollInitial = (el: any) => {
    if (el && chartIndex > 0 && !hasScrolledIntoView) {
      el.scrollIntoView({ behavior: "smooth" });
      onInitialScroll();
      console.log("on scroll");
    }
  };

  $: adjustedWidth = Math.min(MAX_SVG_WIDTH, showingData.length * 110 + 60);

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
  <div class="h-[500px] mx-auto mb-36" style="max-width: {MAX_SVG_WIDTH}px">
    <svg width="100%" class="{sizeClass} block mt-7 overflow-visible {maxHeightStyle}" viewBox="0 0 {$viewBoxSpring ?? 0} {MAX_SVG_HEIGHT}">
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
            noInitialAnimation={chartIndex === 0 && !rendered}
          />
        {/each}

        <VerticalAxis scale={verticalAxisScale} data={scaleY} graphHeight={height} />
        <Axis data={showingData} {scaleX} graphWidth={adjustedWidth} />
      </g>
    </svg>
  </div>
  <hr />
</div>
