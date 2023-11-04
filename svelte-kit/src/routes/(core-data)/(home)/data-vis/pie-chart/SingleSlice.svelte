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
  export let segmentCount: number;
  export let hideLabels: boolean;

  $: labelsAreHidden = hideLabels;

  const arcGenerator = arc();

  let mainArc: SVGElement;

  const PI = 3.141592653;
  $: startAngle = segment.startAngle * (180 / PI);
  $: endAngle = segment.endAngle * (180 / PI);
  $: midPoint = startAngle + (endAngle - startAngle) / 2;

  $: ({ centroid, inflexionPoint, labelPosX, textAnchor, isRightLabel } = segment);

  $: tooltipAnchor = arcGenerator.centroid({
    startAngle: segment.startAngle,
    endAngle: segment.endAngle,
    innerRadius: radius,
    outerRadius: radius - 2
  });

  const springConfig = { stiffness: 0.1, damping: 0.7 };

  const initialLabelValues = {
    centroidX: segment.centroid[0],
    centroidY: segment.centroid[1],
    inflexionPointX: segment.inflexionPoint[0],
    inflexionPointY: segment.inflexionPoint[1],
    labelPosX: segment.labelPosX
  };
  const sliceSpring = spring(initialLabelValues, springConfig);

  $: {
    sliceSpring.set({
      centroidX: centroid[0],
      centroidY: centroid[1],
      inflexionPointX: inflexionPoint[0],
      inflexionPointY: inflexionPoint[1],
      labelPosX
    });
  }

  let tooltipOn = false;
  const onTooltipShow = () => (tooltipOn = true);
  const onTooltipHide = () => (tooltipOn = false);

  let translateX = 0;
  let translateY = 0;
  $: {
    const [x1, y1] = tooltipAnchor;

    const translateTarget = segment.centroidTransition;
    const [x2, y2] = translateTarget;

    translateX = tooltipOn ? x2 - x1 : 0;
    translateY = tooltipOn ? y2 - y1 : 0;
  }
</script>

{#if !labelsAreHidden && (labelsReady || noInitialAnimation)}
  <g>
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
  </g>
{/if}

<g bind:this={mainArc}>
  <SlicePath initialAnimationDone={onLabelsReady} segmentChunk={segment.chunks[0]} {noInitialAnimation} color="#FFFFFF" />
  <g role="banner" style="transition: 200ms ease-in; transform: translate({translateX}px, {translateY}px)">
    {#each segment.chunks as chunk, i}
      <SlicePath initialAnimationDone={onLabelsReady} segmentChunk={chunk} {noInitialAnimation} />
    {/each}
  </g>
</g>
{#if mainArc && (labelsReady || noInitialAnimation)}
  <circle data-style="visibility: hidden" cx={tooltipAnchor[0]} cy={tooltipAnchor[1]} r={4} />

  <!-- {#if transitionPoint} -->
  <circle
    cx={segment.centroidTransition[0]}
    cy={segment.centroidTransition[1]}
    r={4}
    use:tooltip={{
      position: midPoint < 180 ? "right" : "left",
      data: segment.data,
      hoverTarget: mainArc,
      drilldown: (...args) => drilldown(...args, "PIE"),
      remove: removeSlice,
      onShow: onTooltipShow,
      onHide: onTooltipHide
    }}
  />
{/if}
<!-- {/if} -->
