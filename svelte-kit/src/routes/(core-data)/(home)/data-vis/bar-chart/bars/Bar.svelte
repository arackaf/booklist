<script lang="ts">
  import type { Position } from "../../tooltipUtils";
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

  let position: Position;

  $: {
    if (height < 150) {
      if (index < 3) {
        position = "top-left";
      } else if (index >= barCount - 3) {
        position = "top-right";
      } else {
        position = "top";
      }
    } else {
      position = index < barCount / 2 ? "right-start" : "left-start";
    }
  }
</script>

{#if data.entries.length == 1}
  <SingleBar color={data.entries[0].color} {data} {height} {width} {x} {totalSvgWidth} {drilldown} {position} {removeBar} {noInitialAnimation} />
{:else}
  <MultiBar {data} {height} {width} {x} {totalSvgWidth} {position} {drilldown} {removeBar} {noInitialAnimation} />
{/if}
