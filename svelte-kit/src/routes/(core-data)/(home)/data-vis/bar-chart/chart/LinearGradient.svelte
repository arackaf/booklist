<script lang="ts">
  import Stop from "./Stop.svelte";

  export let id: string;
  export let colors: string[];
</script>

<linearGradient {id} x1="0%" y1="0%" x2="0%" y2="100%">
  {#each colors as _, idx}
    <Stop {idx} {colors} />
  {/each}
</linearGradient>
