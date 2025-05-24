<script lang="ts">
  import type { Snippet } from "svelte";
  import * as Dialog from "$lib/components/ui/dialog";
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

<Dialog.Root
  bind:open={isOpen}
  onOpenChange={open => {
    console.log({ open });
    if (!open) {
      onHide();
    }
  }}
>
  <Dialog.Content
    interactOutsideBehavior="close"
    onOpenAutoFocus={() => openFocus?.focus()}
    class="translate-y-[0] top-8 sm:top-16 p-5 pt-6 overflow-auto"
  >
    <Dialog.Header class="px-1">
      <Dialog.Title>
        <StandardModalHeader caption={headerCaption} smaller={smallerHeader} {onHide} />
      </Dialog.Title>
    </Dialog.Header>
    <Dialog.Description>
      <ModalContents>{@render children()}</ModalContents>
      {#if standardFooter}
        <StandardModalFooter {onHide} />
      {/if}
    </Dialog.Description>
  </Dialog.Content>
</Dialog.Root>
