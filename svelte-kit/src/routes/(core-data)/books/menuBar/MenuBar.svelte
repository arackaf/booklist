<script lang="ts">
  import MobileMenu from "$lib/components/navigation/MobileMenu.svelte";
  import ActiveSearchFilters from "./ActiveSearchFilters.svelte";
  import PagingButtons from "./PagingButtons.svelte";
  import BookViewsDesktop from "./BookViewsDesktop.svelte";
  import BookViewsMobile from "./BookViewsMobile.svelte";
  import MenuOptionsMobile from "./MenuOptionsMobile.svelte";
  import MenuOptionsDesktop from "./MenuOptionsDesktop.svelte";
  import { SearchState } from "../state/searchState.svelte";
  import PublicBooksHeader from "./PublicBooksHeader.svelte";
  import Input from "$lib/components/form-elements/Input/Input.svelte";
  import RawButton from "$lib/components/Button/RawButton.svelte";
  import { updateSearchParam } from "$lib/state/urlHelpers.svelte";

  type Props = {
    isPublic: boolean;
    bookViewToUse: string;
    totalBooks: number;
  };

  let { isPublic, bookViewToUse, totalBooks }: Props = $props();

  const searchState = new SearchState();

  let quickSearchEl = $state<any>({});
  let mobileMenuOpen = $state(false);

  const resetSearch = () => {
    quickSearchEl.value = searchState.value.search;
  };

  const closeMobileMenu = () => {
    mobileMenuOpen = false;
  };
</script>

<div class="sticky-content p-2">
  <MobileMenu title="Search options" onClose={() => (mobileMenuOpen = false)} open={mobileMenuOpen}>
    <div class="flex flex-col gap-2 w-[175px] mt-4 mb-2">
      <MenuOptionsMobile {isPublic} {closeMobileMenu} />
      <BookViewsMobile {bookViewToUse} {closeMobileMenu} />
    </div>
  </MobileMenu>

  <div style="font-size: 11pt; position: relative">
    <div class="flex flex-wrap gap-2 items-center" style="margin-bottom: 5px">
      <RawButton
        style="font-size: 1.4rem; align-self: center"
        class="block lg:hidden leading-none"
        aria-label="Open mobile menu"
        onClick={() => (mobileMenuOpen = true)}
        data-mobile-menu
      >
        <i class="far fa-fw fa-bars"></i>
      </RawButton>
      {#if isPublic}
        <PublicBooksHeader />
      {/if}
      <PagingButtons />
      <div class="hidden sm:block">
        <div class="flex">
          <Input
            size="sm"
            autocomplete="off"
            bind:inputEl={quickSearchEl}
            onkeydown={evt => evt.key === "Enter" && updateSearchParam("search", evt.currentTarget.value)}
            value={searchState.value.search}
            onblur={resetSearch}
            name="search"
            class="lg:rounded-tr-none lg:rounded-br-none lg:border-r-0"
            placeholder="Title search"
          />
          <MenuOptionsDesktop {isPublic} />
        </div>
      </div>
      <div class="hidden lg:flex">
        <BookViewsDesktop {bookViewToUse} />
      </div>

      <ActiveSearchFilters {totalBooks} />
    </div>
  </div>
</div>
