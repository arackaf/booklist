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
  import { runDelete } from "$lib/state/dataUpdates";

  import { searchMutationState } from "../state/searchState";
  import { selectionState, selectedBooksLookup } from "../state/selectionState";
  import BookRowDetails from "./BookRowDetails.svelte";
  import { booksReadSaving } from "../state/booksReadSavingState";

  export let isPublic: boolean;
  export let book: Book;

  export let subjects: Subject[];
  export let tags: Tag[];

  const booksModuleContext: any = getContext("books-module-context");
  const { setRead, editBook } = booksModuleContext;

  $: ({ _id } = book);

  let readSaving: boolean;
  $: multiReadSaving = $booksReadSaving[_id] == "1";

  let expanded = false;
  let detailsLoading: boolean;

  let pendingDelete = false;
  const noop = () => {};

  let deleting = false;

  const deleteBook = () => {
    deleting = true;

    return async ({ result }: any) => {
      deleting = false;
      pendingDelete = false;

      if (result.data.success) {
        runDelete($page.data.books, _id);
      }
    };
  };

  $: hoverOverride = `display: ${pendingDelete ? "inline" : ""}`;
</script>

<tr>
  {#if !isPublic}
    <td>
      <span class="cursor-pointer" style="font-size: 12pt" on:click={() => selectionState.toggle(_id)} on:keypress={noop}>
        <i class={"fal " + (!!$selectedBooksLookup[_id] ? "fa-check-square" : "fa-square")} />
      </span>
    </td>
  {/if}
  <td>
    <div style="width: 60px; min-height: 75px;">
      <BookCover url={book.smallImage} preview={book.smallImagePreview} />
    </div>
  </td>
  <td>
    <Stack>
      <Stack tightest={true}>
        <div class="bookTitle">{book.title}</div>
        {#if book.authors}
          <div class="bookAuthor">{book.authors.join(", ")}</div>
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

        {#if book.isbn}
          <a
            style="padding-top: 1px; {hoverOverride}"
            target="_new"
            class="gridHoverFilter"
            href={`https://www.amazon.com/gp/product/${book.isbn}/?tag=zoomiec-20`}
          >
            <i class={`fab fa-amazon fa-fw`} />
          </a>
        {/if}
        {#if !isPublic}
          <button style={hoverOverride} class="raw-button gridHoverFilter" on:click={() => editBook(book)}>
            <i class="fal fa-pencil-alt fa-fw" />
          </button>
          <button style={hoverOverride} class="raw-button gridHoverFilter" on:click={() => (pendingDelete = true)} on:keypress={noop}>
            <i class={`fal fa-trash-alt fa-fw`} />
          </button>
        {/if}
        {#if pendingDelete}
          <form method="POST" action="?/deleteBook" use:enhance={deleteBook}>
            <input type="hidden" name="_id" value={_id} />
            <ActionButton text="Confirm Delete" runningText="Deleting" isRunning={deleting} preset="danger-xs">Confirm Delete</ActionButton>
          </form>
        {/if}
        {#if pendingDelete}<button disabled={deleting} on:click={() => (pendingDelete = false)} class="btn btn-xs"> Cancel </button>{/if}
      </FlowItems>
    </Stack>
  </td>
  <td>
    <DisplaySelectedSubjects
      style="align-items: start"
      vertical={true}
      currentlySelected={book.subjects}
      {subjects}
      href={s => $searchMutationState.urlWithSubjectFilter(s._id)}
    />
  </td>
  <td>
    <DisplaySelectedTags
      style="align-items: start"
      vertical={true}
      currentlySelected={book.tags}
      {tags}
      href={s => $searchMutationState.urlWithTagFilter(s._id)}
    />
  </td>
  <td>
    <div style="margin-top: {!isPublic ? '3' : '0'}px">
      {#if !isPublic}
        {#if !!book.isRead}
          <ActionButton
            baseWidth="10ch"
            text="Read"
            isRunning={readSaving || multiReadSaving}
            runningText="Saving"
            icon="far fa-fw fa-check"
            onClick={() => setRead([_id], !book.isRead)}
            preset="success-xs"
          />
        {:else}
          <ActionButton
            baseWidth="10ch"
            text="Set read"
            isRunning={readSaving || multiReadSaving}
            runningText="Saving"
            onClick={() => setRead([_id], !book.isRead)}
            preset="default-xs"
          />
        {/if}
      {:else if !!book.isRead}<span class="label label-success"> Read <i class="far fa-fw fa-check" /> </span>{/if}
    </div>
  </td>
  <td>
    {#if book.publisher}
      <div>{book.publisher}</div>
    {/if}
    {#if book.publicationDate}
      <div>{book.publicationDate}</div>
    {/if}
    {#if book.isbn}
      <div>{book.isbn}</div>
    {/if}
  </td>
  <td>{book.pages == null ? "" : book.pages}</td>
  <td>{book.dateAddedDisplay}</td>
</tr>
{#if expanded}
  <BookRowDetails {isPublic} id={book._id} bind:detailsLoading />
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
