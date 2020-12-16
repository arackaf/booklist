<script lang="ts">
  import { appState } from "app/state/appState";
import { getContext } from "svelte";

  import measureHeight from "util/measureHeight";

  import { currentSearch as bookSearchState } from "./booksSearchState";
  import { getBookSearchUiView } from "./booksUiState";
  import PagingButtons from "./PagingButtons.svelte";
  import { quickSearch } from "./setBookFilters";

  interface BookResultsPacket {
    books: any[];
    totalPages: number;
    resultsCount: string | number;
    reload?: () => void;
    booksLoading?: boolean;
    booksLoaded?: boolean;
  }

  export let setMenuBarHeight;
  export let bookResultsPacket: BookResultsPacket;
  $: ({ books = [], totalPages = null, resultsCount = null, reload, booksLoading, booksLoaded } = bookResultsPacket);

  // const { actions, booksUiState } = useContext(BooksModuleContext);
  // const { setRead } = actions;

  export let uiView: ReturnType<typeof getBookSearchUiView>;
  const uiDispatch = $uiView.dispatch;

  //const { selectedBooks } = booksUiState;
  //const selectedBooksCount = useMemo(() => Object.keys(selectedBooks).filter(k => selectedBooks[k]).length, [selectedBooks]);
  //const selectedBooksIds = useMemo(() => Object.keys(selectedBooks).filter(k => selectedBooks[k]), [selectedBooks]);

  //const editSubjectsForSelectedBooks = () => actions.openBookSubModal(books.filter(b => booksUiState.selectedBooks[b._id]));
  //const editTagsForSelectedBooks = () => actions.openBookTagModal(books.filter(b => booksUiState.selectedBooks[b._id]));

  $: {
    quickSearchEl && (quickSearchEl.value = $bookSearchState.search);
  }

  const resetSearch = () => {
    quickSearchEl.value = $bookSearchState.search;
  };
  const quickSearchType = evt => {
    if (evt.keyCode == 13) {
      quickSearch(evt.currentTarget.value);
    }
  };

  $: ({ isPublic, online } = $appState);

  const booksModuleContext: any = getContext("books-module-context");
  const { openFilterModal, editSubjects } =  booksModuleContext;

  // ----------

  //let resetSearch = () => {};
  //let quickSearchType = () => {};
  // let uiDispatch = () => {};
  let editSubjectsForSelectedBooks = () => {};
  let editTagsForSelectedBooks = () => {};
  let setRead = () => {};
  let searchInput = "";
  let selectedBooksCount = 0;
  //let online = true;
  let actions = {};
  //let uiView = {};
  let selectedBooksIds = {};
  //let isPublic = false;
  //
  let quickSearchEl;
</script>

<style>
  .root {
    position: sticky;
    top: 0;
    margin-top: -2px;
    padding-top: 2px;
    background-color: white;
    z-index: 1;
  }
</style>

<div class="root" use:measureHeight={setMenuBarHeight}>
  <div class="booksMenuBar" style="font-size: 11pt; padding-bottom: 5px; position: relative">
    <div style="display: flex; flex-wrap: wrap; margin-bottom: 5px">
      <!-- {isPublic ? <PublicBooksHeader /> : null} -->
      <PagingButtons {...{ selectedBooksCount, totalPages, resultsCount, booksLoaded }} />
      <div style="margin-right: 5px">
        <div class="btn-group">
          <input
            autocomplete="off"
            bind:this={quickSearchEl}
            value={$bookSearchState.search}
            on:blur={resetSearch}
            name="search"
            class={`form-control ${searchInput} tiny-orphan`}
            placeholder="Title search"
            on:keydown={quickSearchType}
          />
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
                <button title="Edit tags" onClick={actions.editTags} class="btn btn-default hidden-xs"><i class="fal fa-tags" /></button>
              {/if}
            {/if}
            <button class="btn btn-default hidden-tiny" on:click={reload} disabled={booksLoading}><i class="fal fa-sync" /></button>
            <button
              on:click={() => uiDispatch({ type: 'SET_GRID_VIEW' })}
              class={'btn btn-default hidden-tiny ' + ($uiView.isGridView ? 'active' : '')}
            >
              <i class="fal fa-table" />
            </button>
            <button
              on:click={() => uiDispatch({ type: 'SET_COVERS_LIST_VIEW' })}
              class={'btn btn-default hidden-tiny ' + ($uiView.isCoversList ? 'active' : '')}
            >
              <i class="fas fa-th" />
            </button>
            <button
              on:click={() => uiDispatch({ type: 'SET_BASIC_LIST_VIEW' })}
              class={'btn btn-default hidden-tiny ' + ($uiView.isBasicList ? 'active' : '')}
            >
              <i class="fal fa-list" />
            </button>
          {:else if !isPublic}
            <button title="Add/remove subjects" on:click={editSubjectsForSelectedBooks} class={'btn btn-default hidden-tiny'}>
              <i class="fal fa-sitemap" />
            </button>
            <button title="Add/remove tags" on:click={editTagsForSelectedBooks} class="btn btn-default hidden-tiny"><i class="fal fa-tags" /></button>
            <button title="Set read" on:click={() => setRead(selectedBooksIds, true)} class={'btn btn-default hidden-tiny'}>
              <i class="fal fa-eye" />
            </button>
            <button title="Set un-read" on:click={() => setRead(selectedBooksIds, false)} class="btn btn-default put-line-through hidden-tiny">
              <i class="fal fa-eye-slash" />
            </button>
          {/if}
        </div>
      </div>

      <!-- <BookSearchFilters {resultsCount} {disabled} /> -->
    </div>
  </div>
</div>
