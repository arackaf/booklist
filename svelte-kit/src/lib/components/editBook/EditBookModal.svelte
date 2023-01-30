<script lang="ts">
  import type { Book, Subject, Tag } from "$data/types";
  import { updateSingleObject, type UpdatesTo } from "$lib/state/dataUpdates";

  import EditBook from "./EditBook.svelte";

  import Modal from "../ui/Modal.svelte";

  export let book: any;
  export let isOpen = false;
  export let onHide: any;
  export let tags: Tag[];
  export let subjects: Subject[];
  export let onSave: (_id: string, updates: UpdatesTo<Book>) => void = () => {};
  export let closeOnSave: boolean;

  let closeModal: any;
  let resetBookEditTabs: () => null;

  $: {
    if (isOpen) {
      resetBookEditTabs();
    }
  }

  const syncUpdates = (_id: string, updates: UpdatesTo<Book>) => {
    book = updateSingleObject(book, updates);
    onSave(_id, updates);
    if (closeOnSave) {
      onHide();
    }
  };
</script>

<Modal headerCaption={`Edit: ${book?.title}`} {isOpen} {onHide} standardFooter={false} bind:closeModal>
  <EditBook bind:reset={resetBookEditTabs} {book} {syncUpdates} onCancel={onHide} {subjects} {tags} />
</Modal>
