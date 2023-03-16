<script lang="ts">
  import { enhance } from "$app/forms";
  import { invalidate } from "$app/navigation";
  import { getContext } from "svelte";
  import BookReadSetter from "../BookReadSetter.svelte";

  import { endSaving, startSaving } from "../state/booksReadSavingState";

  import { selectedBooksLookup } from "../state/selectionState";
  export let isPublic: boolean;
  export let closeMobileMenu: () => void = () => {};
  export let bookViewToUse: string;

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

  <button title="Filter search" on:click={mobileHandler(openFilterModal, true)} class="btn btn-default">
    <span>Set Filters</span>
    <i class="fal fa-fw fa-filter" />
  </button>
  <hr />
  {#if !isPublic}
    <button title="Edit subjects" on:click={mobileHandler(editSubjects, true)} class="btn btn-default">
      <span>Edit Subjects</span>
      <i class="fal fa-fw fa-sitemap" />
    </button>
    <button title="Edit tags" on:click={mobileHandler(editTags, true)} class="btn btn-default">
      <span>Edit Tags</span>
      <i class="fal fa-fw fa-tags" />
    </button>
    <hr />
  {/if}

  <form method="POST" action="?/reloadBooks" use:enhance={reload}>
    <button class="btn btn-default last-child" type="submit" disabled={reloading}>
      <span>Reload Books</span>
      <i class="fal fa-fw fa-sync" class:fa-spin={reloading} />
    </button>
  </form>
  <hr />
{:else if !isPublic}
  <hr />
  <button title="Add/remove subjects" on:click={mobileHandler(editSubjectsForSelectedBooks)} class={"btn btn-default"}>
    <span>Add / Remove Subjects</span>
    <i class="fal fa-fw fa-sitemap" />
  </button>
  <button title="Add/remove tags" on:click={mobileHandler(editTagsForSelectedBooks)} class="btn btn-default">
    <span>Add / Remove Tags</span>
    <i class="fal fa-fw fa-tags" />
  </button>
  <BookReadSetter ids={selectedBooksIds} value={true} bind:saving={bulkReadSaving}>
    <button title="Set read" class="btn btn-default" disabled={bulkReadSaving || bulkUnReadSaving}>
      <span>Set Read</span>
      <i class="fal fa-fw fa-eye" />
    </button>
  </BookReadSetter>
  <BookReadSetter ids={selectedBooksIds} value={false} bind:saving={bulkUnReadSaving}>
    <button title="Set un-read" class="btn btn-default put-line-through last-child" disabled={bulkReadSaving || bulkUnReadSaving}>
      <span>Set Un-Read</span>
      <i class="fal fa-fw fa-eye-slash" />
    </button>
  </BookReadSetter>
  <hr />
{/if}
