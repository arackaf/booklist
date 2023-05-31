<script lang="ts">
  import "./menu-bar-styles.scss";

  import { sanitize } from "$lib/util/formDataHelpers";
  import MobileMenu from "$lib/components/navigation/MobileMenu.svelte";

  import ActiveSearchFilters from "./ActiveSearchFilters.svelte";
  import PagingButtons from "./PagingButtons.svelte";
  import MenuOptions from "./MenuOptions.svelte";
  import { publicUser, searchState } from "../state/searchState";
  import QuickFormFiller from "./QuickFormFiller.svelte";
  import PublicBooksHeader from "./PublicBooksHeader.svelte";
  import BookViews from "./BookViews.svelte";
  import Input from "$lib/components/ui/Input/Input.svelte";

  export let isPublic: boolean;
  export let bookViewToUse: string;

  let quickSearchEl: any = {};

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
      <MenuOptions {isPublic} {closeMobileMenu} />
      <BookViews {bookViewToUse} {closeMobileMenu} />
    </div>
  </MobileMenu>

  <div style="font-size: 11pt; position: relative">
    <div style="display: flex; flex-wrap: wrap; margin-bottom: 5px">
      <button
        style="font-size: 1.4rem; align-self: center"
        class="mobile-menu-button margin-right raw-button icon-button"
        aria-label="Open mobile menu"
        on:click={() => (mobileMenuOpen = true)}
      >
        <i class="far fa-fw fa-bars" />
      </button>
      {#if isPublic}
        <PublicBooksHeader />
      {/if}
      <PagingButtons />
      <div class="margin-right">
        <div class="menu-bar-desktop flex">
          <form action="/books" on:formdata={onFormData} data-sveltekit-keepfocus>
            {#if $publicUser}
              <input type="hidden" name="user" value={$publicUser} />
            {/if}
            <Input
              autocomplete="off"
              bind:inputEl={quickSearchEl}
              value={$searchState.search}
              on:blur={resetSearch}
              name="search"
              class="search-input rounded-tr-none rounded-br-none border-r-0 shadow-none"
              placeholder="Title search"
            />
            <QuickFormFiller />
            {#each $searchState.subjects as subject}
              <input type="hidden" name="subjects" value={subject} />
            {/each}
          </form>
          <MenuOptions {isPublic} />
        </div>
      </div>
      <div class="menu-bar-desktop btn-group margin-right">
        <BookViews {bookViewToUse} />
      </div>

      <ActiveSearchFilters />
    </div>
  </div>
</div>
