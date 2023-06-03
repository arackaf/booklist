<script lang="ts">
  import { enhance } from "$app/forms";
  import { invalidate } from "$app/navigation";
  import { getContext } from "svelte";
  import BookReadSetter from "../BookReadSetter.svelte";

  import { endSaving, startSaving } from "../state/booksReadSavingState";

  import { selectedBooksLookup } from "../state/selectionState";
  import Button from "$lib/components/ui/Button/Button.svelte";
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

  const mobileHandler =
    (fn: () => unknown, delay = false) =>
    () => {
      setTimeout(
        () => {
          closeMobileMenu?.();
        },
        delay ? 300 : 0
      );
      fn();
    };

  $: {
    if (bulkReadSaving || bulkUnReadSaving) {
      startSaving(getSelectedBooksIds());
    } else {
      endSaving(getSelectedBooksIds());
    }
  }
</script>

{#if !selectedBooksCount}
  <hr />

  <Button title="Filter search" on:click={mobileHandler(openFilterModal, true)} class="h-8">
    <span>Set Filters</span>
    <i class="fal fa-fw fa-filter" />
  </Button>
  <hr />
  {#if !isPublic}
    <Button title="Edit subjects" on:click={mobileHandler(editSubjects, true)} class="h-8">
      <span>Edit Subjects</span>
      <i class="fal fa-fw fa-sitemap" />
    </Button>
    <Button title="Edit tags" on:click={mobileHandler(editTags, true)} class="h-8">
      <span>Edit Tags</span>
      <i class="fal fa-fw fa-tags" />
    </Button>
    <hr />
  {/if}

  <form method="POST" action="?/reloadBooks" use:enhance={reload}>
    <Button class="h-8" type="submit" disabled={reloading}>
      <span>Reload Books</span>
      <i class="fal fa-fw fa-sync" class:fa-spin={reloading} />
    </Button>
  </form>
  <hr />
{:else if !isPublic}
  <hr />
  <Button class="h-8" title="Add/remove subjects" on:click={mobileHandler(editSubjectsForSelectedBooks)}>
    <span>Add / Remove Subjects</span>
    <i class="fal fa-fw fa-sitemap" />
  </Button>
  <Button class="h-8" title="Add/remove tags" on:click={mobileHandler(editTagsForSelectedBooks)}>
    <span>Add / Remove Tags</span>
    <i class="fal fa-fw fa-tags" />
  </Button>
  <BookReadSetter ids={selectedBooksIds} value={true} bind:saving={bulkReadSaving}>
    <Button class="h-8" title="Set read" disabled={bulkReadSaving || bulkUnReadSaving}>
      <span>Set Read</span>
      <i class="fal fa-fw fa-eye" />
    </Button>
  </BookReadSetter>
  <BookReadSetter ids={selectedBooksIds} value={false} bind:saving={bulkUnReadSaving}>
    <Button class="h-8" title="Set un-read" disabled={bulkReadSaving || bulkUnReadSaving}>
      <span>Set Un-Read</span>
      <i class="fal fa-fw fa-eye-slash" />
    </Button>
  </BookReadSetter>
  <hr />
{/if}
