<script lang="ts">
  import { fade } from "svelte/transition";
  import { CheckIcon, ChevronLeftIcon, ChevronRightIcon } from "lucide-svelte";

  import type { Book, Subject, Tag } from "$data/types";

  import { enhance } from "$app/forms";
  import * as Alert from "$lib/components/ui/alert";
  import Separator from "$lib/components/ui/separator/separator.svelte";

  import { BOOKS_CACHE, getCurrentCookieValue } from "$lib/state/cacheHelpers";

  import Button from "$lib/components/ui/button/button.svelte";
  import Checkbox from "$lib/components/ui/checkbox/checkbox.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import * as RadioGroup from "$lib/components/ui/radio-group";

  import Modal from "$lib/components/Modal.svelte";

  import SelectAvailableTags from "$lib/components/subjectsAndTags/tags/SelectAvailableTags.svelte";
  import SelectAvailableSubjects from "$lib/components/subjectsAndTags/subjects/SelectAvailableSubjects.svelte";
  import DisplaySelectedTags from "$lib/components/subjectsAndTags/tags/DisplaySelectedTags.svelte";
  import DisplaySelectedSubjects from "$lib/components/subjectsAndTags/subjects/DisplaySelectedSubjects.svelte";
  import SelectAndDisplayContainer from "$lib/components/subjectsAndTags/SelectAndDisplayContainer.svelte";

  import SearchResults from "./SearchResults.svelte";

  type Props = {
    isOpen: boolean;
    onHide: () => void;
    selectedBooksSet: Set<number>;
    selectBook: (book: Book) => void;
    allSubjects: Subject[];
    allTags: Tag[];
  };

  let { isOpen, onHide, selectedBooksSet, selectBook, allSubjects, allTags }: Props = $props();

  let page = $state(1);
  let pageBind = $state(1);

  let totalPages = $state(0);
  let active = $state(false);

  let books = $state<Book[]>([]);
  let subjects = $state<number[]>([]);
  let tags = $state<number[]>([]);
  let titleEl = $state<HTMLInputElement | null>(null);

  let loading = $state(false);
  let noResults = $derived(active && !books?.length);

  let searchFormEl: HTMLFormElement;

  const pageUp = () => gotoPage(page + 1);
  const pageDown = () => gotoPage(page - 1);

  const gotoPage = (pg: number) => {
    pageBind = pg;
    searchFormEl.requestSubmit();
  };

  let canPageUp = $derived(!loading && page < totalPages);
  let canPageDown = $derived(!loading && page > 1);

  let noAvailableBooks = $derived(books.length && !books.find(b => !selectedBooksSet.has(b.id)));

  const selectSubject = (subject: Subject) => (subjects = subjects.concat(subject.id));
  const selectTag = (tag: Tag) => (tags = tags.concat(tag.id));
  const removeSubject = (subject: Subject) => (subjects = subjects.filter(id => id != subject.id));
  const removeTag = (tag: Tag) => (tags = tags.filter(id => id != tag.id));

  let currentQuery = $state("");
  let totalBooks = $state(0);

  async function executeSearch({ cancel, formData: data }: any) {
    cancel();

    loading = true;
    let searchParams = new URLSearchParams([
      ["page", pageBind],
      ["page-size", "15"],
      ["result-set", "compact"],
      ["cache", getCurrentCookieValue(BOOKS_CACHE)],
      ...["search", "is-read", "child-subjects"].filter(k => data.get(k)).map(k => [k, data.get(k).toString()]),
      ...["subjects", "tags"].flatMap(k => (data.getAll(k) ?? []).map((val: any) => [k, val.toString()]))
    ]);

    const search = searchParams.toString();

    const result = await fetch(`/api/books?${search}`).then((resp: any) => resp.json());

    pageBind = 1;
    currentQuery = search;
    ({ page, totalPages, books, totalBooks } = result);
    loading = false;
    active = true;
  }
</script>

<Modal openFocus={titleEl} standardFooter={false} {isOpen} {onHide} headerCaption="Search your books">
  <form bind:this={searchFormEl} method="post" action="?/search" use:enhance={executeSearch}>
    <input type="hidden" name="page" value={pageBind} />
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
      <div class="flex flex-col gap-1.5">
        <Label for="search-modal-title">Title</Label>
        <Input id="search-modal-title" bind:ref={titleEl} name="search" placeholder="Search title" />
      </div>

      <div class="flex">
        <div class="flex flex-col">
          <Label>Is read?</Label>
          <RadioGroup.Root class="flex gap-4 my-auto" name="is-read" value="" orientation="horizontal">
            <div class="inline-flex items-center gap-1">
              <RadioGroup.Item value="" id="read-either" />
              <Label for="read-either">Either</Label>
            </div>
            <div class="inline-flex items-center gap-1">
              <RadioGroup.Item value="true" id="read-yes" />
              <Label for="read-yes">Yes</Label>
            </div>
            <div class="inline-flex items-center gap-1">
              <RadioGroup.Item value="false" id="read-no" />
              <Label for="read-no">No</Label>
            </div>
          </RadioGroup.Root>
        </div>
      </div>

      <SelectAndDisplayContainer class="sm:col-span-2">
        {#snippet select()}
          <SelectAvailableTags tags={allTags} currentlySelected={tags} onSelect={selectTag} />
        {/snippet}
        {#snippet display()}
          <DisplaySelectedTags tags={allTags} currentlySelected={tags} onRemove={removeTag} />
        {/snippet}
      </SelectAndDisplayContainer>

      <SelectAndDisplayContainer class="sm:col-span-2">
        {#snippet select()}
          <SelectAvailableSubjects subjects={allSubjects} currentlySelected={subjects} onSelect={selectSubject} />
        {/snippet}
        {#snippet display()}
          <DisplaySelectedSubjects subjects={allSubjects} currentlySelected={subjects} onRemove={removeSubject} />
        {/snippet}
      </SelectAndDisplayContainer>

      <div class="sm:col-span-2 flex items-center gap-2">
        <Checkbox id="search-child-subjects" name="child-subjects" value="true" />
        <Label for="search-child-subjects" class="checkbox">Also search child subjects</Label>
      </div>

      <div class="sm:col-span-2">
        <div class="flex flex-col gap-3">
          <Button class="self-start" size="sm" type="submit" disabled={loading}>Search</Button>

          {#if noAvailableBooks}
            <div class="flex" in:fade={{ duration: 150 }}>
              <Alert.Root>
                <CheckIcon class="size-4 text-green-600!" />
                <Alert.Description>You've added all of the books from this page</Alert.Description>
              </Alert.Root>
            </div>
          {/if}

          {#if noResults}
            <div class="flex items-start justify-start" style="backface-visibility: hidden;" transition:fade={{ duration: 150 }}>
              <div class="text-lg font-bold">No results</div>
            </div>
          {/if}
        </div>
      </div>

      <div class="sm:col-span-2">
        <div>
          {#if totalBooks}
            <div class="flex flex-row gap-1 items-center">
              <div class="flex">
                <Button type="button" onclick={pageDown} disabled={!canPageDown} variant="outline" size="icon" class="h-8">
                  <ChevronLeftIcon />
                </Button>
              </div>
              <span class="text-sm mx-1">{page} of {totalPages}</span>
              <div class="flex">
                <Button type="button" onclick={pageUp} disabled={!canPageUp} variant="outline" size="icon" class="h-8">
                  <ChevronRightIcon />
                </Button>
              </div>
            </div>
            <Separator class="my-4 h-[2px]" />
          {/if}
        </div>
      </div>
    </div>
    <SearchResults {books} {currentQuery} {selectedBooksSet} {selectBook} />
  </form>
</Modal>
