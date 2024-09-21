<script lang="ts">
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
  };

  let { isOpen, onHide, headerCaption = "", standardFooter = true, smallerHeader = false, openFocus = null }: Props = $props();

  let el = $state<HTMLDivElement>(null as any);
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
  <AlertDialog.Trigger asChild />

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
