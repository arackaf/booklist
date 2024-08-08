<script lang="ts">
  import { spring } from "svelte/motion";
  import { tooltip } from "../bar-chart/tooltip";
  import SlicePath from "./SlicePath.svelte";
  import { getContext } from "svelte";
  import type { createTooltipState } from "../tooltipState";
  import { getTooltipDimensions, positionTooltip } from "../bar-chart/tooltipPositioner";

  export let segment: any;
  export let noInitialAnimation: boolean;
  export let onLabelsReady: () => void;
  export let removeSlice: (id: any) => void;
  export let drilldown: any;
  export let containerSize: "UNKNOWN" | "SMALL" | "NORMAL";
  export let disableAnimation: boolean;

  let mainArc: SVGElement;

  const PI = 3.141592653;
  $: startAngle = segment.startAngle * (180 / PI);
  $: endAngle = segment.endAngle * (180 / PI);
  $: midPoint = startAngle + (endAngle - startAngle) / 2;

  $: ({ arcCenterPoint } = segment);

  let tooltipOn = false;
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

  $: highMiddlePoint = midPoint > 300 || midPoint < 60;
  $: useCenterTooltipPosition = containerSize === "SMALL" || highMiddlePoint;

  const springConfig = { stiffness: 0.1, damping: 0.7 };

  let initialAnimationDoneCalled = noInitialAnimation;

  $: segmentChunkReference = segment.chunks[0];
  $: initialSliceAngles = {
    startAngle: segmentChunkReference.startAngle,
    endAngle: noInitialAnimation ? segmentChunkReference.endAngle : segmentChunkReference.startAngle
  };
  const sliceSpring = spring(initialSliceAngles, springConfig);

  $: {
    sliceSpring
      .set({
        startAngle: segmentChunkReference.startAngle,
        endAngle: segmentChunkReference.endAngle
      })
      .then(() => {
        if (!initialAnimationDoneCalled) {
          onLabelsReady();
        }
        initialAnimationDoneCalled = true;
      });
  }

  let c: SVGElement;
  function hover() {
    let rect = c.getBoundingClientRect();
    console.log({ rect });
  }

  const tooltipState = getContext("tooltip-state") as ReturnType<typeof createTooltipState>;

  $: mouseOver = () => {
    if (!(mainArc && containerSize !== "UNKNOWN")) {
      return;
    }

    let bound = c.getBoundingClientRect();

    tooltipOn = true;
    const position = midPoint < 180 ? "absolute-right" : "absolute-left";
    const data = segment.data;

    const drilldown = (...args) => drilldown(...args, "PIE");
    const remove = removeSlice;

    const { w, h } = getTooltipDimensions({ position, data, drilldown, remove });
    const tooltipPosition = positionTooltip(bound, position, { w, h });
    tooltipState.show(tooltipPosition, { position, data, drilldown, remove });
  };

  function mouseOut() {
    tooltipOn = false;
    tooltipState.hide();
  }

  $: tooltipAnchorX = useCenterTooltipPosition || disableAnimation ? segment.centroid[0] : segment.centroidTransition[0];
  $: tooltipAnchorY = useCenterTooltipPosition || disableAnimation ? segment.centroid[1] : segment.centroidTransition[1];

  const sliceAnimateSpring = spring({ x: 0, y: 0 }, { stiffness: 0.1, damping: 0.5 });
  $: sliceAnimateSpring.set({ x: translateX, y: translateY });
</script>

<g role="contentinfo" on:mouseover={mouseOver} on:mouseout={mouseOut} bind:this={mainArc}>
  <SlicePath {sliceSpring} segmentChunk={segment.chunks[0]} color="#FFFFFF" />
  <g role="banner" style="transform: translate({$sliceAnimateSpring.x}px, {$sliceAnimateSpring.y}px)">
    {#each segment.chunks as chunk, i}
      <SlicePath {sliceSpring} segmentChunk={chunk} />
    {/each}
  </g>
</g>
{#if mainArc && containerSize !== "UNKNOWN"}
  {#key tooltipAnchorKey}
    <circle style="visibility: hidden" cx={tooltipAnchorX} cy={tooltipAnchorY} r={1} bind:this={c} />
  {/key}
{/if}
