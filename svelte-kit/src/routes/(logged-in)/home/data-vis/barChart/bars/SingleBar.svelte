<script lang="ts">
  import { onMount } from "svelte";
  import { spring } from "svelte/motion";

  import { tooltip } from "../tooltip";

  export let drilldown: any;
  export let color: any;
  export let index: number;
  export let hoverBar: any;
  export let unHoverBar: any;
  export let data: any;
  export let height: any;
  export let width: any;
  export let x: any;
  export let totalSvgWidth;

  let barSpring = spring({ height: 0, x: totalSvgWidth, width }, { stiffness: 0.1, damping: 0.4 });

  $: {
    barSpring.update(state => ({ ...state, height, x, width }));
  }

  onMount(() => {
    const div = document.createElement("div");
    div.classList.add("popper-tooltip");
  });
</script>

<!-- on:mouseover={() => hoverBar(data.groupId)} on:focus={null} on:blur={null} on:mouseout={() => unHoverBar(data.groupId)} -->

<g use:tooltip={{ position: "right", data, drilldown }}>
  <rect height={Math.max(0, $barSpring.height)} width={$barSpring.width} x={$barSpring.x} y={0} fill={color} />
</g>

<style>
  :global(.popper-tooltip) {
    display: none;
  }
  :global(.popper-tooltip.show) {
    display: block;
  }
</style>
