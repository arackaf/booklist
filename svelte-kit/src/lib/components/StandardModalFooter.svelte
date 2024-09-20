<script lang="ts">
  import Button from "$lib/components/Button/Button.svelte";

  type Props = {
    onHide?: () => void;
  };

  let { onHide = () => {} }: Props = $props();
</script>

<div class="mt-8">
  <hr class="my-3" />
  {#if $$slots.default}
    <slot />
  {:else}
    <Button onclick={onHide}>Close</Button>
  {/if}
</div>
