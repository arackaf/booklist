<script lang="ts">
  import { enhance } from "$app/forms";
  import { invalidate } from "$app/navigation";
  import { getContext } from "svelte";
  import { writable } from "svelte/store";
  import BookReadSetter from "../BookReadSetter.svelte";
  import { BASIC_LIST_VIEW, COVERS_LIST, GRID_VIEW } from "../bookViews/constants";

  import { selectedBooksLookup } from "../selectionState";
  export let closeMobileMenu: () => void = () => {};

  let bulkReadSaving: boolean;
  let bulkUnReadSaving: boolean;

  let uiView: any = writable({}); // ReturnType<typeof getBookSearchUiView>;

  let reloading = false;
  const reload = () => {
    reloading = true;

    return async () => {
      invalidate("reload-books").then(() => {
        reloading = false;
      });
    };
  };

  const uiViewChange = () => {
    return async () => {
      invalidate("");
    };
  };

  const isPublic = false;

  const booksModuleContext: any = getContext("books-module-context");
  const { openFilterModal, editSubjects, editTags, editBooksSubjects, editBooksTags, onBooksUpdated } = booksModuleContext;

  const setRead = (a: any, b: any) => {};

  $: selectedBooksIds = Object.keys($selectedBooksLookup);
  $: selectedBooksCount = selectedBooksIds.length;

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

  const booksUpdated = () => {
    const _ids = selectedBooksIds;
    return async ({ result }: any) => {
      onBooksUpdated(_ids, result.data.updates);
      closeMobileMenu?.();
    };
  };
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
    <button class="btn btn-default" type="submit" disabled={reloading}>
      <span>Reload Books</span>
      <i class="fal fa-fw fa-sync" class:fa-spin={reloading} />
    </button>
  </form>
  <hr />
  <form method="POST" action="?/setBooksView" use:enhance={uiViewChange} on:submit={closeMobileMenu}>
    <input type="hidden" name="view" value={GRID_VIEW} />
    <button class={"btn btn-default " + ($uiView.pendingView == GRID_VIEW ? "active" : "")}>
      <span>Main View</span>
      <i class="fal fa-fw fa-table" />
    </button>
  </form>
  <form method="POST" action="?/setBooksView" use:enhance={uiViewChange} on:submit={closeMobileMenu}>
    <input type="hidden" name="view" value={COVERS_LIST} />
    <button class={"btn btn-default " + ($uiView.pendingView == COVERS_LIST ? "active" : "")}>
      <span>Covers View</span>
      <i class="fas fa-fw fa-th" />
    </button>
  </form>
  <form method="POST" action="?/setBooksView" use:enhance={uiViewChange} on:submit={closeMobileMenu}>
    <input type="hidden" name="view" value={BASIC_LIST_VIEW} />
    <button class={"btn btn-default last-child " + ($uiView.pendingView == BASIC_LIST_VIEW ? "active" : "")}>
      <span>Mobile View</span>
      <i class="fal fa-fw fa-list" />
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
  <BookReadSetter _ids={selectedBooksIds} value={true} bind:saving={bulkReadSaving}>
    <button title="Set read" class="btn btn-default" disabled={bulkReadSaving || bulkUnReadSaving}>
      <span>Set Read</span>
      <i class="fal fa-fw fa-eye" />
    </button>
  </BookReadSetter>
  <BookReadSetter _ids={selectedBooksIds} value={false} bind:saving={bulkUnReadSaving}>
    <button title="Set un-read" class="btn btn-default put-line-through last-child" disabled={bulkReadSaving || bulkUnReadSaving}>
      <span>Set Un-Read</span>
      <i class="fal fa-fw fa-eye-slash" />
    </button>
  </BookReadSetter>

  <hr />
{/if}
