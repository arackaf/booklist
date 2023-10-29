<script lang="ts">
  import { tooltip } from "../bar-chart/tooltip";
  export let segment: any;

  let mainArc: SVGElement;
</script>

<g bind:this={mainArc}>
  {#each segment.chunks as chunk, i}
    <path d={chunk.arc} fill={chunk.color} />
  {/each}
</g>
{#if mainArc}
  <circle
    data-style="visibility: hidden"
    use:tooltip={{ position: "right", data: segment.data, hoverTarget: mainArc, drilldown: () => {}, removeBar: () => {} }}
    cx={segment.tooltipAnchor[0]}
    cy={segment.tooltipAnchor[1]}
    r={2}
  />
{/if}
