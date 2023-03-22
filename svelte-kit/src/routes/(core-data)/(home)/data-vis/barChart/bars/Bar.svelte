<script lang="ts">
  import type { Position } from "../tooltip";
  import MultiBar from "./MultiBar.svelte";
  import SingleBar from "./SingleBar.svelte";

  export let index: number;
  export let x: any;
  export let data: any;
  export let height: any;
  export let width: any;
  export let totalSvgWidth: any;
  export let drilldown: any;
  export let barCount: number;
  export let removeBar: (id: string) => void;

  export let noInitialAnimation: boolean;

  $: position = (height < 150 ? "top" : index < barCount / 2 ? "left" : "right") as Position;
</script>

{#if data.entries.length == 1}
  <SingleBar color={data.entries[0].color} {data} {height} {width} {x} {totalSvgWidth} {drilldown} {position} {removeBar} {noInitialAnimation} />
{:else}
  <MultiBar {data} {height} {width} {x} {totalSvgWidth} {position} {drilldown} {removeBar} {noInitialAnimation} />
{/if}

<style>
  :global(.popper-tooltip) {
    display: none;
    opacity: 0;
    transition: opacity 200ms ease-in;
  }
  :global(.popper-tooltip.exists) {
    display: block;
  }
  :global(.popper-tooltip.show) {
    opacity: 1;
  }
</style>
