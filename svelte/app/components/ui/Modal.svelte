<script>
  import Modal from "svelte-helpers/Modal";
  import "css/modal-overrides.scss"

  import StandardModalHeader from "./StandardModalHeader.svelte";

  export let isOpen;
  export let onHide;
  export let headerCaption;
  export let deferStateChangeOnClose;
</script>

<Modal on:close={onHide} open={isOpen} {deferStateChangeOnClose}>
  <div>
    {#if headerCaption}
      <StandardModalHeader caption={headerCaption} {onHide} />
    {/if}
    <slot />
  </div>
</Modal>
