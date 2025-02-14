<script lang="ts">
  import { enhance } from "$app/forms";
  import { invalidate } from "$app/navigation";
  import { getContext } from "svelte";
  import BookReadSetter from "../BookReadSetter.svelte";

  import { endSaving, startSaving } from "../state/booksReadSavingState.svelte";
  import { selectionState } from "../state/selectionState.svelte";
  import Button from "$lib/components/Button/Button.svelte";

  type Props = {
    isPublic: boolean;
  };

  let { isPublic }: Props = $props();

  let bulkReadSaving = $state(false);
  let bulkUnReadSaving = $state(false);
  let reloading = $state(false);

  let selectedBooksIds = $derived(Object.keys(selectionState.selectedBooksLookup).map(s => +s));
  let selectedBooksCount = $derived(selectedBooksIds.length);

  const booksModuleContext: any = getContext("books-module-context");
  const { openFilterModal, editSubjects, editTags, editBooksSubjects, editBooksTags } = booksModuleContext;

  const getSelectedBooksIds = () => selectedBooksIds;
  const editSubjectsForSelectedBooks = () => editBooksSubjects();
  const editTagsForSelectedBooks = () => editBooksTags();

  const reload = () => {
    reloading = true;
    return async () => {
      invalidate("reload:books").then(() => {
        reloading = false;
      });
    };
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
