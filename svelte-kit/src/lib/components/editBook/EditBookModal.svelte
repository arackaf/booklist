<script lang="ts">
  import type { Tag } from "$data/types";
  import Modal from "../ui/Modal.svelte";
  import EditBook from "./EditBook.svelte";

  export let book: any;
  export let isOpen = false;
  export let onHide: any;
  export let tags: Tag[];

  let closeModal: any;
</script>

<Modal headerCaption={`Edit: ${book.title}`} deferStateChangeOnClose={true} {isOpen} {onHide} standardFooter={false} bind:closeModal>
  <EditBook {book} {tags} cancel={closeModal} />
</Modal>
