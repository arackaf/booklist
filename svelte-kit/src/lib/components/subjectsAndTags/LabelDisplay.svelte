<script lang="ts">
  import Badge from "../ui/badge/badge.svelte";
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
    <Badge
      class="whitespace-nowrap truncate max-w-44 block bg-neutral-500 text-white px-2 text-xs leading-none"
      style="background-color: {item.backgroundColor}; color: {item.textColor};"
    >
      {item.name}
    </Badge>
  </a>
{:else}
  <Badge class="bg-neutral-500 text-white px-2 text-xs leading-none" style="background-color: {item.backgroundColor}; color: {item.textColor};">
    {item.name}
  </Badge>
{/if}
