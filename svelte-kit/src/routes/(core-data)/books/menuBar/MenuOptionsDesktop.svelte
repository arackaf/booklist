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
  <Button title="Filter search" on:click={mobileHandler(openFilterModal, true)} class="hidden lg:flex h-8 connect-left connect-right">
    <i class="fal fa-fw fa-filter" />
  </Button>
  {#if !isPublic}
    <Button title="Edit subjects" on:click={mobileHandler(editSubjects, true)} class="hidden lg:flex h-8 connect-left connect-right">
      <i class="fal fa-fw fa-sitemap" />
    </Button>
    <Button title="Edit tags" on:click={mobileHandler(editTags, true)} class="hidden lg:flex h-8 connect-left connect-right">
      <i class="fal fa-fw fa-tags" />
    </Button>
  {/if}

  <form method="POST" action="?/reloadBooks" use:enhance={reload}>
    <Button class="hidden lg:flex h-8 connect-left" type="submit" disabled={reloading}>
      <i class="fal fa-fw fa-sync" class:fa-spin={reloading} />
    </Button>
  </form>
{:else if !isPublic}
  <Button class="hidden lg:flex h-8 connect-left connect-right" title="Add/remove subjects" on:click={mobileHandler(editSubjectsForSelectedBooks)}>
    <i class="fal fa-fw fa-sitemap" />
  </Button>
  <Button class="hidden lg:flex h-8 connect-left connect-right" title="Add/remove tags" on:click={mobileHandler(editTagsForSelectedBooks)}>
    <i class="fal fa-fw fa-tags" />
  </Button>
  <BookReadSetter ids={selectedBooksIds} value={true} bind:saving={bulkReadSaving}>
    <Button class="hidden lg:flex h-8 connect-left connect-right" title="Set read" disabled={bulkReadSaving || bulkUnReadSaving}>
      <i class="fal fa-fw fa-eye" />
    </Button>
  </BookReadSetter>
  <BookReadSetter ids={selectedBooksIds} value={false} bind:saving={bulkUnReadSaving}>
    <Button class="hidden lg:flex h-8 connect-left" title="Set un-read" disabled={bulkReadSaving || bulkUnReadSaving}>
      <i class="fal fa-fw fa-eye-slash" />
    </Button>
  </BookReadSetter>
{/if}
