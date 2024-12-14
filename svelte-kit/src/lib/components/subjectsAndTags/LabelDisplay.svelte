<script lang="ts">
  import Label from "$lib/components/form-elements/Label/Label.svelte";
  import type { Label as LabelType } from "./types";

  type Props = {
    item: LabelType;
    extraStyles?: string;
    disabled?: boolean;
    class?: string;
    href?: string | null;
  };
  let { item, extraStyles = "", disabled = false, class: className = "", href = null }: Props = $props();

  let extraClasses = $derived(className || "");

  const disabledClasses = "opacity-60 cursor-not-allowed";
</script>

{#if href}
  <a {href} style={extraStyles} class="{disabled ? disabledClasses : ''} {extraClasses}">
    <Label colors={item}>
      {item.name}
    </Label>
  </a>
{:else}
  <Label colors={item} class="{disabled ? disabledClasses : ''} {extraClasses}">
    {item.name}
  </Label>
{/if}
