<script lang="ts">
  import ajaxUtil from "util/ajaxUtil";
  import { needBookCoverPriming } from "util/localStorage";

  import Modal from "../ui/Modal.svelte";
  import EditBook from "./EditBook.svelte";

  export let book;
  export let isOpen = false;
  export let onHide;
  export let saveBook;

  const prepBookForSaving = book => {
    let propsToUpdate = ["title", "isbn", "smallImage", "pages", "publisher", "publicationDate", "authors", "subjects", "tags"];
    let pages = parseInt(book.pages, 10);
    book.pages = isNaN(pages) ? null : pages;

    return propsToUpdate.reduce((obj, prop) => ((obj[prop] = book[prop]), obj), {});
  };

  $: {
    if (isOpen && needBookCoverPriming()) {
      ajaxUtil.postWithCors(process.env.UPLOAD_BOOK_COVER, { avoidColdStart: true });
      ajaxUtil.postWithCors(process.env.UPLOAD_BOOK_COVER_FROM_URL, { avoidColdStart: true });
    }
  }

  let closeModal;
  const runSave = book => {
    saveBook(prepBookForSaving(book)).then(closeModal);
  };
</script>

<Modal headerCaption={`Edit: ${book.title}`} deferStateChangeOnClose={true} {isOpen} {onHide} standardFooter={false} bind:closeModal>
  <EditBook {book} saveBook={runSave} cancel={closeModal} />
</Modal>
