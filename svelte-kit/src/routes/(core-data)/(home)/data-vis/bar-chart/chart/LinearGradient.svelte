<script lang="ts">
  import Stop from "./Stop.svelte";

  type Props = {
    id: string;
    colors: string[];
  };

  let { id, colors }: Props = $props();
</script>

<linearGradient {id} x1="0%" y1="0%" x2="0%" y2="100%">
  {#each colors as _, idx}
    <Stop {idx} {colors} />
  {/each}
</linearGradient>
