<script lang="ts">
  import { getContext } from "svelte";
  import type { Book, BookDetails, Subject, Tag } from "$data/types";

  import Button from "$lib/components/ui/button/button.svelte";
  import Separator from "$lib/components/ui/separator/separator.svelte";

  import Modal from "$lib/components/Modal.svelte";
  import EditBook from "$lib/components/editBook/EditBook.svelte";
  import DisplaySelectedTags from "$lib/components/subjectsAndTags/tags/DisplaySelectedTags.svelte";
  import BookCover from "$lib/components/BookCover.svelte";
  import DisplaySelectedSubjects from "$lib/components/subjectsAndTags/subjects/DisplaySelectedSubjects.svelte";

  import { updateSingleObject, type UpdatesTo } from "$lib/state/dataUpdates";
  import { isbn13To10 } from "$lib/util/isbn13to10";
  import SlideAnimate from "$lib/util/SlideAnimate.svelte";

  import { afterDelete as updateStateAfterDelete } from "../state/onDelete";
  import { ChevronsDownIcon, ChevronsUpIcon, PencilIcon } from "lucide-svelte";
  import AmazonIcon from "$lib/svg/AmazonIcon.svelte";
  import GoodreadsIcon from "$lib/svg/GoodreadsIcon.svelte";

  type Props = {
    viewingBook: Book | null;
    subjects: Subject[];
    tags: Tag[];
    isOpen?: boolean;
    onHide: () => void;
    isPublic: boolean;
  };

  let { viewingBook, subjects, tags, isOpen = false, onHide, isPublic }: Props = $props();

  let book = $state<Book>(viewingBook || ({} as Book));
  let isbn10 = $derived(book.isbn?.length === 10 ? book.isbn : isbn13To10(book.isbn));

  const booksModuleContext: any = getContext("books-module-context");
  const { onBooksUpdated } = booksModuleContext;

  let editing = $state(false);
  let expanded = $state(false);
  let detailsLoading = $state(false);
  let bookDetails = $state<BookDetails | null>(null);

  let { editorialReviews, similarBooks } = $derived(bookDetails || ({} as any));

  $effect(() => {
    book = viewingBook || ({} as Book);
  });
  $effect(() => {
    if (book) {
      bookDetails = null;
      expanded = false;
    }
  });

  const syncUpdates = (id: number, updates: UpdatesTo<Book>) => {
    book = updateSingleObject(book, updates);
    onBooksUpdated(id, updates);
    editing = false;
  };

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

  const afterDelete = () => {
    updateStateAfterDelete(book.id);
    onHide();
  };
</script>

<Modal {isOpen} {onHide} onHidden={() => (editing = false)} standardFooter={false} headerCaption={book.title}>
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
            <div class="grid grid-cols-[auto_minmax(0,1fr)] gap-x-2 gap-y-0.5 mb-2">
              {#if book.publisher}
                <span class="self-center">Publisher:</span>
                <span>{book.publisher}{book.publisher && book.publicationDate ? " - " : ""}{book.publicationDate}</span>
              {/if}
              {#if book.isbn}
                <span class="self-center">ISBN:</span>
                <span>{book.isbn}</span>
              {/if}

              <span class="self-center">Tags:</span>
              <div class="self-center">
                {#if book?.tags?.length}
                  <DisplaySelectedTags {tags} currentlySelected={book.tags || []} />
                {:else}
                  <span style="fontStyle: italic">None</span>
                {/if}
              </div>

              <span class="self-center">Subjects:</span>
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
                    <a target="_new" href={`https://www.amazon.com/gp/product/${isbn10}/?tag=zoomiec-20`} aria-label="View on Amazon">
                      <AmazonIcon size={16} />
                    </a>
                    <a target="_new" href={`https://www.goodreads.com/book/isbn/${isbn10}`} aria-label="View on Goodreads">
                      <GoodreadsIcon size={16} />
                    </a>
                  {/if}
                  <Button variant="secondary" class="flex gap-3 h-8" onclick={() => (editing = true)}>
                    <span>Edit book</span>
                    <PencilIcon />
                  </Button>
                </div>
              </div>
            {/if}
          </div>
        </div>
        <Button variant="outline" onclick={toggleDetails} disabled={detailsLoading} class="flex gap-2 items-center self-start h-6">
          <span>Details</span>
          {#if expanded}
            <ChevronsUpIcon />
          {:else}
            <ChevronsDownIcon />
          {/if}
        </Button>
      </div>
      <div class="overflow-auto">
        <SlideAnimate open={expanded}>
          <div class="p-2">
            <div>
              {#if !editorialReviews || !editorialReviews.length}
                <h4 class="text-lg my-2">No editorial reviews for this book</h4>
              {:else}
                <div>
                  {#each editorialReviews as review, index}
                    {#if review?.content}
                      <div>
                        {#if index > 0}
                          <Separator class="my-4 h-[2px]" />
                        {/if}
                        <div class="flex flex-col">
                          <span class="text-base">{review.source || "<unknown source>"}</span>
                          <div>
                            {@html review.content}
                          </div>
                        </div>
                      </div>
                    {/if}
                  {/each}
                  <br />
                </div>
              {/if}
            </div>

            <div>
              {#if !similarBooks || !similarBooks.length}
                <h4 class="text-lg my-2">No similar items found for this book</h4>
              {:else}
                <div class="flex flex-col gap-1">
                  <span class="text-base">Similar Books</span>
                  <div class="flex flex-col gap-2">
                    {#each similarBooks as book}
                      <div class="flex gap-2">
                        <div class="w-[60px]">
                          {#if book.smallImage}
                            <BookCover size="small" {book} />
                          {/if}
                        </div>
                        <div class="flex flex-col flex-1">
                          <span class="leading-none font-bold">{book.title}</span>
                          {#if book.authors?.length}
                            <span style="font-style: italic">{book.authors.join(", ")}</span>
                          {/if}
                          <a
                            class="mt-auto"
                            target="_new"
                            href={`https://www.amazon.com/gp/product/${book.isbn}/?tag=zoomiec-20`}
                            aria-label="View on Amazon"
                          >
                            <AmazonIcon size={14} />
                          </a>
                        </div>
                      </div>
                    {/each}
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
