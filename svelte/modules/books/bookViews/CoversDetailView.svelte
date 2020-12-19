<script lang="ts">
  //import { closeModal } from "svelte-helpers/Modal";
  import Modal from "app/components/ui/Modal.svelte";
  import CoverSmall from "app/components/bookCovers/CoverSmall.svelte";
  import { getContext, tick } from "svelte";

  export let book: any;
  export let isOpen = false;
  export let onHide;

  let closeModal;

  const booksModuleContext: any = getContext("books-module-context");
  const { editBook } = booksModuleContext;

  const edit = () => {
    closeModal();
    editBook(book);
  };
</script>

<style>
  h3 {
    font-size: 18px;
    margin-bottom: 10px;
  }
</style>

<Modal {isOpen} {onHide} deferStateChangeOnClose={true} standardFooter={false} bind:closeModal>
  <div style="display: flex; align-items: top">
    <div>
      <div style="width: 106px">
        <CoverSmall url={book?.mediumImage} />
      </div>
    </div>
    <div style="padding-left: 10px">
      <h3 style="margin-top: 0">{book.title}</h3>
      {#if book.publisher || book.publicationDate}
        <div><span>{book.publisher}</span> <span style="padding-left: 10px">{book.publicationDate}</span></div>
      {/if}
      {#if book.isbn}
        <div>{book.isbn}</div>
      {/if}
      <div class="margin-top margin-bottom"><button class="btn btn-xs" on:click={edit}> Edit book <i class="fal fa-pencil-alt" /></button></div>
    </div>
  </div>
</Modal>
