<script lang="ts">
  type Props = {
    colors: string[];
    idx: number;
  };

  let { colors, idx }: Props = $props();

  let interval = $derived(100 / colors.length);

  let color = $derived(colors[idx]);
  let nextColor = $derived(idx === colors.length - 1 ? null : colors[idx + 1]);

  let offset = $derived(idx === colors.length - 1 ? idx * interval : (idx + 1) * interval);
</script>

<stop offset={`${offset.toFixed(1)}%`} style="stop-color: {color}; stop-opacity:1" />
{#if nextColor}
  <stop offset={`${offset.toFixed(1)}%`} style="stop-color: {nextColor}; stop-opacity:1" />
{/if}
