<script>
  import { getContext } from "svelte";
  import Button from "../buttons/Button.svelte";

  export const closeModal = getContext("svelte-helpers-modal").closeModal;
</script>

<hr class="my-3" />
{#if $$slots.default}
  <slot />
{:else}
  <Button onClick={closeModal}>Close</Button>
{/if}
