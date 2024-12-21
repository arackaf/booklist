<script lang="ts">
  import { spring } from "svelte/motion";
  import SlicePath from "./SlicePath.svelte";
  import { getContext } from "svelte";
  import type { createTooltipState } from "../tooltip/tooltipState.svelte";

  type Props = {
    segment: any;
    noInitialAnimation: boolean;
    onLabelsReady: () => void;
    removeSlice: (id: any) => void;
    drilldown: any;
    containerSize: "UNKNOWN" | "SMALL" | "NORMAL";
    disableAnimation: boolean;
    chartHasRendered: boolean;
  };

  let { segment, noInitialAnimation, onLabelsReady, removeSlice, drilldown, containerSize, disableAnimation, chartHasRendered }: Props = $props();

  let mainArc = $state<SVGElement>(null as any);

  const PI = 3.141592653;
  let startAngle = $derived(segment.startAngle * (180 / PI));
  let endAngle = $derived(segment.endAngle * (180 / PI));
  let midPoint = $derived(startAngle + (endAngle - startAngle) / 2);

  let { arcCenterPoint } = $derived(segment);

  const tooltipState = getContext("tooltip-state") as ReturnType<typeof createTooltipState>;
  let currentTooltipState = $derived(tooltipState.currentState);
  let currentTooltipShownState = $derived(tooltipState.shownState.value);

  let slideSliceOut = $derived.by(() => {
    let activeData = currentTooltipState.payload?.data;
    return activeData?.groupId === segment.data.groupId && currentTooltipShownState;
  });
  let translateX = $state(0);
  let translateY = $state(0);

  $effect(() => {
    const [x1, y1] = arcCenterPoint;

    const translateTarget = segment.centroidTransition;
    const [x2, y2] = translateTarget;

    translateX = slideSliceOut && !disableAnimation ? x2 - x1 : 0;
    translateY = slideSliceOut && !disableAnimation ? y2 - y1 : 0;
  });

  let tooltipAnchorKey = $derived(containerSize === "SMALL" ? "small" : containerSize === "NORMAL" ? "large" : "");

  let highMiddlePoint = $derived(midPoint > 300 || midPoint < 60);
  let useCenterTooltipPosition = $derived(containerSize === "SMALL" || highMiddlePoint);

  const springConfig = { stiffness: 0.1, damping: 0.7 };

  let initialAnimationDoneCalled = $state(noInitialAnimation);

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

  let sizing = $state(false);

  $effect(() => {
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
  });

  let c = $state<SVGElement>(null as any);

  let hovering = $state(false);

  function mouseOver() {
    hovering = true;
    if (sizing || !(mainArc && containerSize !== "UNKNOWN")) {
      return;
    }

    const position = midPoint < 180 ? "absolute-right" : "absolute-left";
    const data = segment.data;

    const doDrilldown = (...args) => drilldown(...args, "PIE");
    const remove = removeSlice;

    tooltipState.onHover(c, { position, data, drilldown: doDrilldown, remove });
  }

  function mouseLeave(e: Event) {
    hovering = false;
    tooltipState.onMouseLeave();
  }

  let tooltipAnchorX = $derived(useCenterTooltipPosition || disableAnimation ? segment.centroid[0] : segment.centroidTransition[0]);
  let tooltipAnchorY = $derived(useCenterTooltipPosition || disableAnimation ? segment.centroid[1] : segment.centroidTransition[1]);

  const sliceAnimateSpring = spring({ x: 0, y: 0 }, { stiffness: 0.1, damping: 0.5 });

  $effect(() => {
    sliceAnimateSpring.set({ x: translateX, y: translateY });
  });
</script>

<g
  role="contentinfo"
  onmouseover={mouseOver}
  onmousemove={mouseOver}
  onmouseleave={mouseLeave}
  bind:this={mainArc}
  onfocus={() => {}}
  onblur={() => {}}
>
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
