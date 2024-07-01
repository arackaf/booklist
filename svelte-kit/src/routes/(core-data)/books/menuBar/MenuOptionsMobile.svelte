<script lang="ts">
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";

  import { enhance } from "$app/forms";
  import { invalidate } from "$app/navigation";
  import Input from "$lib/components/form-elements/Input/Input.svelte";
  import Button from "$lib/components/Button/Button.svelte";

  import { getContext } from "svelte";
  import BookReadSetter from "../BookReadSetter.svelte";

  import { endSaving, startSaving } from "../state/booksReadSavingState";

  import { selectedBooksLookup } from "../state/selectionState";
  import { searchState } from "../state/searchState";

  export let isPublic: boolean;
  export let closeMobileMenu: () => void = () => {};

  let bulkReadSaving: boolean;
  let bulkUnReadSaving: boolean;

  let reloading = false;
  const reload = () => {
    reloading = true;

    return async () => {
      invalidate("reload:books").then(() => {
        reloading = false;
      });
    };
  };

  const booksModuleContext: any = getContext("books-module-context");
  const { openFilterModal, editSubjects, editTags, editBooksSubjects, editBooksTags } = booksModuleContext;

  $: selectedBooksIds = Object.keys($selectedBooksLookup).map(s => +s);
  $: selectedBooksCount = selectedBooksIds.length;
  const getSelectedBooksIds = () => selectedBooksIds;

  const editSubjectsForSelectedBooks = () => editBooksSubjects();
  const editTagsForSelectedBooks = () => editBooksTags();

  const mobileHandler = (fn: () => unknown) => () => {
    setTimeout(() => {
      closeMobileMenu?.();
    }, 300);
    fn();
  };

  $: {
    if (bulkReadSaving || bulkUnReadSaving) {
      startSaving(getSelectedBooksIds());
    } else {
      endSaving(getSelectedBooksIds());
    }
  }

  let quickSearchEl: any = {};

  const runSearch = () => {
    const searchParams = new URLSearchParams($page.url.searchParams);
    const newSearch = quickSearchEl.value;

    if (!newSearch) {
      searchParams.delete("search");
    } else {
      searchParams.set("search", newSearch);
    }

    const newUrl = new URL($page.url);
    newUrl.search = searchParams.toString();
    goto(newUrl).then(val => {
      console.log({ val });
    });
    closeMobileMenu?.();
  };
  const resetSearch = () => {
    quickSearchEl.value = $searchState.search;
  };
</script>

{#if !selectedBooksCount}
  <Input
    autocomplete="off"
    bind:inputEl={quickSearchEl}
    value={$searchState.search}
    on:blur={resetSearch}
    on:keydown={evt => {
      if (evt.code === "Enter") {
        runSearch();
      }
    }}
    name="search"
    class="h-8 m-0 mr-0"
    placeholder="Title search"
  />

  <hr class="m-0" />

  <Button title="Filter search" on:click={mobileHandler(openFilterModal)} class="h-8">
    <span>Set Filters</span>
    <i class="fal fa-fw fa-filter ml-auto"></i>
  </Button>
  <hr class="m-0" />
  {#if !isPublic}
    <Button title="Edit subjects" on:click={mobileHandler(editSubjects)} class="h-8">
      <span>Edit Subjects</span>
      <i class="fal fa-fw fa-sitemap ml-auto"></i>
    </Button>
    <Button title="Edit tags" on:click={mobileHandler(editTags)} class="h-8">
      <span>Edit Tags</span>
      <i class="fal fa-fw fa-tags ml-auto"></i>
    </Button>
    <hr class="m-0" />
  {/if}

  <form method="POST" action="?/reloadBooks" class="contents" use:enhance={reload}>
    <Button class="h-8" type="submit" disabled={reloading}>
      <span>Reload Books</span>
      <i class="fal fa-fw fa-sync ml-auto" class:fa-spin={reloading}></i>
    </Button>
  </form>
  <hr class="m-0" />
{:else if !isPublic}
  <hr class="m-0" />
  <Button class="h-8" title="Add/remove subjects" on:click={mobileHandler(editSubjectsForSelectedBooks)}>
    <span>Edit Subjects</span>
    <i class="fal fa-fw fa-sitemap ml-auto"></i>
  </Button>
  <Button class="h-8" title="Add/remove tags" on:click={mobileHandler(editTagsForSelectedBooks)}>
    <span>Edit Tags</span>
    <i class="fal fa-fw fa-tags ml-auto"></i>
  </Button>
  <BookReadSetter ids={selectedBooksIds} value={true} bind:saving={bulkReadSaving}>
    <Button class="h-8" title="Set read" disabled={bulkReadSaving || bulkUnReadSaving}>
      <span>Set Read</span>
      <i class="fal fa-fw fa-eye ml-auto"></i>
    </Button>
  </BookReadSetter>
  <BookReadSetter ids={selectedBooksIds} value={false} bind:saving={bulkUnReadSaving}>
    <Button class="h-8" title="Set un-read" disabled={bulkReadSaving || bulkUnReadSaving}>
      <span>Set Un-Read</span>
      <i class="fal fa-fw fa-eye-slash ml-auto"></i>
    </Button>
  </BookReadSetter>
  <hr class="m-0" />
{/if}
