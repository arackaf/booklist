<script lang="ts">
  import { v4 } from "uuid";

  export let color: string | string[];

  export let center: [number, number];
  export let arcCenter: [number, number];

  const id = v4();

  export let colorValue;

  $: {
    if (Array.isArray(color)) {
      colorValue = `url(#${id})`;
    } else {
      colorValue = color;
    }
  }
</script>

{#if Array.isArray(color)}
  <linearGradient {id} x1={center[0]} y1={center[1]} x2={arcCenter[0]} y2={arcCenter[1]} gradientUnits="userSpaceOnUse">
    {#each color as c, idx}
      {#if idx < color.length - 1}
        <stop offset={`${((idx + 1) / color.length) * 100}%`} stop-color={c} />
        {#if idx < color.length - 1}
          <stop offset={`${((idx + 1) / color.length) * 100}%`} stop-color={color[idx + 1]} />
        {/if}
      {/if}
    {/each}
  </linearGradient>
{/if}
