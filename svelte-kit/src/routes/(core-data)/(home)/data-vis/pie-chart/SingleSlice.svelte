<script lang="ts">
  import { tooltip } from "../bar-chart/tooltip";
  export let segment: any;

  let mainArc: SVGElement;

  const PI = 3.141592653;
  $: startAngle = segment.startAngle * (180 / PI);
  $: endAngle = segment.endAngle * (180 / PI);

  $: midPoint = startAngle + (endAngle - startAngle) / 2;

  $: console.log(segment.masterLabel, startAngle, endAngle, midPoint);
</script>

<g bind:this={mainArc}>
  {#each segment.chunks as chunk, i}
    <path d={chunk.arc} fill={chunk.color} />
  {/each}
</g>
{#if mainArc}
  <circle
    style="visibility: hidden"
    use:tooltip={{ position: midPoint < 180 ? "right" : "left", data: segment.data, hoverTarget: mainArc, drilldown: () => {}, removeBar: () => {} }}
    cx={segment.tooltipAnchor[0]}
    cy={segment.tooltipAnchor[1]}
    r={1}
  />
{/if}
