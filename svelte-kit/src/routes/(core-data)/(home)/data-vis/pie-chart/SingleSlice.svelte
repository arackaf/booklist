<script lang="ts">
  import { arc } from "d3-shape";

  import { tooltip } from "../bar-chart/tooltip";
  import SlicePath from "./SlicePath.svelte";
  import { spring } from "svelte/motion";
  export let segment: any;
  export let animate: boolean;
  export let labelsReady: boolean;
  export let onLabelsReady: () => void;
  export let removeSlice: (id: any) => void;
  export let radius: number;

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

  const centroid = getCentroid(segment.startAngle, segment.endAngle);

  const springConfig = { stiffness: 0.1, damping: 0.7 };

  const initialLabelValues = { centroidX: centroid[0], centroidY: centroid[1] };
  const sliceSpring = spring(initialLabelValues, springConfig);

  $: {
    const newCentroid = getCentroid(segment.startAngle, segment.endAngle);
    sliceSpring.set({ centroidX: newCentroid[0], centroidY: newCentroid[1] });
  }
</script>

<g bind:this={mainArc}>
  {#each segment.chunks as chunk, i}
    <SlicePath initialAnimationDone={onLabelsReady} segmentChunk={chunk} />
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
        drilldown: () => {},
        remove: removeSlice
      }}
      cx={segment.tooltipAnchor[0]}
      cy={segment.tooltipAnchor[1]}
      r={1}
    />
  {/if}
  <line
    x1={segment.centroid[0]}
    y1={segment.centroid[1]}
    x2={segment.inflexionPoint[0]}
    y2={segment.inflexionPoint[1]}
    stroke={"black"}
    fill={"black"}
  />
  <line
    x1={segment.inflexionPoint[0]}
    y1={segment.inflexionPoint[1]}
    x2={segment.labelPosX}
    y2={segment.inflexionPoint[1]}
    stroke={"black"}
    fill={"black"}
  />
  <text
    x={segment.labelPosX + (segment.isRightLabel ? 2 : -2)}
    y={segment.inflexionPoint[1]}
    text-anchor={segment.textAnchor}
    dominant-baseline="middle"
    font-size={14}
  >
    {segment.masterLabel}
  </text>
{/if}
