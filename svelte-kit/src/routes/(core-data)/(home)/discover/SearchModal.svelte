<script lang="ts">
  import type { Book, Subject, Tag } from "$data/types";

  import { fade } from "svelte/transition";
  import { enhance } from "$app/forms";
  import { BOOKS_CACHE, getCurrentCookieValue } from "$lib/state/cacheHelpers";

  import Alert from "$lib/components/Alert.svelte";
  import Button from "$lib/components/Button/Button.svelte";
  import Modal from "$lib/components/Modal.svelte";
  import ActionButton from "$lib/components/Button/ActionButton.svelte";
  import Input from "$lib/components/form-elements/Input/Input.svelte";
  import InputGroup from "$lib/components/form-elements/Input/InputGroup.svelte";

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
  let titleEl: HTMLInputElement;

  let loading = $state(false);
  let noResults = $derived(active && !books?.length);

  let searchFormEl: HTMLFormElement;

  const pageUp = () => gotoPage(page + 1);
  const pageDown = () => gotoPage(page - 1);
  const pageOne = () => gotoPage(1);
  const pageLast = () => gotoPage(totalPages);

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

      <SelectAndDisplayContainer class="sm:col-span-2">
        <SelectAvailableTags slot="select" tags={allTags} currentlySelected={tags} onSelect={selectTag} />
        <DisplaySelectedTags slot="display" tags={allTags} currentlySelected={tags} onRemove={removeTag} />
      </SelectAndDisplayContainer>

      <SelectAndDisplayContainer class="sm:col-span-2">
        <SelectAvailableSubjects slot="select" subjects={allSubjects} currentlySelected={subjects} onSelect={selectSubject} />
        <DisplaySelectedSubjects slot="display" subjects={allSubjects} currentlySelected={subjects} onRemove={removeSubject} />
      </SelectAndDisplayContainer>

      <div class="sm:col-span-2">
        <div class="checkbox"><label> <input type="checkbox" name="child-subjects" /> Also search child subjects </label></div>
      </div>

      <div class="sm:col-span-2">
        <div class="flex flex-row gap-3">
          <ActionButton running={loading}>Search</ActionButton>

          <div class="flex relative flex-1 self-stretch">
            {#if noAvailableBooks}
              <div in:fade={{ duration: 150 }}>
                <Alert type="info" layout="slimmer">You've added all of the books from this page</Alert>
              </div>
            {/if}

            {#if noResults}
              <div class="flex items-start justify-start" style="backface-visibility: hidden;" transition:fade={{ duration: 150 }}>
                <Alert type="warning" layout="slimmer">No results</Alert>
              </div>
            {/if}
          </div>
        </div>
      </div>

      <div class="sm:col-span-2">
        <div>
          {#if totalBooks}
            <div class="flex flex-row gap-1 items-center">
              <div class="flex">
                <Button type="button" onclick={pageOne} disabled={!canPageDown} icon={true} class="connect-right">
                  <i class="fal fa-fw fa-angle-double-left"></i>
                </Button>
                <Button type="button" onclick={pageDown} disabled={!canPageDown} icon={true} class="connect-left">
                  <i class="fal fa-fw fa-angle-left"></i>
                </Button>
              </div>
              <span class="text-sm mx-1">{page} of {totalPages}</span>
              <div class="flex">
                <Button type="button" onclick={pageUp} disabled={!canPageUp} icon={true} class="connect-right">
                  <i class="fal fa-fw fa-angle-right"></i>
                </Button>
                <Button type="button" onclick={pageLast} disabled={!canPageUp} icon={true} class="connect-left">
                  <i class="fal fa-fw fa-angle-double-right"></i>
                </Button>
              </div>
            </div>
            <hr class="my-2" />
          {/if}
        </div>
      </div>
    </div>
  </form>
  <SearchResults {books} {currentQuery} {selectedBooksSet} {selectBook} />
</Modal>
