<script lang="ts">
  import { arc, pie } from "d3-shape";
  import SingleSlice from "./SingleSlice.svelte";

  export let showingData: any[];
  export let drilldown: any;
  export let chartIndex: any;
  export let removeSlice: (id: any) => void;

  export let hasRendered: boolean;
  let pieChartHasRendered = false;

  export let onInitialRender: () => void;

  const noInitialAnimation = chartIndex === 0;

  const scrollInitial = (el: any) => {
    if (el && chartIndex > 0 && !hasRendered) {
      el.scrollIntoView({ behavior: "smooth" });
    }
    onInitialRender();
    pieChartHasRendered = true;
  };

  const diameter = 500;
  const width = diameter;
  const height = diameter;
  const margin = 0;
  const radius = diameter / 2 - margin;

  const pieGenerator = pie().value((d: any) => d.count);

  $: pieData = pieGenerator(showingData) as any[];

  const arcGenerator = arc();
  const INFLEXION_PADDING = 50; // space between donut and label inflexion point

  const getCentroid = (startAngle: number, endAngle: number) => {
    return arcGenerator.centroid({
      innerRadius: 0,
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

  $: pieSegments = pieData.map(segment => {
    const segmentCount = segment.data.entries.length;

    const masterLabel = segment.data.entries.map((e: any) => e.name).join(", ") + " (" + segment.value + ")";

    const centroid = getCentroid(segment.startAngle, segment.endAngle);
    const centroidTransition = getTransitionPoint(segment.startAngle, segment.endAngle);
    const inflexionInfo = getInflextionInfo(segment.startAngle, segment.endAngle);
    const inflexionPoint = arcGenerator.centroid(inflexionInfo);

    const isRightLabel = inflexionPoint[0] > 0;
    const labelPosX = inflexionPoint[0] + 50 * (isRightLabel ? 1 : -1);
    const textAnchor = isRightLabel ? "start" : "end";

    return {
      startAngle: segment.startAngle,
      endAngle: segment.endAngle,
      data: segment.data,
      centroid,
      centroidTransition,
      inflexionPoint,
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
  }) as any[];

  let hideLabels = false;
  $: {
    const leftSegments = pieSegments.filter(seg => !seg.isRightLabel);
    const rightSegments = pieSegments.filter(seg => seg.isRightLabel);

    let overlapFound = false;
    for (const seg of leftSegments) {
      const segHasOverlaps = leftSegments.find(segInner => {
        return seg.masterLabel !== segInner.masterLabel && Math.abs(seg.inflexionPoint[1] - segInner.inflexionPoint[1]) < 17;
      });
      if (segHasOverlaps) {
        overlapFound = true;
        break;
      }
    }

    if (overlapFound) {
      hideLabels = true;
    } else {
      for (const seg of rightSegments) {
        const segHasOverlaps = rightSegments.find(segInner => {
          return seg.masterLabel !== segInner.masterLabel && Math.abs(seg.inflexionPoint[1] - segInner.inflexionPoint[1]) < 17;
        });
        if (segHasOverlaps) {
          overlapFound = true;
          break;
        }
      }
    }

    hideLabels = overlapFound;
  }

  let labelsReady = noInitialAnimation;
  const onLabelsReady = () => {
    setTimeout(() => {
      labelsReady = true;
    }, 200);
  };
</script>

<div use:scrollInitial class="flex py-24">
  <svg {width} {height} style="display: inline-block; overflow: visible; margin-left: auto; margin-right: auto;">
    <g transform={`translate(${width / 2}, ${height / 2})`}>
      {#each pieSegments as seg (seg.data.groupId)}
        <SingleSlice
          {radius}
          {removeSlice}
          {labelsReady}
          {onLabelsReady}
          segment={seg}
          {drilldown}
          {hideLabels}
          noInitialAnimation={(chartIndex === 0 || hasRendered) && !pieChartHasRendered}
          segmentCount={pieSegments.length}
        />
      {/each}
    </g>
  </svg>
</div>
