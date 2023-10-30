<script lang="ts">
  import Tooltip from "../Tooltip.svelte";
  import type { Data, Position } from "../tooltip";

  export let position: Position;
  export let data: Data;
  export let drilldown: any;
  export let removeBar: (id: string) => void;
  export let targetElement: SVGElement;

  let arrowStyle = "";

  $: {
    const barRect = targetElement.getBoundingClientRect();
    const barWidth = barRect.width;
    if (position === "top-left") {
      arrowStyle = `left: calc(${Math.round(barWidth / 2)}px - var(--arrow-offset))`;
    } else if (position === "top-right") {
      arrowStyle = `right: calc(${Math.round(barWidth / 2)}px - var(--arrow-offset))`;
    }
  }
</script>

<Tooltip {position} {data} {drilldown} remove={removeBar} {arrowStyle} {targetElement} />
