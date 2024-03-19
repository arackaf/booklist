<script lang="ts">
  import Label from "$lib/components/form-elements/Label/Label.svelte";
  import type { Label as LabelType } from "./types";

  export let item: LabelType;
  export let extraStyles = "";
  export let disabled = false;
  let className = "";
  export { className as class };
  export let href: string | null = null;

  let extraClasses = className || "";

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
