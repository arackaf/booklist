<script lang="ts">
  import ajaxUtil from "util/ajaxUtil";
  import { needBookCoverPriming } from "util/localStorage";

  import Modal from "../ui/Modal.svelte";
  import EditBook from "./EditBook.svelte";

  export let book;
  export let isOpen = false;
  export let onHide;
  export let saveBook;

  $: {
    if (isOpen && needBookCoverPriming()) {
      ajaxUtil.postWithCors(process.env.UPLOAD_BOOK_COVER, { avoidColdStart: true });
      ajaxUtil.postWithCors(process.env.UPLOAD_BOOK_COVER_FROM_URL, { avoidColdStart: true });
    }
  }

  export let onSave = () => {};
  let closeModal;
  const runSave = book => {
    saveBook(book).then(onSave);
  };
</script>

<Modal headerCaption={`Edit: ${book.title}`} deferStateChangeOnClose={true} {isOpen} {onHide} standardFooter={false} bind:closeModal>
  <EditBook {book} saveBook={runSave} cancel={closeModal} />
</Modal>
