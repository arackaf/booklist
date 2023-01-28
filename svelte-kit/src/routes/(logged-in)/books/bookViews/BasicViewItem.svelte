<script lang="ts">
  import { getContext } from "svelte";
  import type { Book } from "$data/types";

  import BookCover from "$lib/components/ui/BookCover.svelte";
  import FlowItems from "$lib/components/layout/FlowItems.svelte";
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";

  export let book: Book;
  export let isPublic: boolean;

  const booksModuleContext: any = getContext("books-module-context");
  const { editBook, deleteBook } = booksModuleContext;

  let pendingDelete = false;

  let deleting = false;
  const doDelete = () => {
    deleting = true;
    deleteBook({ _id: book._id });
  };
</script>

<div class="listGroupItem">
  <div style="display: flex">
    <div style="margin-right: 5px; min-width: 55px">
      <BookCover size="mobile" url={book.mobileImage} preview={book.mobileImagePreview} />
    </div>
    <div style="overflow: hidden">
      <div style="display: flex; flex-direction: column; height: 100%">
        <div class="listGroupItemHeading bookTitle">{book.title}</div>
        <span class="listGroupItemText bookAuthor">{book.authors.length ? book.authors.join(", ") : ""}</span>
        <FlowItems style="margin-top: auto">
          {#if !isPublic}
            <button class="btn btn-xs btn-light btn-square-icon" on:click={() => editBook(book)}><i class="fal fa-fw fa-pencil-alt" /></button>
            <button class="btn btn-xs btn-light btn-square-icon margin-left" on:click={() => (pendingDelete = true)}>
              <i class="far fa-fw fa-trash" />
            </button>
          {/if}
          {#if pendingDelete}
            <ActionButton text="Confirm Delete" runningText="Deleting" onClick={doDelete} class="margin-left btn btn-xxs btn-danger">
              Confirm Delete
            </ActionButton>
          {/if}
          {#if pendingDelete}
            <button on:click={() => (pendingDelete = false)} disabled={deleting} class="margin-left btn btn-xxs"> Cancel </button>
          {/if}
        </FlowItems>
      </div>
    </div>
  </div>
</div>

<style>
  :global(.listGroupItemHeading) {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    width: 100%;
  }

  :global(.listGroupItemHeading),
  :global(.listGroupItemText) {
    margin: 0;
  }

  :global(.listGroupItem) {
    border-bottom: var(--default-border-width) solid var(--neutral-border);
    padding-top: 5px;
    padding-bottom: 5px;
  }
</style>
