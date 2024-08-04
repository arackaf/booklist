<script lang="ts">
  import { spring } from "svelte/motion";
  import { tooltip } from "../bar-chart/tooltip";
  import SlicePath from "./SlicePath.svelte";

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
</script>

<g role="contentinfo" on:mouseover={hover} bind:this={mainArc}>
  <SlicePath {sliceSpring} segmentChunk={segment.chunks[0]} color="#FFFFFF" />
  <g role="banner" style="transition: 200ms ease-in; transform: translate({translateX}px, {translateY}px)">
    {#each segment.chunks as chunk, i}
      <SlicePath {sliceSpring} segmentChunk={chunk} />
    {/each}
  </g>
</g>
{#if mainArc && containerSize !== "UNKNOWN"}
  {#key tooltipAnchorKey}
    <circle
      style="visibility: hidden"
      cx={useCenterTooltipPosition || disableAnimation ? segment.centroid[0] : segment.centroidTransition[0]}
      cy={useCenterTooltipPosition || disableAnimation ? segment.centroid[1] : segment.centroidTransition[1]}
      r={1}
      bind:this={c}
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
