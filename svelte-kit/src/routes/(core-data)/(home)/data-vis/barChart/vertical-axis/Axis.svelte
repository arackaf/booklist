<script lang="ts">
  import { spring } from "svelte/motion";
  import Tick from "./Tick.svelte";

  export let transform: any;
  export let graphHeight: any;
  export let masterTransformX: any;
  export let masterTransformY: any;
  export let data: any[];
  export let scale: any;

  let axisSpring = spring({ height: graphHeight, masterTransformX, masterTransformY }, { stiffness: 0.1, damping: 0.4 });
  $: axisSpring.update(state => ({ ...state, height: graphHeight, masterTransformX, masterTransformY }));

  $: {
    console.log({ data, vals: data.map(d => scale(d)) });
  }
</script>

<g transform={`translate(${$axisSpring.masterTransformX}, ${$axisSpring.masterTransformY})`}>
  <g data-s={transform}>
    <path fill="none" stroke="black" d="M0,0 H0.5 V{$axisSpring.height}" />
    {#each data as d (d)}
      <Tick {scale} {d} />
    {/each}
  </g>
</g>
