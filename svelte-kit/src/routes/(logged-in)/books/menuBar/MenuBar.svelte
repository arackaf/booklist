<script lang="ts">
  import { getContext } from "svelte";
  import cn from "classnames";
  import "./menu-bar-styles.scss";

  import measureHeight from "$lib/util/measureHeight";

  import ActiveSearchFilters from "./ActiveSearchFilters.svelte";
  //import { currentSearch as bookSearchState } from '../booksSearchState';
  //import { getBookSearchUiView } from '../booksUiState';
  import PagingButtons from "./PagingButtons.svelte";
  import MenuOptions from "./MenuOptions.svelte";
  //import { quickSearch } from '../setBookFilters';
  //import { BookResultsPacket } from '../booksState';

  //import MobileMenu from 'app/components/navigation/MobileMenu.svelte';

  import { getStores, navigating, page, updated } from "$app/stores";
  import { goto } from "$app/navigation";
  import { searchState } from "../searchState";
  import { enhance } from "$app/forms";

  import { beforeNavigate, afterNavigate } from "$app/navigation";
  import QuickFormFiller from "./QuickFormFiller.svelte";

  export let setMenuBarHeight: any;
  //export let bookResultsPacket: BookResultsPacket;
  let bookResultsPacket = {} as any;
  //$: ({ totalPages = null, resultsCount = null, booksLoaded } = bookResultsPacket);
  const totalPages = 1;
  const resultsCount = 50;
  const booksLoaded = true;

  const booksModuleContext: any = getContext("books-module-context");
  const { booksUiState } = booksModuleContext;

  export let uiView: any; //ReturnType<typeof getBookSearchUiView>;

  $: ({ selectedBooks } = $booksUiState);
  $: selectedBooksIds = Object.keys(selectedBooks).filter(k => selectedBooks[k]);
  $: selectedBooksCount = selectedBooksIds.length;

  let quickSearchEl: any = {};
  const resetSearch = () => {
    quickSearchEl.value = $searchState.search;
  };

  let mobileMenuOpen = false;
  const closeMobileMenu = () => {
    mobileMenuOpen = false;
  };

  function onFormData(evt: any) {
    //const entries: FormData = evt.data;
    //if (!entries.get('search')) {
    //entries.delete('search');
    //}
    // return async (obj: any) => {
    // 	debugger;
    // 	await obj.update();
    // };
  }

  beforeNavigate(({ type }) => {
    console.log("BEFORE");
    //focused = document.activeElement;
  });

  afterNavigate(({ type }) => {
    console.log("AFTER");
    if (type === "form") {
      //focused?.focus();
    }
  });
</script>

<div class="books-menu-bar" use:measureHeight={setMenuBarHeight}>
  <!-- <MobileMenu title="Book Options" onClose={() => (mobileMenuOpen = false)} open={mobileMenuOpen}>
		<div class="button-container" style="display: flex; flex-direction: column">
			<MenuOptions {uiView} {bookResultsPacket} {closeMobileMenu} />
		</div>
	</MobileMenu> -->

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
          <MenuOptions {uiView} {bookResultsPacket} />
        </div>
      </div>

      <ActiveSearchFilters {resultsCount} />
    </div>
  </div>
</div>
