<script lang="ts">
  import type { Snippet } from "svelte";
  import * as AlertDialog from "$lib/components/ui/alert-dialog";
  import ModalContents from "./ModalContents.svelte";
  import StandardModalHeader from "./StandardModalHeader.svelte";
  import StandardModalFooter from "./StandardModalFooter.svelte";

  type Props = {
    isOpen: boolean;
    onHide: () => void;
    headerCaption?: string;
    standardFooter?: boolean;
    smallerHeader?: boolean;
    openFocus?: HTMLElement | null;
    children: Snippet;
  };

  let { isOpen, onHide, headerCaption = "", standardFooter = true, smallerHeader = false, openFocus = null, children }: Props = $props();
</script>

<AlertDialog.Root
  bind:open={isOpen}
  onOpenChange={open => {
    console.log({ open });
    if (!open) {
      onHide();
    }
  }}
>
  <AlertDialog.Content interactOutsideBehavior="close" onOpenAutoFocus={() => openFocus?.focus()} class="translate-y-[0] top-16 pb-5">
    <AlertDialog.Header>
      <AlertDialog.Title>
        <StandardModalHeader caption={headerCaption} smaller={smallerHeader} {onHide} />
      </AlertDialog.Title>
    </AlertDialog.Header>
    <AlertDialog.Description>
      <ModalContents>{@render children()}</ModalContents>
      {#if standardFooter}
        <StandardModalFooter {onHide} />
      {/if}
    </AlertDialog.Description>
  </AlertDialog.Content>
</AlertDialog.Root>
