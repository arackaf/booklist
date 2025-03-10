<script lang="ts">
  import { getContext } from "svelte";
  import { CheckIcon } from "lucide-svelte";

  import { enhance } from "$app/forms";

  import type { Book, Subject, Tag } from "$data/types";

  import { cn } from "$lib/utils";
  import { isbn13To10 } from "$lib/util/isbn13to10";

  import Badge from "$lib/components/ui/badge/badge.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
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
</script>

<tr class="hover:bg-secondary">
  {#if !isPublic}
    <td>
      <button style="font-size: 12pt" class="raw-button" onclick={() => selectionState.toggle(id)} aria-label="Select book">
        <i class={"fal fa-fw " + (!!selectionState.selectedBooksLookup[id] ? "fa-check-square" : "fa-square")}></i>
      </button>
    </td>
  {/if}
  <td>
    <div style="width: 60px; min-height: 50px;">
      <BookCover size="small" {book} />
    </div>
  </td>
  <td class="group">
    <div>
      <div class="flex flex-col gap-2">
        <div class="flex flex-col gap-1">
          <BookTitle>{book.title}</BookTitle>
          {#if book.authors}
            <SubTitleText>{book.authors.join(", ")}</SubTitleText>
          {/if}
        </div>

        <div class="flex flex-row gap-2 items-center mt-auto flex-1">
          <button
            onclick={() => previewBook(book)}
            style={hoverOverride}
            class="raw-button invisible text-neutral-500 group-hover:visible text-sm"
            aria-label="View book details"
          >
            <i class="fa-fw fal fa-eye"></i>
          </button>
          {#if isbn10}
            <a
              style="padding-top: 1px; {hoverOverride}"
              target="_new"
              class="invisible text-neutral-500 group-hover:visible text-sm"
              href={`https://www.amazon.com/gp/product/${isbn10}/?tag=zoomiec-20`}
              aria-label="View book on Amazon"
            >
              <i class={`fab fa-amazon fa-fw`}></i>
            </a>
          {/if}
          {#if !isPublic}
            <button
              style={hoverOverride}
              class="raw-button invisible text-neutral-500 group-hover:visible text-sm"
              onclick={() => editBook(book)}
              aria-label="Edit book"
            >
              <i class="fal fa-pencil-alt fa-fw"></i>
            </button>
            <button
              style={hoverOverride}
              class="raw-button invisible text-neutral-500 group-hover:visible text-sm"
              onclick={() => (pendingDelete = true)}
              aria-label="Delete book"
            >
              <i class={`fal fa-trash-alt fa-fw`}></i>
            </button>
          {/if}
          {#if pendingDelete}
            <form method="POST" action="?/deleteBook" use:enhance={deleteBook}>
              <input type="hidden" name="id" value={id} />
              <Button type="submit" disabled={deleting} variant="destructive" class="h-6 px-2 text-xs">Confirm Delete</Button>
            </form>
          {/if}
          {#if pendingDelete}
            <Button variant="outline" disabled={deleting} onclick={() => (pendingDelete = false)} class="h-6 px-2 text-xs">Cancel</Button>
          {/if}
          <Button size="sm" class="invisible px-2 text-xs">Cancel</Button>
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
              <i class="far fa-fw fa-check"></i>
            {/if}
          </Button>
        </BookReadSetter>
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
