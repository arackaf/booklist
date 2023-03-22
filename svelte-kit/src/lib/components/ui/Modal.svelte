<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import Modal from "svelte-helpers/Modal.svelte";
  import "$styles/modal-overrides.scss";

  import StandardModalHeader from "./StandardModalHeader.svelte";
  import StandardModalFooter from "./StandardModalFooter.svelte";

  export let isOpen: boolean;
  export let onHide: () => void;
  export let headerCaption = "";
  export let deferStateChangeOnClose = false;
  export let standardFooter = true;
  export let onModalMount: (() => void) | null = null;
  export let noClose = false;
  export let smallerHeader = false;

  const dispatch = createEventDispatcher();

  function onMount() {
    // TODO: remove
    onModalMount?.();
    dispatch("mount");
  }
</script>

<Modal on:close={onHide} on:mount={onMount} open={isOpen} {deferStateChangeOnClose}>
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
