<script lang="ts">
  import Modal from "svelte-helpers/Modal.svelte";
  import "css/modal-overrides.scss";

  import StandardModalHeader from "./StandardModalHeader.svelte";
  import StandardModalFooter from "./StandardModalFooter.svelte";

  export let isOpen;
  export let onHide;
  export let headerCaption = "";
  export let deferStateChangeOnClose = false;
  export let standardFooter = true;
  export let closeModal = null;
  export let onModalMount = null;
  export let noClose = false;
  export let smallerHeader = false;
</script>

<Modal on:close={onHide} on:mount={() => onModalMount?.()} open={isOpen} {deferStateChangeOnClose} bind:closeModal>
  <div>
    {#if headerCaption}
      <StandardModalHeader caption={headerCaption} smaller={smallerHeader} {noClose} />
    {/if}
    <slot />
    {#if standardFooter}
      <StandardModalFooter />
    {/if}
  </div>
</Modal>
