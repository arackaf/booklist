<script lang="ts">
  import { spring } from "svelte/motion";
  import SlicePath from "./SlicePath.svelte";
  import { getContext, onMount, tick } from "svelte";
  import type { createTooltipState } from "../tooltip/tooltipState";
  import { getTooltipDimensions, positionTooltip } from "../tooltip/tooltipUtils";
  import { get } from "svelte/store";

  export let segment: any;
  export let noInitialAnimation: boolean;
  export let onLabelsReady: () => void;
  export let removeSlice: (id: any) => void;
  export let drilldown: any;
  export let containerSize: "UNKNOWN" | "SMALL" | "NORMAL";
  export let disableAnimation: boolean;
  export let chartHasRendered: boolean;

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

  const initialStartAngle = segment.chunks[0].startAngle;
  const initialEndAngle = segment.chunks[0].endAngle;

  const sliceSpring = spring(
    initialEndAngle < PI
      ? {
          startAngle: initialStartAngle,
          endAngle: chartHasRendered ? initialStartAngle : initialEndAngle
        }
      : {
          startAngle: chartHasRendered ? initialEndAngle : initialStartAngle,
          endAngle: initialEndAngle
        },
    springConfig
  );

  let sizing = false;
  $: {
    sizing = true;
    sliceSpring
      .set({
        startAngle: segment.chunks[0].startAngle,
        endAngle: segment.chunks[0].endAngle
      })
      .then(() => {
        sizing = false;
        if (!initialAnimationDoneCalled) {
          onLabelsReady();
        }
        initialAnimationDoneCalled = true;
      });
  }

  let c: SVGElement;

  const tooltipState = getContext("tooltip-state") as ReturnType<typeof createTooltipState>;

  const currentTooltipState = tooltipState.currentState;

  $: {
    let tooltipHovering = $currentTooltipState.hovering;
    if (!tooltipHovering && !hovering) {
      setTimeout(() => {
        if ((!$currentTooltipState.hovering || $currentTooltipState.payload.data !== segment.data) && !hovering) {
          tooltipOn = false;
        }
      }, 200);
    }
  }

  let hovering = false;
  $: mouseOver = () => {
    hovering = true;
    if (sizing || !(mainArc && containerSize !== "UNKNOWN")) {
      return;
    }

    tooltipOn = true;
    const position = midPoint < 180 ? "absolute-right" : "absolute-left";
    const data = segment.data;

    const doDrilldown = (...args) => drilldown(...args, "PIE");
    const remove = removeSlice;

    tooltipState.show(c, { position, data, drilldown: doDrilldown, remove });
  };

  function mouseOut() {
    hovering = false;
    setTimeout(() => {
      if (hovering || ($currentTooltipState.hovering && $currentTooltipState.payload.data === segment.data)) {
        return;
      } else {
        tooltipOn = false;
      }
      if ($currentTooltipState.payload.data === segment.data) {
        tooltipState.hide();
      }
    }, 200);
  }

  $: tooltipAnchorX = useCenterTooltipPosition || disableAnimation ? segment.centroid[0] : segment.centroidTransition[0];
  $: tooltipAnchorY = useCenterTooltipPosition || disableAnimation ? segment.centroid[1] : segment.centroidTransition[1];

  const sliceAnimateSpring = spring({ x: 0, y: 0 }, { stiffness: 0.1, damping: 0.5 });
  $: sliceAnimateSpring.set({ x: translateX, y: translateY });
</script>

<g role="contentinfo" on:mouseover={mouseOver} on:mousemove={mouseOver} on:mouseout={mouseOut} bind:this={mainArc}>
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
