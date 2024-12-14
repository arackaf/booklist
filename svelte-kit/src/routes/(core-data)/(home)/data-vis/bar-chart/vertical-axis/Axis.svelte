<script lang="ts">
  import { spring } from "svelte/motion";
  import Tick from "./Tick.svelte";

  type Props = {
    data: any[];
    graphHeight: number;
    scale: any;
  };

  let { data, graphHeight, scale }: Props = $props();

  const axisSpring = spring({ height: graphHeight }, { stiffness: 0.1, damping: 0.4 });
  $effect(() => {
    axisSpring.update(state => ({ ...state, height: graphHeight }));
  });
</script>

<path fill="none" stroke="black" d="M50,0 H50.5 V{$axisSpring.height}" />
{#each data.filter((_, idx) => idx !== 0).map((d, idx) => [d, idx]) as d (d[1])}
  <Tick {scale} d={d[0]} />
{/each}
