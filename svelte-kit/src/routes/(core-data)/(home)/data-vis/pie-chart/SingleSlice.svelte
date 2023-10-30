<script lang="ts">
  import { tooltip } from "../bar-chart/tooltip";
  import SlicePath from "./SlicePath.svelte";
  export let segment: any;
  export let animate = true;

  let mainArc: SVGElement;

  const PI = 3.141592653;
  $: startAngle = segment.startAngle * (180 / PI);
  $: endAngle = segment.endAngle * (180 / PI);

  $: midPoint = startAngle + (endAngle - startAngle) / 2;

  let labelsReady = !animate;
</script>

<g bind:this={mainArc}>
  {#each segment.chunks as chunk, i}
    <SlicePath segmentChunk={chunk} />
  {/each}
  {#if labelsReady}
    <circle cx={segment.centroid[0]} cy={segment.centroid[1]} r={2} />
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
        removeBar: () => {}
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
