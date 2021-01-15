<script lang="ts">
  import { getContext } from "svelte";
  import CoverSmall from "app/components/bookCovers/CoverSmall.svelte";

  import ActionButton from "app/components/buttons/ActionButton.svelte";

  export let book: any;
  export let isPublic;
  export let online;

  const booksModuleContext: any = getContext("books-module-context");
  const { editBook, deleteBook } = booksModuleContext;

  let pendingDelete = false;

  let deleting = false;
  const doDelete = () => {
    deleting = true;
    deleteBook({ _id: book._id });
  };
</script>

<style>
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

<div class="listGroupItem">
  <div style="display: flex">
    <div style="margin-right: 5px; min-width: 55px">
      <CoverSmall url={book.smallImage} />
    </div>
    <div>
      <div style="display: flex; flex-direction: column; height: 100%">
        <div class="listGroupItemHeading bookTitle">{book.title}</div>
        <span class="listGroupItemText bookAuthor">{book.authors.length ? book.authors.join(', ') : ''}</span>
        <div style="margin-top: auto">
          {#if !isPublic && online}
            <button class="btn btn-xs btn-light btn-round-icon" on:click={() => editBook(book)}><i class="fal fa-pencil-alt" /></button>
            <button style="margin-left: 5px;" class="btn btn-xs btn-light btn-round-icon" on:click={() => (pendingDelete = true)}><i
                class="fa fa-fw fa-trash"
              /></button>
          {/if}
          {#if pendingDelete}
            <ActionButton text="Confirm Delete" runningText="Deleting" onClick={doDelete} class="margin-left btn btn-xxs btn-danger">
              Confirm Delete
            </ActionButton>
          {/if}
          {#if pendingDelete}
            <button on:click={() => (pendingDelete = false)} disabled={deleting} class="margin-left btn btn-xxs"> Cancel </button>
          {/if}
        </div>
      </div>
    </div>
  </div>
</div>
