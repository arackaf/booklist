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

  import { changeFilter } from "../state/searchState";
  import { selectionState, selectedBooksLookup } from "../state/selectionState";
  import { booksReadSaving } from "../state/booksReadSavingState";
  import BookReadSetter from "../BookReadSetter.svelte";
  import { afterDelete } from "../state/onDelete";

  export let isPublic: boolean;
  export let book: Book;

  export let subjects: Subject[];
  export let tags: Tag[];

  export let previewBook: (book: Book) => void;

  const booksModuleContext: any = getContext("books-module-context");
  const { editBook } = booksModuleContext;

  $: ({ id, isbn } = book);

  $: isbn10 = isbn?.length === 10 ? isbn : isbn13To10(isbn);

  let readSaving: boolean;
  $: multiReadSaving = $booksReadSaving[id] == "1";

  let pendingDelete = false;
  let deleting = false;

  const deleteBook = () => {
    deleting = true;

    return async ({ result }: any) => {
      if (result.data.success) {
        afterDelete(id);
      }
    };
  };

  $: hoverOverride = `display: ${pendingDelete ? "inline" : ""}`;

  $: addedDate = new Date(book.dateAdded);
  function getDisplayDate(date: Date) {
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  }
</script>

<tr class="hover:bg-primary-10">
  {#if !isPublic}
    <td>
      <button style="font-size: 12pt" class="raw-button" on:click={() => selectionState.toggle(id)}>
        <i class={"fal fa-fw " + (!!$selectedBooksLookup[id] ? "fa-check-square" : "fa-square")} />
      </button>
    </td>
  {/if}
  <td>
    <div style="width: 60px; min-height: 75px;">
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
          <button on:click={() => previewBook(book)} style={hoverOverride} class="raw-button invisible text-neutral-500 group-hover:visible text-sm">
            <i class="fa-fw far fa-search" />
          </button>
          {#if isbn10}
            <a
              style="padding-top: 1px; {hoverOverride}"
              target="_new"
              class="invisible text-neutral-500 group-hover:visible text-sm"
              href={`https://www.amazon.com/gp/product/${isbn10}/?tag=zoomiec-20`}
            >
              <i class={`fab fa-amazon fa-fw`} />
            </a>
          {/if}
          {#if !isPublic}
            <button style={hoverOverride} class="raw-button invisible text-neutral-500 group-hover:visible text-sm" on:click={() => editBook(book)}>
              <i class="fal fa-pencil-alt fa-fw" />
            </button>
            <button
              style={hoverOverride}
              class="raw-button invisible text-neutral-500 group-hover:visible text-sm"
              on:click={() => (pendingDelete = true)}
            >
              <i class={`fal fa-trash-alt fa-fw`} />
            </button>
          {/if}
          {#if pendingDelete}
            <form method="POST" action="?/deleteBook" use:enhance={deleteBook}>
              <input type="hidden" name="id" value={id} />
              <ActionButton running={deleting} theme="danger" size="sm">Confirm Delete</ActionButton>
            </form>
          {/if}
          {#if pendingDelete}
            <Button size="sm" disabled={deleting} on:click={() => (pendingDelete = false)}>Cancel</Button>
          {/if}
        </div>
      </div>
    </div>
  </td>
  <td>
    <div class="mt-1">
      <DisplaySelectedSubjects vertical={true} currentlySelected={book.subjects} {subjects} href={s => $changeFilter.addSubject(s.id)} />
    </div>
  </td>
  <td>
    <div class="mt-1">
      <DisplaySelectedTags vertical={true} currentlySelected={book.tags} {tags} href={t => $changeFilter.addTag(t.id)} />
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
              <i class="far fa-fw fa-check" />
            {/if}
          </ActionButton>
        </BookReadSetter>
      {:else if book.isRead}
        <Label theme="success">Read <i class="far fa-fw fa-check" /></Label>
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
