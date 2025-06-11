<script lang="ts">
  import { getContext } from "svelte";
  import { BookIcon, CheckIcon, PencilIcon, Trash2Icon } from "lucide-svelte";

  import { enhance } from "$app/forms";

  import type { Book, Subject, Tag } from "$data/types";

  import { cn } from "$lib/utils";
  import { isbn13To10 } from "$lib/util/isbn13to10";

  import Badge from "$lib/components/ui/badge/badge.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import Checkbox from "$lib/components/ui/checkbox/checkbox.svelte";

  import DisplaySelectedSubjects from "$lib/components/subjectsAndTags/subjects/DisplaySelectedSubjects.svelte";
  import DisplaySelectedTags from "$lib/components/subjectsAndTags/tags/DisplaySelectedTags.svelte";
  import BookCover from "$lib/components/BookCover.svelte";
  import BookTitle from "$lib/components/BookDisplay/BookTitle.svelte";
  import SubTitleText from "$lib/components/BookDisplay/SubTitleText.svelte";

  import { ChangeFilters } from "../state/searchState.svelte";
  import { selectionState } from "../state/selectionState.svelte";
  import { booksReadSaving } from "../state/booksReadSavingState.svelte";
  import BookReadSetter from "../BookReadSetter.svelte";
  import { afterDelete } from "../state/onDelete";
  import AmazonIcon from "$lib/svg/AmazonIcon.svelte";
  import BookRating from "$lib/components/BookRating.svelte";

  type Props = {
    isPublic: boolean;
    book: Book;
    subjects: Subject[];
    tags: Tag[];
    previewBook: (book: Book) => void;
  };

  let { isPublic, book, subjects, tags, previewBook }: Props = $props();

  const changeFilter = new ChangeFilters();

  const booksModuleContext: any = getContext("books-module-context");
  const { editBook } = booksModuleContext;

  let { id, isbn } = $derived(book);
  let isbn10 = $derived(isbn?.length === 10 ? isbn : isbn13To10(isbn));

  let readSaving = $state(false);
  let multiReadSaving = $derived(booksReadSaving[id] == "1");

  let pendingDelete = $state(false);
  let deleting = $state(false);

  let hoverOverride = $derived(`display: ${pendingDelete ? "inline" : ""}`);
  let addedDate = $derived(new Date(book.dateAdded));

  const deleteBook = () => {
    deleting = true;

    return async ({ result }: any) => {
      if (result.data.success) {
        afterDelete(id);
      }
    };
  };

  function getDisplayDate(date: Date) {
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  }

  let bookHeight = $derived(typeof book.smallImagePreview === "object" && book.smallImagePreview != null ? book.smallImagePreview.h : 65);
</script>

<tr class="hover:bg-secondary">
  {#if !isPublic}
    <td>
      <Checkbox
        bind:checked={() => !!selectionState.selectedBooksLookup[id], val => (val ? selectionState.selectBook(id) : selectionState.unSelectBook(id))}
      />
    </td>
  {/if}
  <td>
    <div style="width: 60px; min-height: 50px;">
      <BookCover size="small" {book} />
    </div>
  </td>
  <td class="group">
    <div>
      <div class="flex flex-col gap-2" style="min-height: {bookHeight}px">
        <div class="flex flex-col gap-1">
          <BookTitle>{book.title}</BookTitle>
          {#if book.authors}
            <SubTitleText>{book.authors.join(", ")}</SubTitleText>
          {/if}
        </div>

        <div class="flex flex-row gap-3 items-center mt-auto h-5">
          <button
            onclick={() => previewBook(book)}
            style={hoverOverride}
            class="raw-button invisible text-neutral-500 group-hover:visible"
            aria-label="View book details"
          >
            <BookIcon size={16} />
          </button>
          {#if isbn10}
            <a
              style={hoverOverride}
              target="_new"
              class="invisible text-neutral-500 group-hover:visible text-sm mt-0.5"
              href={`https://www.amazon.com/gp/product/${isbn10}/?tag=zoomiec-20`}
              aria-label="View book on Amazon"
            >
              <AmazonIcon class="fill-neutral-500" size={16} />
            </a>
          {/if}
          {#if !isPublic}
            <button
              style={hoverOverride}
              class="raw-button invisible text-neutral-500 group-hover:visible text-sm"
              onclick={() => editBook(book)}
              aria-label="Edit book"
            >
              <PencilIcon size={16} />
            </button>
            <button
              style={hoverOverride}
              class="raw-button invisible text-neutral-500 group-hover:visible text-sm"
              onclick={() => (pendingDelete = true)}
              aria-label="Delete book"
            >
              <Trash2Icon size={16} />
            </button>
          {/if}
          {#if pendingDelete}
            <form method="POST" action="?/deleteBook" use:enhance={deleteBook}>
              <input type="hidden" name="id" value={id} />
              <Button type="submit" disabled={deleting} variant="destructive" class="flex h-5 px-2 text-xs">Confirm Delete</Button>
            </form>
          {/if}
          {#if pendingDelete}
            <Button variant="outline" disabled={deleting} onclick={() => (pendingDelete = false)} class="h-5 px-2 text-xs">Cancel</Button>
          {/if}
        </div>
      </div>
    </div>
  </td>
  <td class="pt-2">
    <div class="flex flex-col gap-4">
      {#if subjects.length}
        <DisplaySelectedSubjects currentlySelected={book.subjects} {subjects} href={s => changeFilter.addSubject(s.id)} />
      {/if}
      {#if tags.length}
        <DisplaySelectedTags currentlySelected={book.tags} {tags} href={t => changeFilter.addTag(t.id)} />
      {/if}
    </div>
  </td>
  <td class="pt-2">
    <div>
      {#if !isPublic}
        <div class="flex flex-col items-center">
          <div class="min-h-9">
            {#if book.averageReview}
              <div class="flex flex-col items-center gap-0">
                <BookRating averageReview={book.averageReview} numberReviews={book.numberReviews} />
                <div class="text-xs text-neutral-500">
                  <span>{book.averageReview} / ({book.numberReviews.toLocaleString()})</span>
                </div>
              </div>
            {:else}
              <div class="text-xs text-neutral-500">No reviews</div>
            {/if}
          </div>
          <BookReadSetter ids={[id]} value={!book.isRead} bind:saving={readSaving}>
            <Button
              type="submit"
              variant="outline"
              disabled={readSaving || multiReadSaving}
              class={cn("h-5 px-2 text-xs mt-0 flex", {
                "bg-green-600": book.isRead,
                "border-green-600": book.isRead,
                "hover:bg-green-700": book.isRead,
                "hover:border-green-700": book.isRead,
                "text-muted-foreground": !book.isRead,
                "text-background": book.isRead,
                "hover:text-background": book.isRead
              })}
            >
              <span>
                {book.isRead ? "Read" : "Set read"}
              </span>
              {#if book.isRead}
                <CheckIcon />
              {/if}
            </Button>
          </BookReadSetter>
        </div>
      {:else if book.isRead}
        <Badge class="inline-flex gap-1" variant="outline">Read <CheckIcon size={14} /></Badge>
      {/if}
    </div>
  </td>
  <td>
    {#if book.publisher}
      <div class="text-sm truncate max-w-[150px]">{book.publisher}</div>
    {/if}
    {#if book.publicationDate}
      <div class="text-sm">{book.publicationDate}</div>
    {/if}
    {#if book.isbn}
      <div class="text-sm">{book.isbn}</div>
    {/if}
  </td>
  <td>
    <span class="text-sm">
      {book.pages == null ? "" : book.pages}
    </span>
  </td>
  <td>
    <span class="text-sm">
      {getDisplayDate(addedDate)}
    </span>
  </td>
</tr>
