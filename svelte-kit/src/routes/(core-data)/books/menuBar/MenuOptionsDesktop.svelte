<script lang="ts">
  import { enhance } from "$app/forms";
  import { invalidate } from "$app/navigation";
  import { getContext } from "svelte";
  import BookReadSetter from "../BookReadSetter.svelte";

  import { endSaving, startSaving } from "../state/booksReadSavingState";

  import { selectedBooksLookup } from "../state/selectionState";
  import Button from "$lib/components/Button/Button.svelte";
  export let isPublic: boolean;

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

  $: {
    if (bulkReadSaving || bulkUnReadSaving) {
      startSaving(getSelectedBooksIds());
    } else {
      endSaving(getSelectedBooksIds());
    }
  }
</script>

{#if !selectedBooksCount}
  <Button title="Filter search" onclick={openFilterModal} class="hidden lg:flex h-8 connect-left connect-right">
    <i class="fal fa-fw fa-filter"></i>
  </Button>
  {#if !isPublic}
    <Button title="Edit subjects" onclick={editSubjects} class="hidden lg:flex h-8 connect-left connect-right">
      <i class="fal fa-fw fa-sitemap"></i>
    </Button>
    <Button title="Edit tags" onclick={editTags} class="hidden lg:flex h-8 connect-left connect-right">
      <i class="fal fa-fw fa-tags"></i>
    </Button>
  {/if}

  <form method="POST" action="?/reloadBooks" use:enhance={reload}>
    <Button class="hidden lg:flex h-8 connect-left" type="submit" disabled={reloading}>
      <i class="fal fa-fw fa-sync" class:fa-spin={reloading}></i>
    </Button>
  </form>
{:else if !isPublic}
  <Button class="hidden lg:flex h-8 connect-left connect-right" title="Add/remove subjects" onclick={editSubjectsForSelectedBooks}>
    <i class="fal fa-fw fa-sitemap"></i>
  </Button>
  <Button class="hidden lg:flex h-8 connect-left connect-right" title="Add/remove tags" onclick={editTagsForSelectedBooks}>
    <i class="fal fa-fw fa-tags"></i>
  </Button>
  <BookReadSetter ids={selectedBooksIds} value={true} bind:saving={bulkReadSaving}>
    <Button class="hidden lg:flex h-8 connect-left connect-right" title="Set read" disabled={bulkReadSaving || bulkUnReadSaving}>
      <i class="fal fa-fw fa-eye"></i>
    </Button>
  </BookReadSetter>
  <BookReadSetter ids={selectedBooksIds} value={false} bind:saving={bulkUnReadSaving}>
    <Button class="hidden lg:flex h-8 connect-left" title="Set un-read" disabled={bulkReadSaving || bulkUnReadSaving}>
      <i class="fal fa-fw fa-eye-slash"></i>
    </Button>
  </BookReadSetter>
{/if}
