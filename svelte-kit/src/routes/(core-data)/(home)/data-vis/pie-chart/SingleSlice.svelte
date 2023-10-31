<script lang="ts">
  import { arc } from "d3-shape";

  import { tooltip } from "../bar-chart/tooltip";
  import SlicePath from "./SlicePath.svelte";
  import { spring } from "svelte/motion";

  export let segment: any;
  export let noInitialAnimation: boolean;
  export let labelsReady: boolean;
  export let onLabelsReady: () => void;
  export let removeSlice: (id: any) => void;
  export let radius: number;
  export let drilldown: any;

  const INFLEXION_PADDING = 50; // space between donut and label inflexion point
  const arcGenerator = arc();

  let mainArc: SVGElement;

  const PI = 3.141592653;
  $: startAngle = segment.startAngle * (180 / PI);
  $: endAngle = segment.endAngle * (180 / PI);

  $: midPoint = startAngle + (endAngle - startAngle) / 2;

  const getCentroid = (startAngle: number, endAngle: number) => {
    return arcGenerator.centroid({
      innerRadius: 0,
      outerRadius: radius,
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

  $: tooltipAnchor = arcGenerator.centroid({
    startAngle: segment.startAngle,
    endAngle: segment.endAngle,
    innerRadius: radius,
    outerRadius: radius - 2
  });

  const inflexionInfo = getInflextionInfo(segment.startAngle, segment.endAngle);
  const inflexionPoint = arcGenerator.centroid(inflexionInfo);

  let isRightLabel = inflexionPoint[0] > 0;
  let labelPosX = inflexionPoint[0] + 50 * (isRightLabel ? 1 : -1);
  let textAnchor = isRightLabel ? "start" : "end";

  const centroid = getCentroid(segment.startAngle, segment.endAngle);

  const springConfig = { stiffness: 0.1, damping: 0.7 };

  const initialLabelValues = {
    centroidX: centroid[0],
    centroidY: centroid[1],
    inflexionPointX: inflexionPoint[0],
    inflexionPointY: inflexionPoint[1],
    labelPosX
  };
  const sliceSpring = spring(initialLabelValues, springConfig);

  $: {
    const newCentroid = getCentroid(segment.startAngle, segment.endAngle);
    const newInflexionInfo = getInflextionInfo(segment.startAngle, segment.endAngle);
    const newInflexionPoint = arcGenerator.centroid(newInflexionInfo);

    isRightLabel = newInflexionPoint[0] > 0;
    labelPosX = newInflexionPoint[0] + 50 * (isRightLabel ? 1 : -1);
    textAnchor = isRightLabel ? "start" : "end";

    sliceSpring.set({
      centroidX: newCentroid[0],
      centroidY: newCentroid[1],
      inflexionPointX: newInflexionPoint[0],
      inflexionPointY: newInflexionPoint[1],
      labelPosX
    });
  }
</script>

<g bind:this={mainArc}>
  {#each segment.chunks as chunk, i}
    <SlicePath initialAnimationDone={onLabelsReady} segmentChunk={chunk} {noInitialAnimation} />
  {/each}
  {#if labelsReady}
    <circle cx={$sliceSpring.centroidX} cy={$sliceSpring.centroidY} r={2} />
  {/if}
</g>
{#if labelsReady}
  {#if mainArc}
    <circle
      style="visibility: hidden"
      use:tooltip={{
        position: midPoint < 180 ? "right" : "left",
        data: segment.data,
        hoverTarget: mainArc,
        drilldown,
        remove: removeSlice
      }}
      cx={tooltipAnchor[0]}
      cy={tooltipAnchor[1]}
      r={1}
    />
  {/if}
  <line
    x1={$sliceSpring.centroidX}
    y1={$sliceSpring.centroidY}
    x2={$sliceSpring.inflexionPointX}
    y2={$sliceSpring.inflexionPointY}
    stroke={"black"}
    fill={"black"}
  />
  <line
    x1={$sliceSpring.inflexionPointX}
    y1={$sliceSpring.inflexionPointY}
    x2={$sliceSpring.labelPosX}
    y2={$sliceSpring.inflexionPointY}
    stroke={"black"}
    fill={"black"}
  />
  <text
    x={$sliceSpring.labelPosX + (isRightLabel ? 2 : -2)}
    y={$sliceSpring.inflexionPointY}
    text-anchor={textAnchor}
    dominant-baseline="middle"
    font-size={14}
  >
    {segment.masterLabel}
  </text>
{/if}
