<script>
  //
  let measureRef = null;
  let bookSearchState = {};
  let resetSearch = () => {};
  let quickSearchType = () => {};
  let reloadBooks = () => {};
  let uiDispatch = () => {};
  let editSubjectsForSelectedBooks = () => {};
  let editTagsForSelectedBooks = () => {};
  let setRead = () => {};
  let searchInput = "";
  let selectedBooksCount = 0;
  let online = true;
  let actions = {};
  let uiView = {};
  let selectedBooksIds = {};
  let isPublic = false;
  let booksLoading = false;
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

<div class="root" ref={measureRef}>
  <div class="booksMenuBar" style="font-size: 11pt; padding-bottom: 5px; position: relative">
    <div style="display: flex; flex-wrap: wrap; margin-bottom: 5px">
      <!-- {isPublic ? <PublicBooksHeader /> : null} -->
      <!-- <PagingButtons {...{ selectedBooksCount, totalPages, resultsCount, Button, disabled }} /> -->
      <div style="margin-right: 5px">
        <div class="btn-group">
          <input
            autocomplete="off"
            bind:this={quickSearchEl}
            defaultValue={bookSearchState.search}
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
                on:click={actions.beginEditFilters}
                class="btn btn-default hidden-tiny"
              >
                <i class="fal fa-filter" />
              </button>
              {#if !isPublic}
                <button title="Edit subjects" onClick={actions.editSubjects} class="btn btn-default hidden-xs"><i class="fal fa-sitemap" /></button>
                <button title="Edit tags" onClick={actions.editTags} class="btn btn-default hidden-xs"><i class="fal fa-tags" /></button>
              {/if}
            {/if}
            <button class="btn btn-default hidden-tiny" on:click={reloadBooks} disabled={booksLoading}><i class="fal fa-sync" /></button>
            <button
              onClick={() => uiDispatch({ type: 'SET_GRID_VIEW' })}
              class={'btn btn-default hidden-tiny ' + (uiView.isGridView ? 'active' : '')}
            >
              <i class="fal fa-table" />
            </button>
            <button
              onClick={() => uiDispatch({ type: 'SET_COVERS_LIST_VIEW' })}
              class={'btn btn-default hidden-tiny ' + (uiView.isCoversList ? 'active' : '')}
            >
              <i class="fas fa-th" />
            </button>
            <button
              onClick={() => uiDispatch({ type: 'SET_BASIC_LIST_VIEW' })}
              class={'btn btn-default hidden-tiny ' + (uiView.isBasicList ? 'active' : '')}
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
