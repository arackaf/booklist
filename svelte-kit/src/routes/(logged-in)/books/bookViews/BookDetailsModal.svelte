<script lang="ts">
  import { getContext } from "svelte";
  import type { Book, Subject, Tag } from "$data/types";

  import Modal from "$lib/components/ui/Modal.svelte";
  import EditBook from "$lib/components/editBook/EditBook.svelte";
  import Stack from "$lib/components/layout/Stack.svelte";
  import FlowItems from "$lib/components/layout/FlowItems.svelte";
  import DisplaySelectedTags from "$lib/components/subjectsAndTags/tags/DisplaySelectedTags.svelte";
  import BookCover from "$lib/components/ui/BookCover.svelte";
  import DisplaySelectedSubjects from "$lib/components/subjectsAndTags/subjects/DisplaySelectedSubjects.svelte";
  import { updateSingleObject, type UpdatesTo } from "$lib/state/dataUpdates";

  export let viewingBook: Book | null;
  export let subjects: Subject[];
  export let tags: Tag[];
  export let isOpen = false;
  export let onHide: () => void;
  export let isPublic: boolean;

  $: book = viewingBook || ({} as Book);

  let closeModal: () => void;

  const booksModuleContext: any = getContext("books-module-context");
  const { onBooksUpdated } = booksModuleContext;

  let editing = false;

  const syncUpdates = (_id: string, updates: UpdatesTo<Book>) => {
    book = updateSingleObject(book, updates);
    onBooksUpdated(_id, updates);
    editing = false;
  };
</script>

<Modal {isOpen} {onHide} standardFooter={false} bind:closeModal headerCaption={book.title} noClose={true} smallerHeader={true}>
  {#if editing}
    <EditBook {book} {subjects} {tags} {syncUpdates} onCancel={() => (editing = false)} />
  {:else}
    <div style="display: flex; align-items: top">
      <div>
        <div>
          <BookCover size="medium" preview={book?.mediumImagePreview} url={book?.mediumImage} />
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
            <DisplaySelectedTags {tags} currentlySelected={book.tags || []} />
          {:else}
            <span style="fontStyle: italic">None</span>
          {/if}
        </FlowItems>
        <FlowItems>
          <div class="overlay-holder">
            <span>Subjects:</span>
          </div>
          {#if book?.subjects?.length}
            <DisplaySelectedSubjects {subjects} currentlySelected={book.subjects || []} />
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

        {#if !isPublic}
          <div style="margin-top: auto">
            <button class="btn btn-xs" on:click={() => (editing = true)}>Edit book <i class="fal fa-pencil-alt" /></button>
          </div>
        {/if}
      </Stack>
    </div>
  {/if}
</Modal>
