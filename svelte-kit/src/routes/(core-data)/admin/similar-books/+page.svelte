<script lang="ts">
  import { page } from "$app/stores";
  import SelectAndDisplayContainer from "$lib/components/subjectsAndTags/SelectAndDisplayContainer.svelte";
  import DisplaySelectedSubjects from "$lib/components/subjectsAndTags/subjects/DisplaySelectedSubjects.svelte";
  import SelectAvailableSubjects from "$lib/components/subjectsAndTags/subjects/SelectAvailableSubjects.svelte";
  import Button from "$lib/components/Button/Button.svelte";
  import { updateSearchParam } from "$lib/state/urlHelpers";

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
        <label class="checkbox">
          <input type="checkbox" name="my-books" value="true" checked={currentlyChecked} />
          Only show my books
        </label>
        <div class="relative suppress-dropdown">
          <SelectAndDisplayContainer>
            <SelectAvailableSubjects slot="select" {subjects} currentlySelected={localSubjects} onSelect={selectSubject} />
            <DisplaySelectedSubjects slot="display" {subjects} currentlySelected={localSubjects} onRemove={removeSubject} />
          </SelectAndDisplayContainer>
        </div>
      </div>
      <div class="flex gap-3">
        <Button size="med" theme="primary" class="self-start">Search</Button>
        <Button size="med" theme="default" onclick={() => updateSearchParam("page", "")} disabled={pageNumber === 1}>
          <i class="fal fa-fw fa-angle-double-left"></i>
        </Button>
        <Button size="med" theme="default" onclick={() => updateSearchParam("page", nextPageDown)} disabled={pageNumber === 1}>
          <i class="fal fa-fw fa-angle-left"></i>
        </Button>
        <Button size="med" theme="default" onclick={() => updateSearchParam("page", nextPageUp)} disabled={books.length < 50}>
          <i class="fal fa-fw fa-angle-right"></i>
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
