<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Modal from "svelte-helpers/Modal.svelte";

  import StandardModalHeader from "./StandardModalHeader.svelte";
  import StandardModalFooter from "./StandardModalFooter.svelte";

  export let isOpen: boolean;
  export let onHide: () => void;
  export let headerCaption = "";
  export let deferStateChangeOnClose = false;
  export let standardFooter = true;
  export let smallerHeader = false;

  const dispatch = createEventDispatcher();

  function onMount() {
    dispatch("mount");
  }
</script>

<Modal on:mount={onMount} on:close={onHide} on:closed={() => dispatch("closed")} open={isOpen} {deferStateChangeOnClose}>
  <div>
    {#if headerCaption}
      <StandardModalHeader caption={headerCaption} smaller={smallerHeader} />
    {/if}
    <slot />
    {#if standardFooter}
      <StandardModalFooter />
    {/if}
  </div>
</Modal>
