<script lang="ts">
  import { getContext } from "svelte";

  import { enhance } from "$app/forms";
  import { invalidate } from "$app/navigation";

  import Button from "$lib/components/ui/button/button.svelte";

  import BookReadSetter from "../BookReadSetter.svelte";
  import { endSaving, startSaving } from "../state/booksReadSavingState.svelte";
  import { selectionState } from "../state/selectionState.svelte";

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

<div class="hidden lg:flex">
  {#if !selectedBooksCount}
    <Button variant="outline" title="Filter search" onclick={openFilterModal} class="h-8 w-11 rounded-none border-r-0 border-neutral-300">
      <i class="fal fa-fw fa-filter"></i>
    </Button>
    {#if !isPublic}
      <Button variant="outline" title="Edit subjects" onclick={editSubjects} class="h-8 w-11 rounded-none border-r-0 border-neutral-300">
        <i class="fal fa-fw fa-sitemap"></i>
      </Button>
      <Button variant="outline" title="Edit tags" onclick={editTags} class="h-8 w-11 rounded-none border-r-0 border-neutral-300">
        <i class="fal fa-fw fa-tags"></i>
      </Button>
    {/if}

    <form method="POST" action="?/reloadBooks" use:enhance={reload}>
      <Button variant="outline" class="h-8 w-11 rounded-l-none border-neutral-300" type="submit" disabled={reloading}>
        <i class="fal fa-fw fa-sync" class:fa-spin={reloading}></i>
      </Button>
    </form>
  {:else if !isPublic}
    <Button class="h-8 connect-left connect-right" title="Add/remove subjects" onclick={editSubjectsForSelectedBooks}>
      <i class="fal fa-fw fa-sitemap"></i>
    </Button>
    <Button class="h-8 connect-left connect-right" title="Add/remove tags" onclick={editTagsForSelectedBooks}>
      <i class="fal fa-fw fa-tags"></i>
    </Button>
    <BookReadSetter ids={selectedBooksIds} value={true} bind:saving={bulkReadSaving}>
      <Button class="h-8 connect-left connect-right" title="Set read" disabled={bulkReadSaving || bulkUnReadSaving}>
        <i class="fal fa-fw fa-eye"></i>
      </Button>
    </BookReadSetter>
    <BookReadSetter ids={selectedBooksIds} value={false} bind:saving={bulkUnReadSaving}>
      <Button class="h-8 connect-left" title="Set un-read" disabled={bulkReadSaving || bulkUnReadSaving}>
        <i class="fal fa-fw fa-eye-slash"></i>
      </Button>
    </BookReadSetter>
  {/if}
</div>
