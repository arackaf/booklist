<script lang="ts">
  import { getContext } from "svelte";
  import { query } from "micro-graphql-svelte";
  import { QueryOf, Queries } from "graphql-typings";
  import ActionButton from "app/components/buttons/ActionButton.svelte";
  import LabelDisplay from "app/components/subjectsAndTags/LabelDisplay.svelte";

  import { appState } from "app/state/appState";
  import { IBookDisplay } from "../booksState";

  import { currentSearch } from "../booksSearchState";

  import BookDetailsQuery from "graphQL/books/getBookDetails.graphql";

  import CoverSmall from "app/components/bookCovers/CoverSmall.svelte";
  import { setBooksSort, addFilterSubject, addFilterTag } from "modules/books/setBookFilters";
  import FlexRow from "app/components/layout/FlexRow.svelte";
  import Stack from "app/components/layout/Stack.svelte";
  import FlowItems from "app/components/layout/FlowItems.svelte";

  $: ({ isPublic: viewingPublic, online } = $appState);
  export let book: IBookDisplay;
  //const { , setRead, runDelete } = props;

  const booksModuleContext: any = getContext("books-module-context");
  const { booksUiState, dispatchBooksUiState } = booksModuleContext;

  $: ({ _id } = book);
  //const { selectedBooks } = booksUiState;
  $: ({ selectedBooks } = $booksUiState);

  let expanded = false;
  let detailsLoading = false;

  //const [startDelete, cancelDelete, doDelete, pendingDelete, deleting] = useDelete(() => runDelete(_id));

  $: hoverOverride = `display: ${pendingDelete ? "inline" : ""}`;

  let startDelete = () => {};
  let cancelDelete = () => {};
  let doDelete = () => {};
  let pendingDelete = false;
  let deleting = false;
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
  {#if !viewingPublic && online}
    <td>
      <a style="font-size: 12pt" on:click={() => dispatchBooksUiState(['toggle-select', _id])}>
        <i class={'fal ' + (!!selectedBooks[_id] ? 'fa-check-square' : 'fa-square')} />
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
          <div class="bookAuthor">{book.authors.join(', ')}</div>
        {/if}
      </Stack>

      <FlowItems vCenter={true} tighter={true} containerStyle="minHeight: 35px">
        {#if online}
          {#if detailsLoading}
            <a style={hoverOverride} target="_new" class="gridHoverFilter"> <i class="fa fa-fw fa-spin fa-spinner" /> </a>
          {:else if expanded}
            <a style={hoverOverride} target="_new" onClick={() => setExpanded(false)} class="gridHoverFilter"> <i class={`far fa-minus`} /> </a>
          {:else}
            <a style={hoverOverride} target="_new" onClick={() => setExpanded(true)} class="gridHoverFilter"> <i class={`far fa-plus`} /> </a>
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
        {#if !viewingPublic && online}
          <!-- TODO -->
          <!-- <a style={hoverOverride} class="gridHoverFilter" on:click={() => props.editBook(book)}> <i class="fal fa-pencil-alt" /> </a> -->
          <a style={hoverOverride} class="gridHoverFilter" on:click={startDelete}> <i class={`fal fa-trash-alt`} /> </a>
        {/if}
        {#if pendingDelete}
          <ActionButton text="Confirm Delete" runningText="Deleting" onClick={doDelete} preset="danger-xs">Confirm Delete</ActionButton>
        {/if}
        {#if pendingDelete}<button disabled={deleting} onClick={cancelDelete} class="btn btn-xs"> Cancel </button>{/if}
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
      {#if !viewingPublic}<a class="gridHoverFilter" onClick={() => props.editBooksSubjects(book)}> <i class="fal fa-pencil-alt" /> </a>{/if}
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
      {#if !viewingPublic}<a class="gridHoverFilter" onClick={() => props.editBooksTags(book)}> <i class="fal fa-pencil-alt" /> </a>{/if}
    </div>
  </td>
  <td>
    <div style="margin-top: {!viewingPublic ? '3' : '0'}px">
      {#if !viewingPublic}
        {#if !!book.isRead}
          <ActionButton
            baseWidth="10ch"
            text="Read"
            runningText="Saving"
            icon="fa fa-fw fa-check"
            onClick={() => setRead([_id], !book.isRead)}
            preset="success-xs"
          />
        {:else}
          <ActionButton baseWidth="10ch" text="Set read" runningText="Saving" onClick={() => setRead([_id], !book.isRead)} preset="default-xs" />
        {/if}
      {:else if !!book.isRead}<span class="label label-success"> Read <i class="fa fa-fw fa-check" /> </span>{/if}
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
  <td>{book.pages}</td>
  <td>{book.dateAddedDisplay}</td>
</tr>
{#if expanded}
  <!-- <BookRowDetails {...{ book, setDetailsLoading }} /> -->
{/if}
