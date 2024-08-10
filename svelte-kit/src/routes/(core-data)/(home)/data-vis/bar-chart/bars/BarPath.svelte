<script lang="ts">
  export let width: number;
  export let height: number;
  export let x: number;
  export let fill: string;

  $: borderRadius = width < 5 || height < 5 ? 0 : width < 15 ? 4 : 5;
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
