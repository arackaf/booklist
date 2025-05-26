<script lang="ts">
  import { updateSearchParam } from "$lib/state/urlHelpers.svelte";

  import Button from "$lib/components/ui/button/button.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import MobileMenu from "$lib/components/navigation/MobileMenu.svelte";

  import ActiveSearchFilters from "./ActiveSearchFilters.svelte";
  import PagingButtons from "./PagingButtons.svelte";
  import BookViewsDesktop from "./BookViewsDesktop.svelte";
  import BookViewsMobile from "./BookViewsMobile.svelte";
  import MenuOptionsMobile from "./MenuOptionsMobile.svelte";
  import MenuOptionsDesktop from "./MenuOptionsDesktop.svelte";
  import { SearchState } from "../state/searchState.svelte";
  import PublicBooksHeader from "./PublicBooksHeader.svelte";
  import { MenuIcon } from "lucide-svelte";

  type Props = {
    isPublic: boolean;
    bookViewToUse: string;
    totalBooks: number;
  };

  let { isPublic, bookViewToUse, totalBooks }: Props = $props();

  const searchState = new SearchState();

  let quickSearchEl = $state<HTMLInputElement | null>(null);
  let mobileMenuOpen = $state(false);

  const resetSearch = () => {
    quickSearchEl!.value = searchState.value.search;
  };

  const closeMobileMenu = () => {
    mobileMenuOpen = false;
  };
</script>

<div class="sticky-content">
  <div class="scroll-gradient-flush"></div>
  <MobileMenu title="Search options" onClose={() => (mobileMenuOpen = false)} open={mobileMenuOpen}>
    <div class="flex flex-col gap-2 w-[175px]">
      <MenuOptionsMobile {isPublic} {closeMobileMenu} />
      <BookViewsMobile {bookViewToUse} {closeMobileMenu} />
    </div>
  </MobileMenu>

  <div class="pt-2" style="font-size: 11pt; position: relative">
    <div class="flex flex-wrap gap-2 items-center menu-bar-content pb-[5px]">
      <Button
        variant="outline"
        size="icon"
        class="lg:hidden text-xl"
        aria-label="Open mobile menu"
        onclick={() => (mobileMenuOpen = true)}
        data-mobile-menu
      >
        <MenuIcon class="w-5! h-5!" />
      </Button>
      {#if isPublic}
        <PublicBooksHeader />
      {/if}
      <PagingButtons />
      <div class="hidden sm:block">
        <div class="flex">
          <Input
            autocomplete="off"
            bind:ref={quickSearchEl}
            onkeydown={evt => evt.key === "Enter" && updateSearchParam("search", evt.currentTarget.value)}
            value={searchState.value.search}
            onblur={resetSearch}
            name="search"
            class="h-8 lg:rounded-tr-none lg:rounded-br-none lg:border-r-0 focus-visible:ring-0 focus-visible:ring-transparent focus-visible:outline-none"
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
