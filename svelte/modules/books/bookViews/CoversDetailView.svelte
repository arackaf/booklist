<script lang="ts">
  import { getContext } from "svelte";
  import Modal from "app/components/ui/Modal.svelte";
  import CoverSmall from "app/components/bookCovers/CoverSmall.svelte";
  import EditBook from "app/components/editBook/EditBook.svelte";
  import Stack from "app/components/layout/Stack.svelte";
  import FlowItems from "app/components/layout/FlowItems.svelte";
  import DisplaySelectedTags from "app/components/subjectsAndTags/tags/DisplaySelectedTags.svelte";

  export let book: any;
  export let isOpen = false;
  export let onHide;

  let closeModal;

  const booksModuleContext: any = getContext("books-module-context");
  const { saveEditingBook } = booksModuleContext;

  const doSave = book => {
    saveEditingBook(book).then(closeModal);
  };

  let editing = false;
</script>

<style>
  h3 {
    font-size: 18px;
    margin-bottom: 10px;
  }
</style>

<Modal
  {isOpen}
  {onHide}
  deferStateChangeOnClose={true}
  standardFooter={false}
  bind:closeModal
  headerCaption={book.title}
  noClose={true}
  smallerHeader={true}
>
  {#if editing}
    <EditBook {book} saveBook={doSave} cancel={() => (editing = false)} />
  {:else}
    <div style="display: flex; align-items: top">
      <div>
        <div>
          <CoverSmall url={book?.mediumImage} />
        </div>
      </div>
      <Stack tighter={true} style="padding-left: 10px">
        {#if book.publisher || book.publicationDate}
          <FlowItems tightest={true}>
            <span>{book.publisher}</span>
            <span>{book.publicationDate}</span>
          </FlowItems>
        {/if}
        <FlowItems>
          <div class="overlay-holder">
            <span>Tags:</span>
            <span style="visibility: hidden">Subjects:</span>
          </div>
          {#if book?.tags?.length}
            <DisplaySelectedTags currentlySelected={book.tags || []} />
          {:else}
            <span style="fontStyle: italic">None</span>
          {/if}
        </FlowItems>
        <FlowItems>
          <div class="overlay-holder">
            <span>Subjects:</span>
          </div>
          {#if book?.subjects?.length}
            <DisplaySelectedTags currentlySelected={book.subjects || []} />
          {:else}
            <span style="fontStyle: italic">None</span>
          {/if}
        </FlowItems>
        {#if book.isbn}
          <FlowItems tighter={true}>
            <a target="_new" href={`https://www.amazon.com/gp/product/${book.isbn}/?tag=zoomiec-20`}>
              <i class="fab fa-amazon" />
            </a>
            <a target="_new" href={`https://www.goodreads.com/book/isbn/${book.isbn}`}>
              <i class="fab fa-goodreads-g" />
            </a>
          </FlowItems>
        {/if}

        <div style="margin-top: auto">
          <button class="btn btn-xs" on:click={() => (editing = true)}>Edit book <i class="fal fa-pencil-alt" /></button>
        </div>
      </Stack>
    </div>
  {/if}
</Modal>
