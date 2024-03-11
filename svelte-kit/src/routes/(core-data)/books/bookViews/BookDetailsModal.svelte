<script lang="ts">
  import { getContext } from "svelte";
  import type { Book, BookDetails, Subject, Tag } from "$data/types";

  import Modal from "$lib/components/Modal.svelte";
  import EditBook from "$lib/components/editBook/EditBook.svelte";
  import DisplaySelectedTags from "$lib/components/subjectsAndTags/tags/DisplaySelectedTags.svelte";
  import BookCover from "$lib/components/BookCover.svelte";
  import Button from "$lib/components/Button/Button.svelte";
  import DisplaySelectedSubjects from "$lib/components/subjectsAndTags/subjects/DisplaySelectedSubjects.svelte";

  import { updateSingleObject, type UpdatesTo } from "$lib/state/dataUpdates";
  import { isbn13To10 } from "$lib/util/isbn13to10";
  import SlideAnimate from "$lib/util/SlideAnimate.svelte";

  import { afterDelete as updateStateAfterDelete } from "../state/onDelete";

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

  let expanded = false;
  $: detailsBtnClass = expanded ? "fa-angle-double-up" : "fa-angle-double-down";

  let bookDetails: BookDetails | null;
  $: ({ editorialReviews, similarBooks } = bookDetails || ({} as any));
  let detailsLoading = false;

  $: {
    if (book) {
      bookDetails = null;
      expanded = false;
    }
  }

  function toggleDetails() {
    if (expanded) {
      expanded = false;
    } else {
      if (bookDetails) {
        expanded = true;
      } else {
        detailsLoading = true;
        fetch("/api/book-details?id=" + book.id)
          .then(resp => resp.json())
          .then(details => {
            bookDetails = details;
            detailsLoading = false;
            expanded = true;
          });
      }
    }
  }

  $: afterDelete = () => {
    updateStateAfterDelete(book.id);
    onHide();
  };
</script>

<Modal {isOpen} {onHide} standardFooter={false} headerCaption={book.title}>
  {#if editing}
    <EditBook {book} {subjects} {tags} {syncUpdates} onCancel={() => (editing = false)} {afterDelete} />
  {:else}
    <div class="flex flex-col max-h-[min(550px,80vh)]">
      <div class="flex flex-col gap-2 pb-1">
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
        <Button on:click={toggleDetails} disabled={detailsLoading} size="sm" class="flex gap-1 items-center self-start text-sm">
          <span>Details</span><i class="far {detailsBtnClass}" />
        </Button>
      </div>
      <div class="overflow-auto">
        <SlideAnimate open={expanded}>
          <div class="p-2">
            <div>
              {#if !editorialReviews || !editorialReviews.length}
                <h4>No editorial reviews for this book</h4>
              {:else}
                <div>
                  {#each editorialReviews as review, index}
                    <div>
                      {#if index > 0}
                        <hr style="border: 2px solid #eee" />
                      {/if}
                      <div class="flex flex-col">
                        <span class="text-base">{review.source || "<unknown source>"}</span>
                        <div>
                          {@html review.content}
                        </div>
                      </div>
                    </div>
                  {/each}
                  <br />
                </div>
              {/if}
            </div>

            <div>
              {#if !similarBooks || !similarBooks.length}
                <h4>No similar items found for this book</h4>
              {:else}
                <div>
                  <div class="flex flex-col">
                    <span class="text-base">Similar Books</span>
                    <table class="table table-condensed w-full max-w-full text-sm" style="backgroundColor: transparent">
                      <tbody>
                        {#each similarBooks as book}
                          <tr>
                            <td>
                              {#if book.smallImage}
                                <BookCover size="small" {book} />
                              {/if}
                            </td>
                            <td>
                              <span style="font-weight: bold">{book.title}</span>
                              <br />
                              {#if book.authors?.length}
                                <span style="font-style: italic">{book.authors.join(", ")}</span>
                                <br />
                              {/if}
                              <a target="_new" style="color: black" href={`https://www.amazon.com/gp/product/${book.isbn}/?tag=zoomiec-20`}>
                                <i class="fab fa-amazon" />
                              </a>
                            </td>
                          </tr>
                        {/each}
                      </tbody>
                    </table>
                  </div>
                </div>
              {/if}
            </div>
          </div>
        </SlideAnimate>
      </div>
    </div>
  {/if}
</Modal>
