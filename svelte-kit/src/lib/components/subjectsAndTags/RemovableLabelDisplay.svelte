<script lang="ts">
  import Label from "$lib/components/ui/Label/Label.svelte";
  import type { Label as LabelType, LabelColors } from "./types";

  export let item: Partial<LabelType> | null = null;
  export let extraStyles = "";
  export let doRemove: () => void = () => {};

  let className = "";
  export { className as class };

  export let href: string = "";

  let colorsPacket: LabelColors | null;

  $: {
    colorsPacket = item?.name && (item?.textColor || item?.backgroundColor) ? (item as LabelColors) : null;
  }
</script>

<Label colors={colorsPacket} style={extraStyles} class={"flex gap-1 " + className}>
  {#if href}
    <a {href} class="font-bold text-inherit" style="font-size: inherit">X</a>
  {:else}
    <button type="button" on:click={doRemove} class="raw-button font-bold cursor-pointer" style="font-size: inherit; color: inherit;"> X </button>
  {/if}
  <span style="border-left: 1px solid {item?.textColor || 'white'}" />
  {#if $$slots.default}
    <slot />
  {:else}
    {item?.name}
  {/if}
</Label>
