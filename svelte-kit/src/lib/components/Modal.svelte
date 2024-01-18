<script lang="ts">
  import * as AlertDialog from "$lib/components/ui/alert-dialog";

  import ModalContents from "./ModalContents.svelte";

  import StandardModalHeader from "./StandardModalHeader.svelte";
  import StandardModalFooter from "./StandardModalFooter.svelte";

  export let isOpen: boolean;
  export let onHide: () => void;
  export let headerCaption = "";
  export let deferStateChangeOnClose = false;
  export let standardFooter = true;
  export let smallerHeader = false;

  function onChange(open: boolean) {
    if (!open) {
      onHide();
    }
  }

  $: {
    if (isOpen) {
      onChange(true);
    }
  }

  let el: HTMLDivElement;

  $: {
    if (el) {
      el.addEventListener("click", onHide);
    }
  }
</script>

<AlertDialog.Root bind:open={isOpen} closeOnOutsideClick={false}>
  <AlertDialog.Trigger asChild let:builder />

  <AlertDialog.Content bind:el class="translate-y-[0] top-16 pb-5">
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
