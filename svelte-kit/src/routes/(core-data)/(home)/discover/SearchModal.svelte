<script lang="ts">
  import { quadIn, quintOut } from "svelte/easing";

  // @ts-ignore
  import { springIn } from "svelte-helpers/spring-transitions";

  import { enhance } from "$app/forms";
  import type { Book, Subject, Tag } from "$data/types";

  import { BOOKS_CACHE, getCurrentCookieValue } from "$lib/state/cacheHelpers";

  import Modal from "$lib/components/ui/Modal.svelte";
  import ActionButton from "$lib/components/ui/Button/ActionButton.svelte";
  import Input from "$lib/components/ui/Input/Input.svelte";
  import InputGroup from "$lib/components/ui/Input/InputGroup.svelte";

  import SelectAvailableTags from "$lib/components/subjectsAndTags/tags/SelectAvailableTags.svelte";
  import SelectAvailableSubjects from "$lib/components/subjectsAndTags/subjects/SelectAvailableSubjects.svelte";
  import DisplaySelectedTags from "$lib/components/subjectsAndTags/tags/DisplaySelectedTags.svelte";
  import DisplaySelectedSubjects from "$lib/components/subjectsAndTags/subjects/DisplaySelectedSubjects.svelte";
  import SelectAndDisplayContainer from "$lib/components/subjectsAndTags/SelectAndDisplayContainer.svelte";

  import SearchResults from "./SearchResults.svelte";
  import Button from "$lib/components/ui/Button/Button.svelte";

  export let isOpen: boolean;
  export let onHide: () => void;
  export let selectedBooksSet: Set<number>;
  export let selectBook: (book: Book) => void;

  export let allSubjects: Subject[];
  export let allTags: Tag[];

  let page = 1;
  let pageBind = 1;

  let totalPages = 0;
  let active = false;

  let books: Book[] = [];
  let subjects: number[] = [];
  let tags: number[] = [];
  let titleEl: HTMLInputElement;

  let loading = false;
  $: noResults = active && !books?.length;

  let searchFormEl: HTMLFormElement;

  const pageUp = () => gotoPage(page + 1);
  const pageDown = () => gotoPage(page - 1);
  const pageOne = () => gotoPage(1);
  const pageLast = () => gotoPage(totalPages);

  const gotoPage = (pg: number) => {
    pageBind = pg;
    searchFormEl.requestSubmit();
  };

  $: canPageUp = !loading && page < totalPages;
  $: canPageDown = !loading && page > 1;

  $: noAvailableBooks = books.length && !books.find(b => !selectedBooksSet.has(b.id));

  const selectSubject = (subject: Subject) => (subjects = subjects.concat(subject.id));
  const selectTag = (tag: Tag) => (tags = tags.concat(tag.id));
  const removeSubject = (subject: Subject) => (subjects = subjects.filter(id => id != subject.id));
  const removeTag = (tag: Tag) => (tags = tags.filter(id => id != tag.id));

  let currentQuery = "";
  let totalBooks = 0;

  async function executeSearch({ cancel, data }: any) {
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

  const NO_RESULTS_SPRING = { stiffness: 0.2, damping: 0.5 };
  const resultsMessageIn: any = () => {
    const { duration, tickToValue } = springIn(30, 0, NO_RESULTS_SPRING);
    return {
      duration,
      css: (t: number) => `transform: translate3d(${tickToValue(t)}px, 0, 0); opacity: ${quintOut(t)}`
    };
  };
  const resultsMessageOut: any = () => {
    return {
      duration: 150,
      css: (t: number) => `position: absolute; opacity: ${quadIn(t)}`
    };
  };
</script>

<Modal on:mount={() => titleEl.focus()} standardFooter={false} {isOpen} {onHide} headerCaption="Search your books">
  <form bind:this={searchFormEl} method="post" action="?/search" use:enhance={executeSearch}>
    <input type="hidden" name="page" value={pageBind} />
    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
      <InputGroup labelText="Title">
        <Input slot="input" bind:inputEl={titleEl} name="search" placeholder="Search title" />
      </InputGroup>

      <div class="flex">
        <div class="flex flex-col">
          <span class="text-sm">Is read?</span>
          <div class="flex-1 flex flex-row gap-4 items-center">
            <div class="flex flex-row items-center gap-1">
              <input type="radio" checked value="" name="is-read" id="isReadE" />
              <label for="isReadE">Either</label>
            </div>
            <div class="flex flex-row items-center gap-1">
              <input type="radio" value="true" name="is-read" id="isReadY" />
              <label for="isReadY">Yes</label>
            </div>
            <div class="flex flex-row items-center gap-1">
              <input type="radio" value="false" name="is-read" id="isReadN" />
              <label for="isReadN">No</label>
            </div>
          </div>
        </div>
      </div>

      <SelectAndDisplayContainer isEmpty={!tags.length}>
        <SelectAvailableTags slot="select" tags={allTags} currentlySelected={tags} onSelect={selectTag} />
        <DisplaySelectedTags slot="display" tags={allTags} currentlySelected={tags} onRemove={removeTag} />
      </SelectAndDisplayContainer>

      <SelectAndDisplayContainer isEmpty={!subjects.length}>
        <SelectAvailableSubjects slot="select" subjects={allSubjects} currentlySelected={subjects} onSelect={selectSubject} />
        <DisplaySelectedSubjects slot="display" subjects={allSubjects} currentlySelected={subjects} onRemove={removeSubject} />
      </SelectAndDisplayContainer>

      <div class="md:col-span-2">
        <div class="checkbox"><label> <input type="checkbox" name="child-subjects" /> Also search child subjects </label></div>
      </div>

      <div class="md:col-span-2">
        <div class="flex flex-row gap-3">
          <ActionButton running={loading}>Search</ActionButton>

          <div class="flex relative flex-1 self-stretch">
            {#if noAvailableBooks}
              <div in:resultsMessageIn|local out:resultsMessageOut class="alert alert-info alert-slimmer">
                You've added all of the books from this page
              </div>
            {/if}

            {#if noResults}
              <div
                class="flex items-start justify-start alert alert-warning alert-slimmer"
                style="backface-visibility: hidden;"
                in:resultsMessageIn|local
                out:resultsMessageOut
              >
                No results
              </div>
            {/if}
          </div>
        </div>
      </div>

      <div class="md:col-span-2">
        <div>
          {#if totalBooks}
            <div class="flex flex-row gap-1 items-center">
              <div class="flex">
                <Button type="button" on:click={pageOne} disabled={!canPageDown} icon={true} class="connect-right">
                  <i class="fal fa-fw fa-angle-double-left" />
                </Button>
                <Button type="button" on:click={pageDown} disabled={!canPageDown} icon={true} class="connect-left">
                  <i class="fal fa-fw fa-angle-left" />
                </Button>
              </div>
              <span class="text-sm mx-1">{page} of {totalPages}</span>
              <div class="flex">
                <Button type="button" on:click={pageUp} disabled={!canPageUp} icon={true} class="connect-right">
                  <i class="fal fa-fw fa-angle-right" />
                </Button>
                <Button type="button" on:click={pageLast} disabled={!canPageUp} icon={true} class="connect-left">
                  <i class="fal fa-fw fa-angle-double-right" />
                </Button>
              </div>
            </div>
            <hr class="my-2" />
          {/if}
        </div>
        <SearchResults {books} {currentQuery} {selectedBooksSet} {selectBook} />
      </div>
    </div>
  </form>
</Modal>
