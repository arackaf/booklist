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
  export let hoverBar: any;
  export let unHoverBar: any;
  export let drilldown: any;
  export let barCount: number;

  $: position = (height < 150 ? "top" : index < barCount / 2 ? "left" : "right") as Position;
</script>

{#if data.entries.length == 1}
  <SingleBar color={data.entries[0].color} {data} {height} {width} {x} {totalSvgWidth} {hoverBar} {unHoverBar} {drilldown} {index} {position} />
{:else}
  <MultiBar {data} {height} {width} {x} {totalSvgWidth} {hoverBar} {unHoverBar} {position} {drilldown} />
{/if}
