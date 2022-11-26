<script lang="ts">
  export let item = {} as any;
  export let extraStyles = "";
  export let name = "";
  export let doRemove: any;

  let className = "";
  export { className as class };
  export let extraClasses = className || "";
</script>

<span
  style="background-color: {item.backgroundColor}; color: {item.textColor || 'white'}; {extraStyles}"
  class={"label label-default noselect " + extraClasses}
>
  <button on:click={doRemove} class="raw-button fw-700 cursor-pointer" style="color: {item.textColor || 'white'}; font-size: inherit"> X </button>
  <span style="margin-left: 5px; padding-left: 5px; border-left: var(--default-border-width) solid white">{name}</span>
  {#if $$slots.default}
    <slot />
  {:else}{item.name}{/if}
</span>
