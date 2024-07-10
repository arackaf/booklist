<script lang="ts">
  import Button from "$lib/components/Button/Button.svelte";
  export let onHide = () => {};
</script>

<div class="mt-8">
  <hr class="my-3" />
  {#if $$slots.default}
    <slot />
  {:else}
    <Button onclick={onHide}>Close</Button>
  {/if}
</div>
