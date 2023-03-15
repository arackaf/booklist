<script lang="ts">
  import type { Label } from "./types";

  export let onClick: ((item: Label) => void) | null = null;
  export let item: Label;
  export let extraStyles = "";
  export let disabled = false;
  let className = "";
  export { className as class };
  export let href: string | null = null;

  let extraClasses = className || "";
  let disabledStyles = "opacity: 0.4;";

  let stylesToAdd = extraStyles;
  if (disabled) {
    stylesToAdd = disabledStyles + stylesToAdd;
  }
</script>

{#if href}
  <a
    {href}
    style="cursor: {onClick ? 'pointer' : 'default'}; background-color: {item.backgroundColor}; color: {item.textColor || 'white'}; {stylesToAdd}"
    class={"label label-default disabled noselect " + extraClasses}
    class:disabled
  >
    {#if $$slots.default}
      <slot />
    {:else}
      {item.name}
    {/if}
  </a>
{:else}
  <span
    style="cursor: {onClick ? 'pointer' : 'default'}; background-color: {item.backgroundColor}; color: {item.textColor || 'white'}; {stylesToAdd}"
    class={"label label-default disabled noselect " + extraClasses}
    class:disabled
  >
    {#if $$slots.default}
      <slot />
    {:else}
      {item.name}
    {/if}
  </span>
{/if}

<style>
  a {
    cursor: pointer !important;
    text-decoration: none;
  }
  span.disabled,
  a.disabled {
    cursor: inherit !important;
  }
</style>
