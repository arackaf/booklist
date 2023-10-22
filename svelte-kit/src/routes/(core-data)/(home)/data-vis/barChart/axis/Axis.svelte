<script lang="ts">
  import { spring } from "svelte/motion";
  import Tick from "./Tick.svelte";

  export let data: any[];
  export let graphWidth: any;
  export let scaleX: any;

  let axisSpring = spring({ width: graphWidth }, { stiffness: 0.1, damping: 0.4 });
  $: axisSpring.update(state => ({ ...state, width: graphWidth }));
</script>

<path fill="none" stroke="black" d="M50.5,6 V0.5 H{$axisSpring.width - 1} V 6" />
{#each data as d (d)}
  <Tick {scaleX} {d} />
{/each}
