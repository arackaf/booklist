<script lang="ts">
  import { getContext } from "svelte";

  import { enhance } from "$app/forms";
  import { invalidate } from "$app/navigation";

  import Button from "$lib/components/ui/button/button.svelte";

  import BookReadSetter from "../BookReadSetter.svelte";
  import { endSaving, startSaving } from "../state/booksReadSavingState.svelte";
  import { selectionState } from "../state/selectionState.svelte";
  import { BookCheckIcon, BookXIcon, FilterIcon, RefreshCwIcon, TagIcon } from "lucide-svelte";
  import { cn } from "$lib/utils";

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
  const { openFilterModal, editSubjectsAndTags, editBooksSubjectsTags } = booksModuleContext;

  const getSelectedBooksIds = () => selectedBooksIds;

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
    <Button variant="outline" title="Filter search" onclick={openFilterModal} class="h-8 w-11 rounded-none border-r-0">
      <FilterIcon />
    </Button>
    {#if !isPublic}
      <Button variant="outline" title="Edit subjects and tags" onclick={editSubjectsAndTags} class="h-8 w-11 rounded-none border-r-0">
        <TagIcon />
      </Button>
    {/if}

    <form method="POST" action="?/reloadBooks" use:enhance={reload}>
      <Button variant="outline" class="h-8 w-11 rounded-l-none" type="submit" disabled={reloading}>
        <RefreshCwIcon class={cn({ "animate-spin": reloading })} />
      </Button>
    </form>
  {:else if !isPublic}
    <Button variant="outline" class="h-8 w-11 rounded-none border-r-0" title="Add/remove subjects" onclick={editBooksSubjectsTags}>
      <TagIcon />
    </Button>
    <BookReadSetter ids={selectedBooksIds} value={true} bind:saving={bulkReadSaving}>
      <Button type="submit" variant="outline" class="h-8 w-11 rounded-none border-r-0" title="Set read" disabled={bulkReadSaving || bulkUnReadSaving}>
        <BookCheckIcon />
      </Button>
    </BookReadSetter>
    <BookReadSetter ids={selectedBooksIds} value={false} bind:saving={bulkUnReadSaving}>
      <Button type="submit" variant="outline" class="h-8 w-11 rounded-l-none" title="Set un-read" disabled={bulkReadSaving || bulkUnReadSaving}>
        <BookXIcon />
      </Button>
    </BookReadSetter>
  {/if}
</div>
