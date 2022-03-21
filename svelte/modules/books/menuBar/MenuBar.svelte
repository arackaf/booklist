<script lang="ts">
  import { getContext } from "svelte";
  import cn from "classnames";
  import "./menu-bar-styles.scss";

  import measureHeight from "util/measureHeight";

  import ActiveSearchFilters from "./ActiveSearchFilters.svelte";
  import { currentSearch as bookSearchState } from "../booksSearchState";
  import { getBookSearchUiView } from "../booksUiState";
  import PagingButtons from "./PagingButtons.svelte";
  import MenuOptions from "./MenuOptions.svelte";
  import { quickSearch } from "../setBookFilters";
  import { BookResultsPacket } from "../booksState";

  import MobileMenu from "app/components/navigation/MobileMenu.svelte";

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
  const closeMobileMenu = () => {
    mobileMenuOpen = false;
  };
</script>

<div class="books-menu-bar" use:measureHeight={setMenuBarHeight}>
  <MobileMenu title="Book Options" onClose={() => (mobileMenuOpen = false)} open={mobileMenuOpen}>
    <div class="button-container" style="display: flex; flex-direction: column">
      <MenuOptions {uiView} {bookResultsPacket} {closeMobileMenu} />
    </div>
  </MobileMenu>

  <div style="font-size: 11pt; position: relative">
    <div style="display: flex; flex-wrap: wrap; margin-bottom: 5px">
      <button
        style="font-size: 1.4rem; align-self: center"
        class="mobile-menu-button margin-right raw-button icon-button"
        on:click={() => (mobileMenuOpen = true)}
      >
        <i class="far fa-bars" />
      </button>
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
