<script lang="ts">
  import { getContext } from "svelte";
  import CoverSmall from "app/components/bookCovers/CoverSmall.svelte";

  import ActionButton from "app/components/buttons/ActionButton.svelte";
  import FlowItems from "app/components/layout/FlowItems.svelte";

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

<div class="listGroupItem">
  <div style="display: flex">
    <div style="margin-right: 5px; min-width: 55px">
      <CoverSmall url={book.smallImage} preview={book.smallImagePreview} />
    </div>
    <div style="overflow: hidden">
      <div style="display: flex; flex-direction: column; height: 100%">
        <div class="listGroupItemHeading bookTitle">{book.title}</div>
        <span class="listGroupItemText bookAuthor">{book.authors.length ? book.authors.join(", ") : ""}</span>
        <FlowItems style="margin-top: auto">
          {#if !isPublic && online}
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
