<script lang="ts">
  import { getContext } from "svelte";
  import Button from "$lib/components/Button/Button.svelte";

  export const closeModal = (getContext("svelte-helpers-modal") as any).closeModal;
</script>

<hr class="my-3" />
{#if $$slots.default}
  <slot />
{:else}
  <Button on:click={closeModal}>Close</Button>
{/if}
