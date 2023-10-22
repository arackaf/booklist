<script lang="ts">
  import { spring } from "svelte/motion";
  import Tick from "./Tick.svelte";

  export let transform: any;
  export let graphHeight: any;
  export let data: any[];
  export let scale: any;

  let axisSpring = spring({ height: graphHeight }, { stiffness: 0.1, damping: 0.4 });
  $: axisSpring.update(state => ({ ...state, height: graphHeight }));
</script>

<g>
  <g {transform}>
    <path fill="none" stroke="black" d="M50,0 H50.5 V{$axisSpring.height}" />
    {#each data.filter((_, idx) => idx !== 0).map((d, idx) => [d, idx]) as d (d[1])}
      <Tick {scale} d={d[0]} />
    {/each}
  </g>
</g>
