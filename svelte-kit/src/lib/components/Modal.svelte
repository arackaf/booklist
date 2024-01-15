<script lang="ts">
  import * as AlertDialog from "$lib/components/ui/alert-dialog";
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

  function onChange(open: boolean) {
    if (!open) {
      onHide();
    }
  }
</script>

<AlertDialog.Root bind:open={isOpen} closeOnOutsideClick={true} onOpenChange={onChange}>
  <AlertDialog.Trigger asChild let:builder />

  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>Are you absolutely sure?</AlertDialog.Title>
      <AlertDialog.Description>
        This action cannot be undone. This will permanently delete your account and remove your data from our servers.
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Cancel</AlertDialog.Cancel>
      <AlertDialog.Action>Continue</AlertDialog.Action>
    </AlertDialog.Footer>
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
