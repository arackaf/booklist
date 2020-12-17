<script>
  import { getContext } from "svelte";
  import Button from "../buttons/Button.svelte";

  let { closeModal } = getContext("svelte-helpers-modal");
</script>

<hr />
{#if $$slots.default}
  <slot />
{:else}
  <Button onClick={closeModal}>Close</Button>
{/if}
