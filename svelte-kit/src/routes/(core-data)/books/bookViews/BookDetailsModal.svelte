<script lang="ts">
  import { getContext } from "svelte";
  import type { Book, Subject, Tag } from "$data/types";

  import Modal from "$lib/components/ui/Modal.svelte";
  import EditBook from "$lib/components/editBook/EditBook.svelte";
  import DisplaySelectedTags from "$lib/components/subjectsAndTags/tags/DisplaySelectedTags.svelte";
  import BookCover from "$lib/components/ui/BookCover.svelte";
  import Button from "$lib/components/ui/Button/Button.svelte";
  import DisplaySelectedSubjects from "$lib/components/subjectsAndTags/subjects/DisplaySelectedSubjects.svelte";

  import { updateSingleObject, type UpdatesTo } from "$lib/state/dataUpdates";
  import { isbn13To10 } from "$lib/util/isbn13to10";

  export let viewingBook: Book | null;
  export let subjects: Subject[];
  export let tags: Tag[];
  export let isOpen = false;
  export let onHide: () => void;
  export let isPublic: boolean;

  $: book = viewingBook || ({} as Book);
  $: isbn10 = book.isbn?.length === 10 ? book.isbn : isbn13To10(book.isbn);

  const booksModuleContext: any = getContext("books-module-context");
  const { onBooksUpdated } = booksModuleContext;

  let editing = false;

  const syncUpdates = (id: number, updates: UpdatesTo<Book>) => {
    book = updateSingleObject(book, updates);
    onBooksUpdated(id, updates);
    editing = false;
  };
</script>

<Modal {isOpen} {onHide} standardFooter={false} headerCaption={book.title} noClose={true} smallerHeader={true}>
  {#if editing}
    <EditBook {book} {subjects} {tags} {syncUpdates} onCancel={() => (editing = false)} />
  {:else}
    <div class="flex flex-row gap-3">
      <div>
        <div>
          <BookCover size="medium" {book} />
        </div>
      </div>
      <div class="flex flex-col gap-1">
        {#if book.publisher || book.publicationDate}
          <div class="flex flex-row gap-2">
            <span>{book.publisher}</span>
            <span>{book.publicationDate}</span>
          </div>
        {/if}
        <div class="grid grid-cols-4 gap-x-4 gap-y-1">
          <span>Tags:</span>

          <div class="col-span-3 self-center">
            {#if book?.tags?.length}
              <DisplaySelectedTags {tags} currentlySelected={book.tags || []} />
            {:else}
              <span style="fontStyle: italic">None</span>
            {/if}
          </div>
          <span>Subjects:</span>
          <div class="col-span-3 self-center">
            {#if book?.subjects?.length}
              <DisplaySelectedSubjects {subjects} currentlySelected={book.subjects || []} />
            {:else}
              <span style="fontStyle: italic">None</span>
            {/if}
          </div>
        </div>
        {#if book.isbn}
          <div class="flex flex-row gap-4">
            <a target="_new" href={`https://www.amazon.com/gp/product/${isbn10}/?tag=zoomiec-20`}>
              <i class="fab fa-amazon" />
            </a>
            <a target="_new" href={`https://www.goodreads.com/book/isbn/${isbn10}`}>
              <i class="fab fa-goodreads-g" />
            </a>
          </div>
        {/if}
        {#if !isPublic}
          <div style="margin-top: auto">
            <Button size="sm" class="gap-2" on:click={() => (editing = true)}>
              <span>Edit book</span>
              <i class="fal fa-pencil-alt" />
            </Button>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</Modal>
