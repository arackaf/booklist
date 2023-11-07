<script lang="ts">
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
  export let containerSize: "UNKNOWN" | "SMALL" | "NORMAL";
  export let disableAnimation: boolean;

  $: labelsAreHidden = hideLabels;

  let mainArc: SVGElement;

  const PI = 3.141592653;
  $: startAngle = segment.startAngle * (180 / PI);
  $: endAngle = segment.endAngle * (180 / PI);
  $: midPoint = startAngle + (endAngle - startAngle) / 2;

  $: ({ centroid, inflexionPoint, labelPosX, textAnchor, arcCenterPoint, isRightLabel } = segment);

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
    const [x1, y1] = arcCenterPoint;

    const translateTarget = segment.centroidTransition;
    const [x2, y2] = translateTarget;

    translateX = tooltipOn && !disableAnimation ? x2 - x1 : 0;
    translateY = tooltipOn && !disableAnimation ? y2 - y1 : 0;
  }

  $: tooltipAnchorKey = containerSize === "SMALL" ? "small" : containerSize === "NORMAL" ? "large" : "";
  $: smallContainer = containerSize === "SMALL";
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
      font-size={12}
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
{#if mainArc && containerSize !== "UNKNOWN"}
  {#key tooltipAnchorKey}
    <circle
      style="visibility: hidden"
      cx={smallContainer || disableAnimation ? segment.centroid[0] : segment.centroidTransition[0]}
      cy={smallContainer || disableAnimation ? segment.centroid[1] : segment.centroidTransition[1]}
      r={1}
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
  {/key}
{/if}
