<script lang="ts">
  import { ChevronFirstIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-svelte";

  import { page } from "$app/stores";

  import Button from "$lib/components/ui/button/button.svelte";
  import Checkbox from "$lib/components/ui/checkbox/checkbox.svelte";
  import { Label } from "$lib/components/ui/label";

  import SelectAndDisplayContainer from "$lib/components/subjectsAndTags/SelectAndDisplayContainer.svelte";
  import DisplaySelectedSubjects from "$lib/components/subjectsAndTags/subjects/DisplaySelectedSubjects.svelte";
  import SelectAvailableSubjects from "$lib/components/subjectsAndTags/subjects/SelectAvailableSubjects.svelte";
  import { updateSearchParam } from "$lib/state/urlHelpers.svelte";

  import BookDisplay from "./BookDisplay.svelte";
  import SimilarBooks from "./SimilarBooks.svelte";

  let { data } = $props();

  let currentlyChecked = $derived(!!$page.url.searchParams.get("my-books"));
  let pageNumber = $derived(parseInt($page.url.searchParams.get("page") || "1", 10));
  let nextPageDown = $derived(pageNumber == 2 ? "" : pageNumber - 1);
  let nextPageUp = $derived(pageNumber + 1);

  let { books, subjects } = $derived(data);

  let localSubjects = $state<any[]>([]);

  const selectSubject = (subject: any) => (localSubjects = localSubjects.concat(subject.id));
  const removeSubject = (subject: any) => (localSubjects = localSubjects.filter(id => id != subject.id));
</script>

<section class="flex flex-col gap-3">
  <div class="flex gap-3">
    <div class="flex flex-col gap-3">
      <h1 class="text-lg font-bold">Filter</h1>
      <div class="flex flex-row items-center gap-4">
        <div class="flex items-center gap-2">
          <Checkbox id="search-my-books" name="my-books" value="true" checked={currentlyChecked} />
          <Label for="search-my-books" class="checkbox">Only show my books</Label>
        </div>
        <div class="relative suppress-dropdown">
          <SelectAndDisplayContainer>
            {#snippet select()}
              <SelectAvailableSubjects {subjects} currentlySelected={localSubjects} onSelect={selectSubject} popoverClass="z-40" />
            {/snippet}
            {#snippet display()}
              <DisplaySelectedSubjects {subjects} currentlySelected={localSubjects} onRemove={removeSubject} />
            {/snippet}
          </SelectAndDisplayContainer>
        </div>
      </div>
      <div class="flex gap-3">
        <Button size="sm" class="self-start">Search</Button>
        <Button class="h-8" variant="outline" onclick={() => updateSearchParam("page", "")} disabled={pageNumber === 1}>
          <ChevronFirstIcon />
        </Button>
        <Button class="h-8" variant="outline" onclick={() => updateSearchParam("page", nextPageDown)} disabled={pageNumber === 1}>
          <ChevronLeftIcon />
        </Button>
        <Button class="h-8" variant="outline" onclick={() => updateSearchParam("page", nextPageUp)} disabled={books.length < 50}>
          <ChevronRightIcon />
        </Button>
      </div>
    </div>
  </div>

  <div class="list">
    {#each books as book}
      <div class="flex flex-col lg:flex-row gap-3 mb-3 p-4 rounded border border-neutral-400">
        <BookDisplay {book} />
        <div class="flex-1 flex flex-col overflow-hidden">
          <SimilarBooks {book} />
        </div>
      </div>
    {/each}
  </div>
</section>
