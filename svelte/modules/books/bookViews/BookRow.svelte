<script lang="ts">
  import { getContext } from "svelte";
  import ActionButton from "app/components/buttons/ActionButton.svelte";
  import LabelDisplay from "app/components/subjectsAndTags/LabelDisplay.svelte";

  import { IBookDisplay } from "../booksState";

  import CoverSmall from "app/components/bookCovers/CoverSmall.svelte";
  import { addFilterSubject, addFilterTag } from "modules/books/setBookFilters";
  import Stack from "app/components/layout/Stack.svelte";
  import FlowItems from "app/components/layout/FlowItems.svelte";
  import BookRowDetails from "./BookRowDetails.svelte";

  export let isPublic;
  export let online;
  export let book: IBookDisplay;

  const booksModuleContext: any = getContext("books-module-context");
  const { booksUiState, dispatchBooksUiState, setRead, deleteBook, editBook, editBooksSubjects, editBooksTags } = booksModuleContext;

  $: ({ _id } = book);
  $: ({ selectedBooks } = $booksUiState);

  let expanded = false;
  let detailsLoading = false;

  let pendingDelete = false;
  let deleting = false;

  let doDelete = () => {
    deleting = true;
    return deleteBook({ _id });
  };

  $: hoverOverride = `display: ${pendingDelete ? "inline" : ""}`;
</script>

<style>
  .gridHoverFilter {
    text-decoration: none;
    display: none;
    color: var(--neutral-light-text);
  }

  td:hover .gridHoverFilter {
    display: unset;
  }
</style>

<tr>
  {#if !isPublic && online}
    <td>
      <a style="font-size: 12pt" on:click={() => dispatchBooksUiState(["toggle-select", _id])}>
        <i class={"fal " + (!!selectedBooks[_id] ? "fa-check-square" : "fa-square")} />
      </a>
    </td>
  {/if}
  <td>
    <div style="width: 60px; min-height: 75px;">
      <CoverSmall url={book.smallImage} />
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
            <a style={hoverOverride} target="_new" on:click={() => (expanded = false)} class="gridHoverFilter"> <i class={`far fa-minus`} /> </a>
          {:else}
            <a style={hoverOverride} target="_new" on:click={() => (expanded = true)} class="gridHoverFilter"> <i class={`far fa-plus`} /> </a>
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
          <a style={hoverOverride} class="gridHoverFilter" on:click={() => editBook(book)}> <i class="fal fa-pencil-alt" /> </a>
          <a style={hoverOverride} class="gridHoverFilter" on:click={() => (pendingDelete = true)}> <i class={`fal fa-trash-alt`} /> </a>
        {/if}
        {#if pendingDelete}
          <ActionButton text="Confirm Delete" runningText="Deleting" onClick={doDelete} preset="danger-xs">Confirm Delete</ActionButton>
        {/if}
        {#if pendingDelete}<button disabled={deleting} on:click={() => (pendingDelete = false)} class="btn btn-xs"> Cancel </button>{/if}
      </FlowItems>
    </Stack>
  </td>
  <td>
    <div style="margin-top: 3px">
      {#each book.subjectObjects as s}
        <div style="margin-bottom: 4px">
          <LabelDisplay onClick={() => addFilterSubject(s._id)} item={s} />
        </div>
      {/each}
    </div>
    <div style="margin-top: 5px">
      {#if !isPublic}<a class="gridHoverFilter" on:click={() => editBooksSubjects([book])}> <i class="fal fa-pencil-alt" /> </a>{/if}
    </div>
  </td>
  <td>
    <div style="margin-top: 3px">
      {#each book.tagObjects as tag}
        <div style="margin-bottom: 4px">
          <LabelDisplay onClick={t => addFilterTag(t._id)} item={tag} />
        </div>
      {/each}
    </div>
    <div style="margin-top: 5px">
      {#if !isPublic}<a class="gridHoverFilter" on:click={() => editBooksTags([book])}> <i class="fal fa-pencil-alt" /> </a>{/if}
    </div>
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
  <BookRowDetails {book} bind:detailsLoading />
{/if}
