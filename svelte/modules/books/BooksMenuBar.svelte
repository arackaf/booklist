<script lang="ts">
  import { appState } from "app/state/appState";
  import { getContext } from "svelte";

  import measureHeight from "util/measureHeight";

  import ActiveSearchFilters from "./ActiveSearchFilters.svelte";
  import { currentSearch as bookSearchState } from "./booksSearchState";
  import { getBookSearchUiView, BASIC_LIST_VIEW, COVERS_LIST, GRID_VIEW } from "./booksUiState";
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
  export let books: any[];
  $: ({ books = [], totalPages = null, resultsCount = null, reload, booksLoading, booksLoaded } = bookResultsPacket);

  const booksModuleContext: any = getContext("books-module-context");
  const { booksUiState, openFilterModal, editSubjects, editTags, setRead, editBooksSubjects, editBooksTags } = booksModuleContext;

  export let uiView: ReturnType<typeof getBookSearchUiView>;
  const uiDispatch = view => $uiView.requestState({ type: "SET_PENDING_VIEW", value: view }, books);

  $: ({ selectedBooks } = $booksUiState);
  $: selectedBooksIds = Object.keys(selectedBooks).filter(k => selectedBooks[k]);
  $: selectedBooksCount = selectedBooksIds.length;

  const editSubjectsForSelectedBooks = () => editBooksSubjects(books.filter(b => selectedBooks[b._id]));
  const editTagsForSelectedBooks = () => editBooksTags(books.filter(b => selectedBooks[b._id]));

  let quickSearchEl;
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

  .searchInput { 
    width: 250px;
  }

  @media (max-width: 900px) {
    .searchInput { 
      width: 150px;
    }
  }
  @media (max-width: 600px) {
    .searchInput { 
      width: 100px;
    }
  }
  @media (max-width: 490px) {
    .searchInput { 
      width: 150px;
    }
  }
  @media (max-width: 390px) {
    .searchInput { 
      width: 100px;
    }
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
            class="form-control searchInput tiny-orphan"
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
                <button title="Edit tags" on:click={editTags} class="btn btn-default hidden-xs"><i class="fal fa-tags" /></button>
              {/if}
            {/if}
            <button class="btn btn-default hidden-tiny" on:click={reload} disabled={booksLoading}><i class="fal fa-sync" /></button>
            <button
              on:click={() => uiDispatch(GRID_VIEW)}
              class={'btn btn-default hidden-tiny ' + ($uiView.pendingView == GRID_VIEW ? 'active' : '')}
            >
              <i class="fal fa-table" />
            </button>
            <button
              on:click={() => uiDispatch(COVERS_LIST)}
              class={'btn btn-default hidden-tiny ' + ($uiView.pendingView == COVERS_LIST ? 'active' : '')}
            >
              <i class="fas fa-th" />
            </button>
            <button
              on:click={() => uiDispatch(BASIC_LIST_VIEW)}
              class={'btn btn-default hidden-tiny ' + ($uiView.pendingView == BASIC_LIST_VIEW ? 'active' : '')}
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

      <ActiveSearchFilters {resultsCount} />
    </div>
  </div>
</div>
