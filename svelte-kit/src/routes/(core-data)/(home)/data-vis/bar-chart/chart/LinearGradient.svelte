<script lang="ts">
  export let id: string;
  export let colors: string[];

  $: interval = 100 / colors.length;
</script>

<linearGradient {id} x1="0%" y1="0%" x2="0%" y2="100%">
  {#each colors as color, idx}
    <stop offset={(interval * (idx + 1)).toFixed(1) + "%"} style="stop-color: {color}; stop-opacity:1" />
    {#if idx < colors.length - 1}
      <stop offset={(interval * (idx + 1)).toFixed(1) + "%"} style="stop-color: {colors[idx + 1]}; stop-opacity:1" />
    {/if}
  {/each}
</linearGradient>
