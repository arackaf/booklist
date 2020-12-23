<script lang="ts">
  import MultiBar from "./MultiBar.svelte";
  import SingleBar from "./SingleBar.svelte";

  export let x;
  export let data: any;
  export let height;
  export let width;
  export let totalSvgWidth;
  export let count;
  export let hoverBar;
  export let unHoverBar;
</script>

{#if data.entries.length == 1}
  <SingleBar color={data.entries[0].color} {data} {height} {width} {x} {totalSvgWidth} {hoverBar} {unHoverBar} />
{:else}
  <MultiBar {data} {height} {width} {x} {totalSvgWidth} {hoverBar} {unHoverBar} />
{/if}
