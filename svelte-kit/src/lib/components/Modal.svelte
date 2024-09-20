<script lang="ts">
  import * as AlertDialog from "$lib/components/ui/alert-dialog";

  import ModalContents from "./ModalContents.svelte";

  import StandardModalHeader from "./StandardModalHeader.svelte";
  import StandardModalFooter from "./StandardModalFooter.svelte";

  export let isOpen: boolean;
  export let onHide: () => void;
  export let headerCaption = "";
  export let standardFooter = true;
  export let smallerHeader = false;
  export let openFocus: HTMLElement | null = null;

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
</script>

<AlertDialog.Root
  openFocus={() => openFocus}
  bind:open={isOpen}
  onOpenChange={open => {
    if (!open) {
      onHide();
    }
  }}
  closeOnOutsideClick={true}
>
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
