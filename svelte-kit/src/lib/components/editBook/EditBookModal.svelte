<script lang="ts">
  import type { Book, Subject, Tag } from "$data/types";
  import type { UpdatesTo } from "$lib/state/dataUpdates";
  import Modal from "../ui/Modal.svelte";
  import EditBook from "./EditBook.svelte";

  export let book: any;
  export let isOpen = false;
  export let onHide: any;
  export let tags: Tag[];
  export let subjects: Subject[];
  export let onBookUpdated: (_id: string, updates: UpdatesTo<Book>) => void;

  let closeModal: any;
</script>

<Modal headerCaption={`Edit: ${book?.title}`} {isOpen} {onHide} standardFooter={false} bind:closeModal>
  <EditBook {book} {onBookUpdated} {subjects} {tags} cancel={closeModal} />
</Modal>
