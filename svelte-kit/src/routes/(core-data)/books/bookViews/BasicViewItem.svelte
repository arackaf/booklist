<script lang="ts">
  import { getContext } from "svelte";
  import type { Book } from "$data/types";

  import BookCover from "$lib/components/ui/BookCover.svelte";
  import FlowItems from "$lib/components/layout/FlowItems.svelte";
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";

  import { page } from "$app/stores";
  import { runDelete } from "$lib/state/dataUpdates";
  import { enhance } from "$app/forms";
  import { selectionState } from "../state/selectionState";

  export let book: Book;
  export let isPublic: boolean;

  const booksModuleContext: any = getContext("books-module-context");
  const { editBook } = booksModuleContext;

  let pendingDelete = false;
  let deleting = false;

  const deleteBook = () => {
    deleting = true;

    return async ({ result }: any) => {
      deleting = false;
      pendingDelete = false;

      if (result.data.success) {
        runDelete($page.data.books, book.id);
        $page.data.totalBooks.update((x: number) => x - 1);
        selectionState.unSelectBook(book.id);
      }
    };
  };
</script>

<div class="listGroupItem">
  <div style="display: flex">
    <div style="margin-right: 5px; min-width: 55px">
      <BookCover size="mobile" {book} />
    </div>
    <div style="overflow: hidden">
      <div style="display: flex; flex-direction: column; height: 100%">
        <div class="listGroupItemHeading book-title">{book.title}</div>
        <span class="listGroupItemText book-author">{book.authors.length ? book.authors.join(", ") : ""}</span>
        <FlowItems style="margin-top: auto;" class="padding-top-xs">
          {#if !isPublic}
            <button class="btn btn-xxs btn-light btn-square-icon" aria-label="Edit book" on:click={() => editBook(book)}>
              <i class="fal fa-fw fa-pencil-alt" />
            </button>
            <button class="btn btn-xxs btn-light btn-square-icon margin-left" aria-label="Delete book" on:click={() => (pendingDelete = true)}>
              <i class="far fa-fw fa-trash" />
            </button>
          {/if}
          {#if pendingDelete}
            <form method="POST" action="?/deleteBook" use:enhance={deleteBook} style="display: flex;">
              <input type="hidden" name="id" value={book.id} />
              <ActionButton isRunning={deleting} text="Confirm Delete" runningText="Deleting" class="margin-left btn btn-xxs btn-danger no-border">
                Confirm Delete
              </ActionButton>
            </form>
          {/if}
          {#if pendingDelete}
            <button on:click={() => (pendingDelete = false)} disabled={deleting} class="margin-left btn btn-xxs no-border"> Cancel </button>
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
