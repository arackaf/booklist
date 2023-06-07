<script lang="ts">
  import { getContext } from "svelte";
  import type { Book } from "$data/types";

  import BookCover from "$lib/components/ui/BookCover.svelte";
  import Button from "$lib/components/ui/Button/Button.svelte";
  import ActionButton from "$lib/components/ui/Button/ActionButton.svelte";
  import SubTitleText from "$lib/components/ui/BookDisplay/SubTitleText.svelte";

  import { page } from "$app/stores";
  import { runDelete } from "$lib/state/dataUpdates";
  import { enhance } from "$app/forms";
  import { selectionState } from "../state/selectionState";

  export let book: Book;
  export let isPublic: boolean;

  let showActions = false;

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

  function itemClicked(evt: any) {
    const elClicked = evt.target.tagName;
    if (elClicked === "I" || elClicked === "BUTTON") {
      return;
    }

    showActions = !showActions;
  }
</script>

<div class="listGroupItem" on:click={itemClicked} on:keypress={() => {}}>
  <div style="display: flex">
    <div style="margin-right: 5px; min-width: 55px">
      <BookCover size="mobile" {book} />
    </div>
    <div style="overflow: hidden">
      <form method="POST" action="?/deleteBook" use:enhance={deleteBook} style="display: flex;">
        <input type="hidden" name="id" value={book.id} />
        <div style="display: flex; flex-direction: column; height: 100%">
          <span class="text-sm leading-[normal] truncate">{book.title}</span>
          <SubTitleText>{book.authors.length ? book.authors.join(", ") : ""}</SubTitleText>
          {#if showActions}
            <div class="flex flex-row gap-2 mt-auto pt-2">
              {#if !isPublic}
                <Button type="button" theme="primary" size="sm" icon={true} aria-label="Edit book" on:click={() => editBook(book)}>
                  <i class="fal fa-fw fa-pencil-alt" />
                </Button>
                <Button type="button" size="sm" icon={true} aria-label="Delete book" on:click={() => (pendingDelete = true)}>
                  <i class="far fa-fw fa-trash" />
                </Button>
              {/if}
              {#if pendingDelete}
                <ActionButton running={deleting} size="sm" theme="danger">Confirm Delete</ActionButton>
              {/if}
              {#if pendingDelete}
                <Button type="button" size="sm" on:click={() => (pendingDelete = false)} disabled={deleting}>Cancel</Button>
              {/if}
            </div>
          {/if}
        </div>
      </form>
    </div>
  </div>
</div>

<style>
  :global(.listGroupItem) {
    border-bottom: var(--default-border-width) solid var(--neutral-6);
    padding-top: 5px;
    padding-bottom: 5px;
  }
</style>
