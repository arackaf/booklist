<script lang="ts">
  import { page } from "$app/stores";
  import type { Subject } from "$data/types";
  import SelectAndDisplayContainer from "$lib/components/subjectsAndTags/SelectAndDisplayContainer.svelte";
  import DisplaySelectedSubjects from "$lib/components/subjectsAndTags/subjects/DisplaySelectedSubjects.svelte";
  import SelectAvailableSubjects from "$lib/components/subjectsAndTags/subjects/SelectAvailableSubjects.svelte";
  import Button from "$lib/components/ui/Button/Button.svelte";

  import BookDisplay from "./BookDisplay.svelte";
  import SimilarBooks from "./SimilarBooks.svelte";

  export let data;

  let currentlyChecked = !!$page.url.searchParams.get("my-books");

  $: ({ books, subjects } = data);

  let localSubjects = [] as any[];

  const selectSubject = (subject: any) => (localSubjects = localSubjects.concat(subject.id));
  const removeSubject = (subject: any) => (localSubjects = localSubjects.filter(id => id != subject.id));
</script>

<section class="flex flex-col gap-3">
  <form action="/admin/similar-books">
    <div class="flex flex-col gap-3">
      <h1 class="text-lg font-bold">Filter</h1>
      <label class="checkbox">
        <input type="checkbox" name="my-books" value="true" checked={currentlyChecked} />
        Only show my books
      </label>
      <div class="z-[9999999]">
        <SelectAndDisplayContainer isEmpty={!localSubjects.length}>
          <SelectAvailableSubjects slot="select" {subjects} currentlySelected={localSubjects} onSelect={selectSubject} />
          <DisplaySelectedSubjects slot="display" {subjects} currentlySelected={localSubjects} onRemove={removeSubject} />
        </SelectAndDisplayContainer>
      </div>
      <Button theme="primary" class="self-start">Search</Button>
    </div>
  </form>
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
