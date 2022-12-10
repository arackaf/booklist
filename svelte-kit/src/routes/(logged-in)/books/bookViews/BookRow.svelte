<script lang="ts">
  import type { Book, Subject, Tag } from "$data/types";
  import { getContext } from "svelte";
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";
  import LabelDisplay from "$lib/components/subjectsAndTags/LabelDisplay.svelte";

  import Stack from "$lib/components/layout/Stack.svelte";
  import FlowItems from "$lib/components/layout/FlowItems.svelte";
  import DisplaySelectedSubjects from "$lib/components/subjectsAndTags/subjects/DisplaySelectedSubjects.svelte";
  import DisplaySelectedTags from "$lib/components/subjectsAndTags/tags/DisplaySelectedTags.svelte";
  import { searchMutationState } from "../searchState";

  //import CoverSmall from "$lib/components/bookCovers/CoverSmall.svelte";
  //import { addFilterSubject, addFilterTag } from "modules/books/setBookFilters";
  //import BookRowDetails from "./BookRowDetails.svelte";

  export let isPublic: boolean;
  export let online: boolean;
  export let book: Book;

  export let subjects: Subject[];
  export let tags: Tag[];

  const booksModuleContext: any = getContext("books-module-context");
  const { booksUiState, dispatchBooksUiState, setRead, deleteBook, editBook, editBooksSubjects, editBooksTags } = booksModuleContext;

  $: ({ _id } = book);
  $: ({ selectedBooks } = $booksUiState);

  let expanded = false;
  let detailsLoading = false;

  let pendingDelete = false;
  let deleting = false;
  const noop = () => {};

  let doDelete = () => {
    deleting = true;
    return deleteBook({ _id });
  };

  $: hoverOverride = `display: ${pendingDelete ? "inline" : ""}`;
</script>

<tr>
  {#if !isPublic && online}
    <td>
      <a style="font-size: 12pt" on:click={() => dispatchBooksUiState(["toggle-select", _id])} on:keypress={noop}>
        <i class={"fal " + (!!selectedBooks[_id] ? "fa-check-square" : "fa-square")} />
      </a>
    </td>
  {/if}
  <td>
    <div style="width: 60px; min-height: 75px;">
      <!-- <CoverSmall url={book.smallImage} preview={book.smallImagePreview} /> -->
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
        {#if online}
          {#if detailsLoading}
            <a style={hoverOverride} target="_new" class="gridHoverFilter"> <i class="far fa-fw fa-spin fa-spinner" /> </a>
          {:else if expanded}
            <a style={hoverOverride} target="_new" on:click={() => (expanded = false)} class="gridHoverFilter" on:keypress={noop}>
              <i class={`far fa-minus`} />
            </a>
          {:else}
            <a style={hoverOverride} target="_new" on:click={() => (expanded = true)} class="gridHoverFilter" on:keypress={noop}>
              <i class={`far fa-plus`} />
            </a>
          {/if}
        {/if}
        {#if book.isbn && online}
          <a
            style="padding-top: 1px; {hoverOverride}"
            target="_new"
            class="gridHoverFilter"
            href={`https://www.amazon.com/gp/product/${book.isbn}/?tag=zoomiec-20`}
          >
            <i class={`fab fa-amazon`} />
          </a>
        {/if}
        {#if !isPublic && online}
          <a style={hoverOverride} class="gridHoverFilter" on:click={() => editBook(book)} on:keypress={noop}>
            <i class="fal fa-pencil-alt" />
          </a>
          <a style={hoverOverride} class="gridHoverFilter" on:click={() => (pendingDelete = true)} on:keypress={noop}>
            <i class={`fal fa-trash-alt`} />
          </a>
        {/if}
        {#if pendingDelete}
          <ActionButton text="Confirm Delete" runningText="Deleting" onClick={doDelete} preset="danger-xs">Confirm Delete</ActionButton>
        {/if}
        {#if pendingDelete}<button disabled={deleting} on:click={() => (pendingDelete = false)} class="btn btn-xs"> Cancel </button>{/if}
      </FlowItems>
    </Stack>
  </td>
  <td>
    <!-- /*addFilterSubject(s._id)*/ -->
    <!-- <div style="margin-top: 3px">
      {#each book.subjectObjects as s}
        <div style="margin-bottom: 4px">

          <LabelDisplay onClick={() => {}} item={s} />
        </div>
      {/each}
    </div> -->
    <DisplaySelectedSubjects
      style="align-items: start"
      vertical={true}
      currentlySelected={book.subjects}
      {subjects}
      href={s => $searchMutationState.urlWithSubjectFilter(s._id)}
    />
  </td>
  <td>
    <!-- addFilterTag(t._id) -->
    <!-- <div style="margin-top: 3px">
      {#each book.tagObjects as tag}
        <div style="margin-bottom: 4px">

          <LabelDisplay onClick={t => {}} item={tag} />
        </div>
      {/each}
    </div> -->
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
            runningText="Saving"
            icon="far fa-fw fa-check"
            onClick={() => setRead([_id], !book.isRead)}
            preset="success-xs"
          />
        {:else}
          <ActionButton baseWidth="10ch" text="Set read" runningText="Saving" onClick={() => setRead([_id], !book.isRead)} preset="default-xs" />
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
  <!-- <BookRowDetails {book} bind:detailsLoading /> -->
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
