<script lang="ts">
  import Modal from "../ui/Modal.svelte";
  import EditBook from "./EditBook.svelte";

  export let book;
  export let isOpen = false;
  export let onHide;
  export let saveBook;
</script>

<Modal headerCaption={`Edit: ${book.title}`} deferStateChangeOnClose={true} {isOpen} {onHide} standardFooter={false}>
  <EditBook {book} {saveBook} />
</Modal>
