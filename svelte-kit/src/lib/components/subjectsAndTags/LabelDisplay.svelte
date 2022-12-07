<script lang="ts">
  import type { Label } from "./types";

  export let onClick: ((item: Label) => void) | null = null;
  export let item: Label;
  export let extraStyles = "";
  export let disabled = false;
  let className = "";
  export { className as class };

  let extraClasses = className || "";
  let disabledStyles = "opacity: 0.4;";

  let stylesToAdd = extraStyles;
  if (disabled) {
    stylesToAdd = disabledStyles + stylesToAdd;
  }
</script>

<span
  on:click={onClick ? () => onClick?.(item) : e => (e.cancelBubble = false)}
  on:keypress={() => {}}
  style="cursor: {onClick ? 'pointer' : 'default'}; background-color: {item.backgroundColor}; color: {item.textColor || 'white'}; {stylesToAdd}"
  class={"label label-default noselect " + extraClasses}
>
  {#if $$slots.default}
    <slot />
  {:else}
    {item.name}
  {/if}
</span>
