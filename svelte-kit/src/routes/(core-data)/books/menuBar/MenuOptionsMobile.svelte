<script lang="ts">
  import { getContext } from "svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { enhance } from "$app/forms";
  import { invalidate } from "$app/navigation";

  import Button from "$lib/components/ui/button/button.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import Separator from "$lib/components/ui/separator/separator.svelte";

  import BookReadSetter from "../BookReadSetter.svelte";

  import { endSaving, startSaving } from "../state/booksReadSavingState.svelte";
  import { selectionState } from "../state/selectionState.svelte";
  import { SearchState } from "../state/searchState.svelte";

  type Props = {
    isPublic: boolean;
    closeMobileMenu: () => void;
  };

  let { isPublic, closeMobileMenu }: Props = $props();

  const searchState = new SearchState();

  let bulkReadSaving = $state(false);
  let bulkUnReadSaving = $state(false);
  let reloading = $state(false);
  let quickSearchEl = $state<HTMLInputElement | null>(null);

  let selectedBooksIds = $derived(Object.keys(selectionState.selectedBooksLookup).map(s => +s));
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
    const newSearch = quickSearchEl!.value;

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
    quickSearchEl!.value = searchState.value.search;
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
    bind:ref={quickSearchEl}
    value={searchState.value.search}
    onblur={resetSearch}
    onkeydown={(evt: any) => {
      if (evt.code === "Enter") {
        runSearch();
      }
    }}
    name="search"
    class=""
    placeholder="Title search"
  />

  <Separator class="my-0 h-[2px]" />

  <Button variant="outline" size="sm" title="Filter search" onclick={mobileHandler(openFilterModal)}>
    <span>Set Filters</span>
    <i class="fal fa-fw fa-filter ml-auto"></i>
  </Button>
  <Separator class="my-0 h-[2px]" />
  {#if !isPublic}
    <Button variant="outline" size="sm" title="Edit subjects" onclick={mobileHandler(editSubjects)}>
      <span>Edit Subjects</span>
      <i class="fal fa-fw fa-sitemap ml-auto"></i>
    </Button>
    <Button variant="outline" size="sm" title="Edit tags" onclick={mobileHandler(editTags)}>
      <span>Edit Tags</span>
      <i class="fal fa-fw fa-tags ml-auto"></i>
    </Button>
    <Separator class="my-0 h-[2px]" />
  {/if}

  <form method="POST" action="?/reloadBooks" class="contents" use:enhance={reload}>
    <Button variant="outline" size="sm" type="submit" disabled={reloading}>
      <span>Reload Books</span>
      <i class="fal fa-fw fa-sync ml-auto" class:fa-spin={reloading}></i>
    </Button>
  </form>
  <Separator class="my-0 h-[2px]" />
{:else if !isPublic}
  <Separator class="my-0 h-[2px]" />
  <Button variant="outline" size="sm" title="Add/remove subjects" onclick={mobileHandler(editSubjectsForSelectedBooks)}>
    <span>Edit Subjects</span>
    <i class="fal fa-fw fa-sitemap ml-auto"></i>
  </Button>
  <Button variant="outline" size="sm" title="Add/remove tags" onclick={mobileHandler(editTagsForSelectedBooks)}>
    <span>Edit Tags</span>
    <i class="fal fa-fw fa-tags ml-auto"></i>
  </Button>
  <BookReadSetter ids={selectedBooksIds} value={true} bind:saving={bulkReadSaving}>
    <Button variant="outline" size="sm" title="Set read" disabled={bulkReadSaving || bulkUnReadSaving}>
      <span>Set Read</span>
      <i class="fal fa-fw fa-eye ml-auto"></i>
    </Button>
  </BookReadSetter>
  <BookReadSetter ids={selectedBooksIds} value={false} bind:saving={bulkUnReadSaving}>
    <Button variant="outline" size="sm" title="Set un-read" disabled={bulkReadSaving || bulkUnReadSaving}>
      <span>Set Un-Read</span>
      <i class="fal fa-fw fa-eye-slash ml-auto"></i>
    </Button>
  </BookReadSetter>
  <Separator class="my-0 h-[2px]" />
{/if}
