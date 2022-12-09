<script lang="ts">
  import type { Subject, Tag } from "$data/types";
  import Modal from "../ui/Modal.svelte";
  import EditBook from "./EditBook.svelte";

  export let book: any;
  export let isOpen = false;
  export let onHide: any;
  export let tags: Tag[];
  export let subjects: Subject[];
  export let onBookUpdated: (_id: string, updates: any) => void;

  let closeModal: any;
</script>

<Modal headerCaption={`Edit: ${book.title}`} deferStateChangeOnClose={true} {isOpen} {onHide} standardFooter={false} bind:closeModal>
  <EditBook {book} {onBookUpdated} {subjects} {tags} cancel={closeModal} />
</Modal>
