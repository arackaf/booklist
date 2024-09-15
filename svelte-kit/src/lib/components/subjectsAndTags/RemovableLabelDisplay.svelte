<script lang="ts">
  import Label from "$lib/components/form-elements/Label/Label.svelte";
  import type { Label as LabelType, LabelColors } from "./types";

  type Props = {
    item: Partial<LabelType> | null;
    extraStyles?: string;
    doRemove?: () => void;
    class?: string;
    href?: string;
    disabled?: boolean;
  };

  let { item = null, extraStyles = "", doRemove = () => {}, class: className = "", href = "", disabled = false }: Props = $props();

  let colorsPacket: LabelColors | null = $derived(item?.name && (item?.textColor || item?.backgroundColor) ? (item as LabelColors) : null);
</script>

<Label colors={colorsPacket} style={extraStyles} class={"flex gap-1 " + className}>
  {#if href}
    <a {href} class="font-bold text-inherit" style="font-size: inherit">X</a>
  {:else}
    <button
      type="button"
      {disabled}
      onclick={doRemove}
      class="raw-button font-bold"
      class:cursor-pointer={!disabled}
      style="font-size: inherit; color: inherit;"
    >
      X
    </button>
  {/if}
  <span style="border-left: 1px solid {item?.textColor || 'white'}"></span>
  {#if $$slots.default}
    <slot />
  {:else}
    {item?.name}
  {/if}
</Label>
