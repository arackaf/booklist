<script lang="ts">
  import { getContext, onMount } from "svelte";
  import "./menu-bar-styles.scss";

  import measureHeight from "$lib/util/measureHeight";

  import ActiveSearchFilters from "./ActiveSearchFilters.svelte";
  //import { currentSearch as bookSearchState } from '../booksSearchState';
  //import { getBookSearchUiView } from '../booksUiState';
  import PagingButtons from "./PagingButtons.svelte";
  import MenuOptions from "./MenuOptions.svelte";
  //import { quickSearch } from '../setBookFilters';
  //import { BookResultsPacket } from '../booksState';

  import MobileMenu from "$lib/components/navigation/MobileMenu.svelte";

  import { searchState } from "../searchState";

  import { beforeNavigate, afterNavigate } from "$app/navigation";
  import QuickFormFiller from "./QuickFormFiller.svelte";
  import { sanitize } from "$lib/util/formDataHelpers";

  //export let bookResultsPacket: BookResultsPacket;
  let bookResultsPacket = {} as any;
  //$: ({ totalPages = null, resultsCount = null, booksLoaded } = bookResultsPacket);
  const totalPages = 1;
  const resultsCount = 50;
  const booksLoaded = true;

  const booksModuleContext: any = getContext("books-module-context");
  const { booksUiState } = booksModuleContext;

  export let uiView: any; //ReturnType<typeof getBookSearchUiView>;

  let quickSearchEl: any = {};

  $: ({ selectedBooks } = $booksUiState);
  $: selectedBooksIds = Object.keys(selectedBooks).filter(k => selectedBooks[k]);

  const resetSearch = () => {
    quickSearchEl.value = $searchState.search;
  };

  let mobileMenuOpen = false;
  const closeMobileMenu = () => {
    mobileMenuOpen = false;
  };

  function onFormData(evt: any) {
    const searchParams: URLSearchParams = evt.formData;
    sanitize(searchParams);
  }
</script>

<div class="books-menu-bar">
  <MobileMenu title="Book Options" onClose={() => (mobileMenuOpen = false)} open={mobileMenuOpen}>
    <div class="button-container" style="display: flex; flex-direction: column">
      <MenuOptions {closeMobileMenu} />
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
      <PagingButtons />
      <div style="margin-right: 5px">
        <div class="menu-bar-desktop btn-group">
          <form action="/books" on:formdata={onFormData}>
            <!-- svelte-ignore a11y-autofocus -->
            <input
              autofocus
              autocomplete="off"
              bind:this={quickSearchEl}
              value={$searchState.search}
              on:blur={resetSearch}
              name="search"
              class="form-control search-input tiny-orphan"
              placeholder="Title search"
            />
            <QuickFormFiller />
            {#each $searchState.subjects as subject}
              <input type="hidden" name="subjects" value={subject} />
            {/each}
          </form>
          <MenuOptions />
        </div>
      </div>

      <ActiveSearchFilters {resultsCount} />
    </div>
  </div>
</div>
