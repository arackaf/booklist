<script lang="ts">
  import { getContext } from "svelte";
  import { appState } from "app/state/appState";
  import { BookResultsPacket } from "./booksState";
  import { getBookSearchUiView, BASIC_LIST_VIEW, COVERS_LIST, GRID_VIEW } from "./booksUiState";

  export let uiView: ReturnType<typeof getBookSearchUiView>;

  export let bookResultsPacket: BookResultsPacket;
  $: ({ books = [], reload, booksLoading } = bookResultsPacket);

  const uiDispatch = view => $uiView.requestState({ type: "SET_PENDING_VIEW", value: view }, books);

  $: ({ isPublic, online } = $appState);

  const booksModuleContext: any = getContext("books-module-context");
  const { booksUiState, openFilterModal, editSubjects, editTags, setRead, editBooksSubjects, editBooksTags } = booksModuleContext;

  $: ({ selectedBooks } = $booksUiState);
  $: selectedBooksIds = Object.keys(selectedBooks).filter(k => selectedBooks[k]);
  $: selectedBooksCount = selectedBooksIds.length;

  const editSubjectsForSelectedBooks = () => editBooksSubjects(books.filter(b => selectedBooks[b._id]));
  const editTagsForSelectedBooks = () => editBooksTags(books.filter(b => selectedBooks[b._id]));
</script>

{#if !selectedBooksCount}
  {#if online}
    <button
      title="Filter search"
      style="border-top-left-radius: 0; border-bottom-left-radius: 0"
      on:click={openFilterModal}
      class="btn btn-default hidden-tiny"
    >
      <i class="fal fa-filter" />
    </button>
    {#if !isPublic}
      <button title="Edit subjects" on:click={editSubjects} class="btn btn-default hidden-xs"><i class="fal fa-sitemap" /></button>
      <button title="Edit tags" on:click={editTags} class="btn btn-default hidden-xs"><i class="fal fa-tags" /></button>
    {/if}
  {/if}
  <button class="btn btn-default hidden-tiny" on:click={reload} disabled={booksLoading}><i class="fal fa-sync" /></button>
  <button on:click={() => uiDispatch(GRID_VIEW)} class={"btn btn-default hidden-tiny " + ($uiView.pendingView == GRID_VIEW ? "active" : "")}>
    <i class="fal fa-table" />
  </button>
  <button on:click={() => uiDispatch(COVERS_LIST)} class={"btn btn-default hidden-tiny " + ($uiView.pendingView == COVERS_LIST ? "active" : "")}>
    <i class="fas fa-th" />
  </button>
  <button
    on:click={() => uiDispatch(BASIC_LIST_VIEW)}
    class={"btn btn-default hidden-tiny " + ($uiView.pendingView == BASIC_LIST_VIEW ? "active" : "")}
  >
    <i class="fal fa-list" />
  </button>
{:else if !isPublic}
  <button title="Add/remove subjects" on:click={editSubjectsForSelectedBooks} class={"btn btn-default hidden-tiny"}>
    <i class="fal fa-sitemap" />
  </button>
  <button title="Add/remove tags" on:click={editTagsForSelectedBooks} class="btn btn-default hidden-tiny"><i class="fal fa-tags" /></button>
  <button title="Set read" on:click={() => setRead(selectedBooksIds, true)} class={"btn btn-default hidden-tiny"}>
    <i class="fal fa-eye" />
  </button>
  <button title="Set un-read" on:click={() => setRead(selectedBooksIds, false)} class="btn btn-default put-line-through hidden-tiny">
    <i class="fal fa-eye-slash" />
  </button>
{/if}
