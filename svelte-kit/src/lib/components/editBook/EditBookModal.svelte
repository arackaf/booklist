<script lang="ts">
  import type { Book, Subject, Tag } from "$data/types";
  import type { UpdatesTo } from "$lib/state/dataUpdates";

  import EditBook from "./EditBook.svelte";

  import Modal from "../Modal.svelte";

  export let book: any;
  export let isOpen = false;
  export let onHide: any;
  export let tags: Tag[];
  export let subjects: Subject[];
  export let onSave: (id: number, updates: UpdatesTo<Book>) => void = () => {};
  export let closeOnSave: boolean = false;
  export let header: string;

  export let afterDelete: (id: number) => void = () => {};

  let editBookInst: EditBook;

  const syncUpdates = (id: number, updates: UpdatesTo<Book>) => {
    onSave(id, updates);
    if (closeOnSave) {
      onHide();
    }
  };

  function onDeleteComplete() {
    afterDelete?.(book.id);
    onHide();
  }
</script>

<Modal on:mount={() => editBookInst.reset()} headerCaption={header} {isOpen} {onHide} standardFooter={false}>
  {#key book}
    <EditBook bind:this={editBookInst} {book} {syncUpdates} onCancel={onHide} {subjects} {tags} afterDelete={onDeleteComplete} />
  {/key}
</Modal>
