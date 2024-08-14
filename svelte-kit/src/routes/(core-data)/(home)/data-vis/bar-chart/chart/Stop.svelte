<script lang="ts">
  export let colors: string[];
  export let idx: number;

  $: interval = 100 / colors.length;

  $: color = colors[idx];
  $: nextColor = idx === colors.length - 1 ? null : colors[idx + 1];

  $: offset = idx === colors.length - 1 ? idx * interval : (idx + 1) * interval;
</script>

<stop offset={`${offset.toFixed(1)}%`} style="stop-color: {color}; stop-opacity:1" />
{#if nextColor}
  <stop offset={`${offset.toFixed(1)}%`} style="stop-color: {nextColor}; stop-opacity:1" />
{/if}
