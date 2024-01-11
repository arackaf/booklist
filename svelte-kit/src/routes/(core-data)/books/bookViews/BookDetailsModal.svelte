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

<Modal {isOpen} {onHide} standardFooter={false} headerCaption={book.title} noClose={true}>
  {#if editing}
    <EditBook {book} {subjects} {tags} {syncUpdates} onCancel={() => (editing = false)} />
  {:else}
    <div class="flex flex-row gap-3">
      <div>
        <div>
          <BookCover size="medium" {book} />
        </div>
      </div>
      <div class="flex flex-col gap-2">
        {#if book.publisher || book.publicationDate}
          <div class="flex flex-row gap-2">
            <span>{book.publisher}</span>
            <span>{book.publicationDate}</span>
          </div>
        {/if}

        <div class="grid grid-cols-1 md:grid-cols-[auto_minmax(0,1fr)] gap-x-2 gap-y-0 md:gap-y-2 mb-2">
          <span class="self-center">Tags:</span>

          <div class="self-center">
            {#if book?.tags?.length}
              <DisplaySelectedTags {tags} currentlySelected={book.tags || []} />
            {:else}
              <span style="fontStyle: italic">None</span>
            {/if}
          </div>

          <span class="self-center mt-2 md:mt-0">Subjects:</span>
          <div class="self-center">
            {#if book?.subjects?.length}
              <DisplaySelectedSubjects {subjects} currentlySelected={book.subjects || []} />
            {:else}
              <span style="fontStyle: italic">None</span>
            {/if}
          </div>
        </div>

        {#if !isPublic}
          <div style="margin-top: auto">
            <div class="flex gap-5 items-center">
              {#if book.isbn}
                <a target="_new" href={`https://www.amazon.com/gp/product/${isbn10}/?tag=zoomiec-20`}>
                  <i class="fab fa-amazon" />
                </a>
                <a target="_new" href={`https://www.goodreads.com/book/isbn/${isbn10}`}>
                  <i class="fab fa-goodreads-g" />
                </a>
              {/if}
              <Button size="sm" class="gap-2" on:click={() => (editing = true)}>
                <span>Edit book</span>
                <i class="fal fa-pencil-alt" />
              </Button>
            </div>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</Modal>
