<script lang="ts">
  import Modal from "../ui/Modal.svelte";
  import EditBook from "./EditBook.svelte";

  export let book;
  export let isOpen = false;
  export let onHide;
  export let saveBook;

  let closeModal;
  const runSave = book => {
    saveBook(book).then(closeModal);
  };
</script>

<Modal headerCaption={`Edit: ${book.title}`} deferStateChangeOnClose={true} {isOpen} {onHide} standardFooter={false} bind:closeModal>
  <EditBook {book} saveBook={runSave} cancel={closeModal} />
</Modal>
