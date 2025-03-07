<script lang="ts">
  import { onMount, setContext, onDestroy } from "svelte";
  import { arc, pie } from "d3-shape";

  import SingleSlice from "./SingleSlice.svelte";
  import { syncWidth } from "$lib/util/animationHelpers.svelte";
  import SingleSliceLabel from "./SingleSliceLabel.svelte";
  import { createTooltipState } from "../tooltip/tooltipState.svelte";
  import Tooltip from "../tooltip/Tooltip.svelte";

  type Props = {
    showingData: any[];
    drilldown: any;
    removeSlice: (id: any) => void;
    hasRendered: boolean;
  };

  let { showingData, drilldown, removeSlice, hasRendered }: Props = $props();

  let pieChartHasRendered = $state(false);

  onMount(() => {
    pieChartHasRendered = true;
  });

  const diameter = 500;
  const width = diameter;
  const height = diameter;
  const margin = 0;
  const radius = diameter / 2 - margin;

  const pieGenerator = pie().value((d: any) => d.count);

  let pieData = $derived(pieGenerator(showingData) as any[]);

  const arcGenerator = arc();
  const INFLEXION_PADDING = 15; // space between donut and label inflexion point

  const getCentroid = (startAngle: number, endAngle: number, innerRadius: number = 0) => {
    return arcGenerator.centroid({
      innerRadius,
      outerRadius: radius,
      startAngle: startAngle,
      endAngle: endAngle
    });
  };
  const transitionOffset = 50;
  const getTransitionPoint = (startAngle: number, endAngle: number) => {
    return arcGenerator.centroid({
      innerRadius: radius + transitionOffset,
      outerRadius: radius + transitionOffset,
      startAngle: startAngle,
      endAngle: endAngle
    });
  };
  const getInflextionInfo = (startAngle: number, endAngle: number) => {
    return {
      innerRadius: radius + INFLEXION_PADDING,
      outerRadius: radius + INFLEXION_PADDING,
      startAngle: startAngle,
      endAngle: endAngle
    };
  };

  let pieSegments = $derived.by(() => {
    return pieData.map(segment => {
      const segmentCount = segment.data.entries.length;

      const masterLabel = segment.data.entries.map((e: any) => e.name).join(", ") + " (" + segment.value + ")";

      const centroid = getCentroid(segment.startAngle, segment.endAngle);
      const centroidTransition = getTransitionPoint(segment.startAngle, segment.endAngle);
      const inflexionInfo = getInflextionInfo(segment.startAngle, segment.endAngle);
      const inflexionPoint = arcGenerator.centroid(inflexionInfo);

      const arcCenterPoint = getCentroid(segment.startAngle, segment.endAngle, radius);

      const isRightLabel = inflexionPoint[0] > 0;
      const labelPosX = inflexionPoint[0] + 25 * (isRightLabel ? 1 : -1);
      const textAnchor = isRightLabel ? "start" : "end";

      return {
        startAngle: segment.startAngle,
        endAngle: segment.endAngle,
        data: segment.data,
        centroid,
        centroidTransition,
        inflexionPoint,
        arcCenterPoint,
        labelPosX,
        isRightLabel,
        textAnchor,
        masterLabel,
        count: segmentCount,
        chunks: segment.data.entries.map((entry: any, idx: number) => {
          const arcSectionRadius = radius * ((segmentCount - idx) / segmentCount);

          return {
            color: entry.color,
            innerRadius: 0,
            outerRadius: arcSectionRadius,
            startAngle: segment.startAngle,
            endAngle: segment.endAngle
          };
        })
      };
    });
  });

  let hideLabels = $state(false);

  $effect(() => {
    hideLabels = hasOverlap(pieSegments);
  });

  function hasOverlap(pieSegments: any[]): boolean {
    const leftSegments = pieSegments.filter(seg => !seg.isRightLabel);
    const rightSegments = pieSegments.filter(seg => seg.isRightLabel);

    for (const seg of leftSegments) {
      const segHasOverlaps = leftSegments.find(segInner => {
        return seg.masterLabel !== segInner.masterLabel && Math.abs(seg.inflexionPoint[1] - segInner.inflexionPoint[1]) < 17;
      });
      if (segHasOverlaps) {
        return true;
      }
    }

    for (const seg of rightSegments) {
      const segHasOverlaps = rightSegments.find(segInner => {
        return seg.masterLabel !== segInner.masterLabel && Math.abs(seg.inflexionPoint[1] - segInner.inflexionPoint[1]) < 17;
      });
      if (segHasOverlaps) {
        return true;
      }
    }

    return false;
  }

  let chartHasRendered = $state(false);

  onMount(() => {
    chartHasRendered = true;
  });

  let labelsReady = $state(hasRendered);
  const onLabelsReady = () => {
    setTimeout(() => {
      labelsReady = true;
    }, 200);
  };

  let containerDiv = $state<HTMLElement>(null as any);
  let containerWidthValue = $state<ReturnType<typeof syncWidth>>();

  onMount(() => {
    containerWidthValue = syncWidth(containerDiv);
  });

  let containerSize = $derived.by(() => {
    const width = containerWidthValue?.width.value ?? 0;
    return width <= 0 ? ("UNKNOWN" as const) : width < 1000 ? ("SMALL" as const) : ("NORMAL" as const);
  });

  const tooltipManager = createTooltipState();
  setContext("tooltip-state", tooltipManager);

  onDestroy(() => {
    tooltipManager.destroy();
  });
</script>

<div bind:this={containerDiv} class="flex items-center mx-16">
  <div class="max-w-[500px] flex-1 mx-auto">
    <Tooltip
      shown={tooltipManager.shownState.value}
      payload={tooltipManager.currentState.payload}
      x={tooltipManager.currentState.x}
      y={tooltipManager.currentState.y}
    />
    <svg viewBox="0 0 500 500" class="overflow-visible inline-block w-full">
      <g transform={`translate(${width / 2}, ${height / 2})`}>
        {#each pieSegments as seg (seg.data.groupId)}
          <SingleSliceLabel labelsReady={!hideLabels && (labelsReady || hasRendered)} segment={seg} />
        {/each}
        {#each pieSegments as seg (seg.data.groupId)}
          <SingleSlice
            {chartHasRendered}
            {containerSize}
            {removeSlice}
            {onLabelsReady}
            segment={seg}
            {drilldown}
            noInitialAnimation={!pieChartHasRendered}
            disableAnimation={pieSegments.length === 1}
          />
        {/each}
      </g>
    </svg>
  </div>
</div>
