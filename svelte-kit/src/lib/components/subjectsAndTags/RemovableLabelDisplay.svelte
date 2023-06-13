<script lang="ts">
  import Label from "$lib/components/ui/Label/Label.svelte";

  export let item = {} as any;
  export let extraStyles = "";
  export let doRemove: () => void = () => {};

  let className = "";
  export { className as class };

  export let href: string = "";
</script>

<Label colors={item} style={extraStyles} class={"flex gap-1 " + className}>
  {#if href}
    <a {href} class="font-bold" style="color: {item.textColor || 'white'}; font-size: inherit">X</a>
  {:else}
    <button
      type="button"
      on:click={doRemove}
      class="raw-button font-bold cursor-pointer"
      style="color: {item.textColor || 'white'}; font-size: inherit"
    >
      X
    </button>
  {/if}
  <span style="border-left: 1px solid {item.textColor}" />
  {#if $$slots.default}
    <slot />
  {:else}
    {item.name}
  {/if}
</Label>
