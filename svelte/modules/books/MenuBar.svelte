<script lang="ts">
  import { getContext } from "svelte";
  import cn from "classnames";
  import "./menu-bar-styles.scss";

  import measureHeight from "util/measureHeight";

  import ActiveSearchFilters from "./ActiveSearchFilters.svelte";
  import { currentSearch as bookSearchState } from "./booksSearchState";
  import { getBookSearchUiView } from "./booksUiState";
  import PagingButtons from "./PagingButtons.svelte";
  import MenuOptions from "./MenuOptions.svelte";
  import { quickSearch } from "./setBookFilters";
  import { BookResultsPacket } from "./booksState";

  export let setMenuBarHeight;
  export let bookResultsPacket: BookResultsPacket;
  $: ({ totalPages = null, resultsCount = null, booksLoaded } = bookResultsPacket);

  const booksModuleContext: any = getContext("books-module-context");
  const { booksUiState } = booksModuleContext;

  export let uiView: ReturnType<typeof getBookSearchUiView>;

  $: ({ selectedBooks } = $booksUiState);
  $: selectedBooksIds = Object.keys(selectedBooks).filter(k => selectedBooks[k]);
  $: selectedBooksCount = selectedBooksIds.length;

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

  let mobileMenuOpen = false;
  //<!-- {isPublic ? <PublicBooksHeader /> : null} -->
</script>

<div class="books-menu-bar" use:measureHeight={setMenuBarHeight}>
  <div class={cn("mobile-menu", { open: mobileMenuOpen })}>
    <div>
      <div style="display: flex">
        <a style="font-size: 1.4rem; align-self: start" on:click={() => (mobileMenuOpen = false)}>
          <i class="far fa-bars" />
        </a>
        <h3 style="margin: 0 0 0 10px; align-self: center">Book Options</h3>
      </div>
      <div class="button-container" style="display: flex; flex-direction: column">
        <MenuOptions {uiView} {bookResultsPacket} />
      </div>
    </div>
  </div>

  <div style="font-size: 11pt; position: relative">
    <div style="display: flex; flex-wrap: wrap; margin-bottom: 5px">
      <a style="font-size: 1.4rem; align-self: center" class="mobile-menu-button margin-right" on:click={() => (mobileMenuOpen = true)}>
        <i class="far fa-bars" />
      </a>
      <PagingButtons {...{ selectedBooksCount, totalPages, resultsCount, booksLoaded }} />
      <div style="margin-right: 5px">
        <div class="menu-bar-desktop btn-group">
          <input
            autocomplete="off"
            bind:this={quickSearchEl}
            value={$bookSearchState.search}
            on:blur={resetSearch}
            name="search"
            class="form-control search-input tiny-orphan"
            placeholder="Title search"
            on:keydown={quickSearchType}
          />
          <MenuOptions {uiView} {bookResultsPacket} />
        </div>
      </div>

      <ActiveSearchFilters {resultsCount} />
    </div>
  </div>
</div>
