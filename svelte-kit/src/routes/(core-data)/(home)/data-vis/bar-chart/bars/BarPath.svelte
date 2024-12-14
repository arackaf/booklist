<script lang="ts">
  type Props = {
    width: number;
    height: number;
    x: number;
    fill: string;
  };

  let { width, height, x, fill }: Props = $props();

  let borderRadius = $derived(width < 5 || height < 5 ? 0 : width < 15 ? 4 : 5);
</script>

<path
  d={`
    M${x},0
    v${height - borderRadius}
    a5,5 0 0 0 ${borderRadius},${borderRadius}
    h${width - 2 * borderRadius}
    a5,5 0 0 0 ${borderRadius},${-1 * borderRadius}
    v-${height - borderRadius}
    z
    `}
  {fill}
/>
