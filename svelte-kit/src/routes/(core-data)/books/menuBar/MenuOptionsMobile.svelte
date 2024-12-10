<script lang="ts">
  import { getContext } from "svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { enhance } from "$app/forms";
  import { invalidate } from "$app/navigation";

  import Input from "$lib/components/form-elements/Input/Input.svelte";
  import Button from "$lib/components/Button/Button.svelte";
  import BookReadSetter from "../BookReadSetter.svelte";

  import { endSaving, startSaving } from "../state/booksReadSavingState";
  import { selectedBooksLookup } from "../state/selectionState";
  import { searchState } from "../state/searchState";

  type Props = {
    isPublic: boolean;
    closeMobileMenu: () => void;
  };

  let { isPublic, closeMobileMenu }: Props = $props();

  let bulkReadSaving = $state(false);
  let bulkUnReadSaving = $state(false);
  let reloading = $state(false);
  let quickSearchEl = $state<any>({});

  let selectedBooksIds = $derived(Object.keys($selectedBooksLookup).map(s => +s));
  let selectedBooksCount = $derived(selectedBooksIds.length);

  const booksModuleContext: any = getContext("books-module-context");
  const { openFilterModal, editSubjects, editTags, editBooksSubjects, editBooksTags } = booksModuleContext;

  const getSelectedBooksIds = () => selectedBooksIds;

  const editSubjectsForSelectedBooks = () => editBooksSubjects();
  const editTagsForSelectedBooks = () => editBooksTags();

  const mobileHandler = (fn: () => unknown) => () => {
    setTimeout(() => {
      closeMobileMenu?.();
    }, 300);
    fn();
  };

  const reload = () => {
    reloading = true;
    return async () => {
      invalidate("reload:books").then(() => {
        reloading = false;
      });
    };
  };

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
    goto(newUrl);
    closeMobileMenu?.();
  };

  const resetSearch = () => {
    quickSearchEl.value = $searchState.search;
  };

  $effect(() => {
    if (bulkReadSaving || bulkUnReadSaving) {
      startSaving(getSelectedBooksIds());
    } else {
      endSaving(getSelectedBooksIds());
    }
  });
</script>

{#if !selectedBooksCount}
  <Input
    autocomplete="off"
    bind:inputEl={quickSearchEl}
    value={$searchState.search}
    on:blur={resetSearch}
    on:keydown={(evt: any) => {
      if (evt.code === "Enter") {
        runSearch();
      }
    }}
    name="search"
    class="h-8 m-0 mr-0"
    placeholder="Title search"
  />

  <hr class="m-0" />

  <Button title="Filter search" onclick={mobileHandler(openFilterModal)} class="h-8">
    <span>Set Filters</span>
    <i class="fal fa-fw fa-filter ml-auto"></i>
  </Button>
  <hr class="m-0" />
  {#if !isPublic}
    <Button title="Edit subjects" onclick={mobileHandler(editSubjects)} class="h-8">
      <span>Edit Subjects</span>
      <i class="fal fa-fw fa-sitemap ml-auto"></i>
    </Button>
    <Button title="Edit tags" onclick={mobileHandler(editTags)} class="h-8">
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
  <Button class="h-8" title="Add/remove subjects" onclick={mobileHandler(editSubjectsForSelectedBooks)}>
    <span>Edit Subjects</span>
    <i class="fal fa-fw fa-sitemap ml-auto"></i>
  </Button>
  <Button class="h-8" title="Add/remove tags" onclick={mobileHandler(editTagsForSelectedBooks)}>
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
