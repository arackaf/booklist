<script lang="ts">
  import * as AlertDialog from "$lib/components/ui/alert-dialog";
  import { createEventDispatcher } from "svelte";
  import Modal from "svelte-helpers/Modal.svelte";
  import ModalContents from "./ModalContents.svelte";

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

  function onChange(open: boolean) {
    if (!open) {
      onHide();
    }
  }
</script>

<AlertDialog.Root bind:open={isOpen} closeOnOutsideClick={true} onOpenChange={onChange}>
  <AlertDialog.Trigger asChild let:builder />

  <AlertDialog.Content class="translate-y-[0] top-16 pb-5">
    <AlertDialog.Header>
      <AlertDialog.Title>
        <StandardModalHeader caption={headerCaption} smaller={smallerHeader} {onHide} />
      </AlertDialog.Title>
    </AlertDialog.Header>
    <AlertDialog.Description>
      <ModalContents>
        <slot />
      </ModalContents>
      {#if standardFooter}
        <StandardModalFooter {onHide} />
      {/if}
    </AlertDialog.Description>
  </AlertDialog.Content>
</AlertDialog.Root>

<!-- <Modal on:mount={onMount} on:close={onHide} on:closed={() => dispatch("closed")} open={isOpen} {deferStateChangeOnClose}>
  <div>
    {#if headerCaption}
      <StandardModalHeader caption={headerCaption} smaller={smallerHeader} />
    {/if}
    <slot />
    {#if standardFooter}
      <StandardModalFooter />
    {/if}
  </div>
</Modal> -->
