<script lang="ts">
  import Modal from "../ui/Modal.svelte";
  import EditBook from "./EditBook.svelte";

  export let book: any;
  export let isOpen = false;
  export let onHide: any;

  let closeModal: any;
</script>

<Modal headerCaption={`Edit: ${book.title}`} deferStateChangeOnClose={true} {isOpen} {onHide} standardFooter={false} bind:closeModal>
  <EditBook {book} cancel={closeModal} />
</Modal>
