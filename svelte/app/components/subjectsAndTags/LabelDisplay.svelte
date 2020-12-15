<script lang="ts">
  export let onClick = null;
  export let item;
  export let extraStyles = "";
  export let disabled = false;
  let className = "";
  export { className as class };

  let extraClasses = className || "";
  let disabledStyles = "opacity: 0.4;";

  if (disabled) {
    extraStyles += disabledStyles;
  }
</script>

<span
  on:click={onClick ? () => onClick(item) : void 0}
  style="cursor: {onClick ? 'pointer' : 'default'}; background-color: {item.backgroundColor}; color: {item.textColor || 'white'}; {extraStyles}"
  class={'label label-default noselect ' + extraClasses}
>
  {#if $$slots.default}
    <slot />
  {:else}{item.name}{/if}
</span>
