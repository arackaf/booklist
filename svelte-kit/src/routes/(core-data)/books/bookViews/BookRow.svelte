<script lang="ts">
  import { getContext } from "svelte";

  import { enhance } from "$app/forms";

  import type { Book, Subject, Tag } from "$data/types";

  import Button from "$lib/components/Button/Button.svelte";
  import ActionButton from "$lib/components/Button/ActionButton.svelte";
  import Label from "$lib/components/form-elements/Label/Label.svelte";
  import DisplaySelectedSubjects from "$lib/components/subjectsAndTags/subjects/DisplaySelectedSubjects.svelte";
  import DisplaySelectedTags from "$lib/components/subjectsAndTags/tags/DisplaySelectedTags.svelte";
  import BookCover from "$lib/components/BookCover.svelte";
  import BookTitle from "$lib/components/BookDisplay/BookTitle.svelte";
  import SubTitleText from "$lib/components/BookDisplay/SubTitleText.svelte";
  import { isbn13To10 } from "$lib/util/isbn13to10";

  import { createChangeFilters } from "../state/searchState.svelte";
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

  const changeFilter = createChangeFilters();

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

<tr class="hover:bg-primary-10">
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
              <ActionButton running={deleting} theme="danger" size="sm">Confirm Delete</ActionButton>
            </form>
          {/if}
          {#if pendingDelete}
            <Button size="sm" disabled={deleting} onclick={() => (pendingDelete = false)}>Cancel</Button>
          {/if}
          <Button size="sm" class="invisible">.</Button>
        </div>
      </div>
    </div>
  </td>
  <td>
    <div class="mt-1">
      <DisplaySelectedSubjects vertical={true} currentlySelected={book.subjects} {subjects} href={s => changeFilter.addSubject(s.id)} />
    </div>
  </td>
  <td>
    <div class="mt-1">
      <DisplaySelectedTags vertical={true} currentlySelected={book.tags} {tags} href={t => changeFilter.addTag(t.id)} />
    </div>
  </td>
  <td>
    <div class="mt-1">
      {#if !isPublic}
        <BookReadSetter ids={[id]} value={!book.isRead} bind:saving={readSaving}>
          <ActionButton size="sm" running={readSaving || multiReadSaving} theme={book.isRead ? "success" : "default"}>
            <span>
              {book.isRead ? "Read" : "Set read"}
            </span>
            {#if book.isRead}
              <i class="far fa-fw fa-check"></i>
            {/if}
          </ActionButton>
        </BookReadSetter>
      {:else if book.isRead}
        <Label theme="success">Read <i class="far fa-fw fa-check"></i></Label>
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
