<script lang="ts">
  import type { Book, Subject, Tag } from "$data/types";
  import type { UpdatesTo } from "$lib/state/dataUpdates";

  import EditBook from "./EditBook.svelte";

  import Modal from "../ui/Modal.svelte";

  export let book: any;
  export let isOpen = false;
  export let onHide: any;
  export let tags: Tag[];
  export let subjects: Subject[];
  export let onBookUpdated: (_id: string, updates: UpdatesTo<Book>) => void = () => {};

  let closeModal: any;
  let resetBookEditTabs: () => null;

  $: {
    if (isOpen) {
      resetBookEditTabs();
    }
  }
</script>

<Modal headerCaption={`Edit: ${book?.title}`} {isOpen} {onHide} standardFooter={false} bind:closeModal>
  <EditBook bind:reset={resetBookEditTabs} {book} {onBookUpdated} onCancel={onHide} {subjects} {tags} />
</Modal>
