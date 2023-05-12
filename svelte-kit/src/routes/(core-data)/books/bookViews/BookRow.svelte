<script lang="ts">
  import { getContext } from "svelte";

  import { page } from "$app/stores";
  import { enhance } from "$app/forms";

  import type { Book, Subject, Tag } from "$data/types";

  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import Stack from "$lib/components/layout/Stack.svelte";
  import FlowItems from "$lib/components/layout/FlowItems.svelte";
  import DisplaySelectedSubjects from "$lib/components/subjectsAndTags/subjects/DisplaySelectedSubjects.svelte";
  import DisplaySelectedTags from "$lib/components/subjectsAndTags/tags/DisplaySelectedTags.svelte";
  import BookCover from "$lib/components/ui/BookCover.svelte";
  import BookTitle from "$lib/components/ui/BookDisplay/BookTitle.svelte";
  import SubTitleText from "$lib/components/ui/BookDisplay/SubTitleText.svelte";
  import { runDelete } from "$lib/state/dataUpdates";
  import { isbn13To10 } from "$lib/util/isbn13to10";

  import { changeFilter } from "../state/searchState";
  import { selectionState, selectedBooksLookup } from "../state/selectionState";
  import BookRowDetails from "./BookRowDetails.svelte";
  import { booksReadSaving } from "../state/booksReadSavingState";
  import BookReadSetter from "../BookReadSetter.svelte";

  export let isPublic: boolean;
  export let book: Book;

  export let subjects: Subject[];
  export let tags: Tag[];

  const booksModuleContext: any = getContext("books-module-context");
  const { editBook } = booksModuleContext;

  $: ({ id, isbn } = book);

  $: isbn10 = isbn?.length === 10 ? isbn : isbn13To10(isbn);

  let readSaving: boolean;
  $: multiReadSaving = $booksReadSaving[id] == "1";

  let expanded = false;
  let detailsLoading: boolean;

  let pendingDelete = false;
  let deleting = false;

  const deleteBook = () => {
    deleting = true;

    return async ({ result }: any) => {
      deleting = false;
      pendingDelete = false;

      if (result.data.success) {
        runDelete($page.data.books, id);
        $page.data.totalBooks.update((x: number) => x - 1);
        selectionState.unSelectBook(id);
      }
    };
  };

  $: hoverOverride = `display: ${pendingDelete ? "inline" : ""}`;
</script>

<tr>
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
  <td>
    <Stack>
      <Stack tightest={true}>
        <BookTitle>{book.title}</BookTitle>
        {#if book.authors}
          <SubTitleText class="text-sm/4 text-neutral-500">{book.authors.join(", ")}</SubTitleText>
        {/if}
      </Stack>

      <FlowItems vCenter={true} tighter={true} containerStyle="min-height: 35px">
        {#if detailsLoading}
          <span><i class="far fa-fw fa-spin fa-spinner" /></span>
        {:else if expanded}
          <button style={hoverOverride} class="raw-button gridHoverFilter" on:click={() => (expanded = false)}>
            <i class={`far fa-minus fa-fw`} />
          </button>
        {:else}
          <button style={hoverOverride} class="raw-button gridHoverFilter" on:click={() => (expanded = true)}>
            <i class={`far fa-plus fa-fw`} />
          </button>
        {/if}

        {#if isbn10}
          <a
            style="padding-top: 1px; {hoverOverride}"
            target="_new"
            class="gridHoverFilter"
            href={`https://www.amazon.com/gp/product/${isbn10}/?tag=zoomiec-20`}
          >
            <i class={`fab fa-amazon fa-fw`} />
          </a>
        {/if}
        {#if !isPublic}
          <button style={hoverOverride} class="raw-button gridHoverFilter" on:click={() => editBook(book)}>
            <i class="fal fa-pencil-alt fa-fw" />
          </button>
          <button style={hoverOverride} class="raw-button gridHoverFilter" on:click={() => (pendingDelete = true)}>
            <i class={`fal fa-trash-alt fa-fw`} />
          </button>
        {/if}
        {#if pendingDelete}
          <form method="POST" action="?/deleteBook" use:enhance={deleteBook}>
            <input type="hidden" name="id" value={id} />
            <ActionButton text="Confirm Delete" runningText="Deleting" isRunning={deleting} preset="danger-xs">Confirm Delete</ActionButton>
          </form>
        {/if}
        {#if pendingDelete}<button disabled={deleting} on:click={() => (pendingDelete = false)} class="btn btn-xs"> Cancel </button>{/if}
      </FlowItems>
    </Stack>
  </td>
  <td>
    <div class="mt-1">
      <DisplaySelectedSubjects vertical={true} currentlySelected={book.subjects} {subjects} href={s => $changeFilter.addSubject(s.id)} />
    </div>
  </td>
  <td>
    <div class="mt-1">
      <DisplaySelectedTags
        class=""
        style="align-items: start;"
        vertical={true}
        currentlySelected={book.tags}
        {tags}
        href={t => $changeFilter.addTag(t.id)}
      />
    </div>
  </td>
  <td>
    <div class="margin-top-sm">
      {#if !isPublic}
        <BookReadSetter ids={[id]} value={!book.isRead} bind:saving={readSaving}>
          <ActionButton
            baseWidth="10ch"
            text={book.isRead ? "Read" : "Set read"}
            isRunning={readSaving || multiReadSaving}
            runningText="Saving"
            icon={book.isRead ? "far fa-fw fa-check" : null}
            preset={book.isRead ? "success-xs" : "default-xs"}
          />
        </BookReadSetter>
      {:else if !!book.isRead}<span class="label label-success"> Read <i class="far fa-fw fa-check" /> </span>{/if}
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
      {book.dateAddedDisplay}
    </span>
  </td>
</tr>
{#if expanded}
  <BookRowDetails {isPublic} id={book.id} bind:detailsLoading />
{/if}

<style>
  .gridHoverFilter {
    text-decoration: none;
    visibility: hidden;
    color: var(--neutral-light-text);
  }

  td:hover .gridHoverFilter {
    visibility: visible;
  }
</style>
