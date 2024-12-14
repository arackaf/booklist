<script lang="ts">
  import type { Position } from "../../tooltip/tooltipUtils";
  import MultiBar from "./MultiBar.svelte";
  import SingleBar from "./SingleBar.svelte";

  type Props = {
    index: number;
    x: any;
    data: any;
    height: any;
    width: any;
    totalSvgWidth: any;
    drilldown: any;
    barCount: number;
    removeBar: (id: string) => void;
    noInitialAnimation: boolean;
  };

  let { index, x, data, height, width, totalSvgWidth, drilldown, barCount, removeBar, noInitialAnimation }: Props = $props();

  let position: Position = $derived.by(() => {
    if (height < 150) {
      if (index < 3) {
        return "top-left";
      } else if (index >= barCount - 3) {
        return "top-right";
      } else {
        return "top";
      }
    } else {
      return index < barCount / 2 ? "right-start" : "left-start";
    }
  });
</script>

{#if data.entries.length == 1}
  <SingleBar color={data.entries[0].color} {data} {height} {width} {x} {totalSvgWidth} {drilldown} {position} {removeBar} {noInitialAnimation} />
{:else}
  <MultiBar {data} {height} {width} {x} {totalSvgWidth} {position} {drilldown} {removeBar} {noInitialAnimation} />
{/if}
