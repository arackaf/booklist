<script lang="ts">
  import type { Book, Subject, Tag } from "$data/types";
  import type { UpdatesTo } from "$lib/state/dataUpdates";

  import EditBook from "./EditBook.svelte";
  import Modal from "../Modal.svelte";

  type Props = {
    book: any;
    isOpen: boolean;
    onHide: any;
    tags: Tag[];
    subjects: Subject[];
    onSave?: (id: number, updates: UpdatesTo<Book>) => void;
    closeOnSave?: boolean;
    header: string;
    afterDelete?: (id: number) => void;
  };

  let { book, isOpen, onHide, tags, subjects, onSave = () => {}, closeOnSave = false, header, afterDelete = () => {} }: Props = $props();

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

  let editingBook = $derived(book ? $state.snapshot(book) : book);
</script>

<Modal headerCaption={header} {isOpen} {onHide} standardFooter={false}>
  <EditBook book={editingBook} {syncUpdates} onCancel={onHide} {subjects} {tags} afterDelete={onDeleteComplete} />
</Modal>
