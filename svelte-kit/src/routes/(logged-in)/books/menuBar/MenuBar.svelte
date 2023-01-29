<script lang="ts">
  import "./menu-bar-styles.scss";

  import { page } from "$app/stores";
  import { sanitize } from "$lib/util/formDataHelpers";
  import MobileMenu from "$lib/components/navigation/MobileMenu.svelte";

  import ActiveSearchFilters from "./ActiveSearchFilters.svelte";
  import PagingButtons from "./PagingButtons.svelte";
  import MenuOptions from "./MenuOptions.svelte";
  import { searchState } from "../state/searchState";
  import QuickFormFiller from "./QuickFormFiller.svelte";
  import PublicBooksHeader from "./PublicBooksHeader.svelte";

  $: ({ isPublic } = $page.data);

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
      {#if isPublic}
        <PublicBooksHeader />
      {/if}
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

      <ActiveSearchFilters />
    </div>
  </div>
</div>
