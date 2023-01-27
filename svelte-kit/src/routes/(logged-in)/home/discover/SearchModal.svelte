<script lang="ts">
  import { quadIn, quadOut, quintIn, quintOut } from "svelte/easing";

  // @ts-ignore
  import { springIn } from "svelte-helpers/spring-transitions";

  // import BooksQuery from "gql/home/searchBooks.graphql";

  import Modal from "$lib/components/ui/Modal.svelte";
  import ActionIconButton from "$lib/components/buttons/ActionIconButton.svelte";
  import FlexRow from "$lib/components/layout/FlexRow.svelte";
  import Stack from "$lib/components/layout/Stack.svelte";
  import FlowItems from "$lib/components/layout/FlowItems.svelte";
  import SelectAvailableTags from "$lib/components/subjectsAndTags/tags/SelectAvailableTags.svelte";
  import SelectAvailableSubjects from "$lib/components/subjectsAndTags/subjects/SelectAvailableSubjects.svelte";
  import DisplaySelectedTags from "$lib/components/subjectsAndTags/tags/DisplaySelectedTags.svelte";
  import DisplaySelectedSubjects from "$lib/components/subjectsAndTags/subjects/DisplaySelectedSubjects.svelte";

  //import SearchResults from "./SearchResults.svelte";
  import useReducer from "$lib/state/useReducer";
  import type { Book, Subject, Tag } from "$data/types";
  import { enhance } from "$app/forms";

  // import { query } from "micro-graphql-svelte";
  // import { Queries, QueryOf } from "gql/graphql-typings";
  // import { appState } from "app/state/appState";
  // import { preloadBookImages } from "util/imagePreload";

  export let isOpen: boolean;
  export let onHide: () => void;
  export let dispatch: any;
  export let selectedBooksSet: any;

  export let allSubjects: Subject[];
  export let allTags: Tag[];

  const PAGE_SIZE = 20;

  const initialReducerState: any = { active: false, page: 1, pageSize: 50, sort: { title: 1 }, tags: [], subjects: [] };
  const searchStateReducer = (_oldState: any, payload: any) =>
    payload ? { active: true, page: 1, pageSize: PAGE_SIZE, ...payload } : initialReducerState;

  const [reducerState, searchDispatch] = useReducer(searchStateReducer, initialReducerState);

  let searchState: any;
  let active: any;
  $: ({ active, ...searchState } = $reducerState);

  $: variables = { ...searchState };
  $: ({ page } = variables);

  let titleEl: HTMLInputElement;
  let searchChild = false;
  let isRead = "null";
  let title = "";
  let subjects: string[] = [];
  let tags: string[] = [];

  //$: ({ loaded, loading, data, error, currentQuery } = $queryState);

  //$: books = data?.allBooks?.Books;
  let books: Book[] = [];
  let resultCount: number = 0;

  let loading = false;
  $: noResults = active && books != null && !books?.length;

  //$: resultCount = data?.allBooks?.Meta?.count ?? 0;
  $: totalPages = Math.ceil(resultCount / PAGE_SIZE);

  const pageUp = () => searchDispatch({ page: page + 1 });
  const pageDown = () => searchDispatch({ page: page - 1 });
  const pageOne = () => searchDispatch({ page: 1 });
  const pageLast = () => searchDispatch({ page: totalPages });

  $: canPageUp = !loading && page < totalPages;
  $: canPageDown = !loading && page > 1;

  //$: allBooks = data?.allBooks?.Books;
  //$: noAvailableBooks = allBooks?.length && !allBooks.find(b => !selectedBooksSet.has(b._id));

  const selectSubject = (subject: Subject) => (subjects = subjects.concat(subject._id));
  const selectTag = (tag: Tag) => (tags = tags.concat(tag._id));
  const removeSubject = (subject: Subject) => (subjects = subjects.filter(_id => _id != subject._id));
  const removeTag = (tag: Tag) => (tags = tags.filter(_id => _id != tag._id));

  function executeSearch({ cancel, data }: any) {
    loading = true;
    return async ({ result }: any) => {
      //const books: Book[] = result.data.books;

      loading = false;

      console.log("result", result.data);
    };
  }

  const applyFilters = ({}) => {
    searchDispatch({
      title,
      isRead: isRead == "null" ? void 0 : isRead == "0" ? false : true,
      subjects: subjects.length ? subjects : null,
      tags: tags.length ? tags : null,
      searchChildSubjects: searchChild
    });
  };

  let noAvailableBooks = false;
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

<Modal onModalMount={() => titleEl.focus()} standardFooter={false} {isOpen} {onHide} headerCaption="Search your books">
  <form method="post" action="?/search" use:enhance={executeSearch}>
    <FlexRow>
      <div class="col-xs-6">
        <div class="form-group">
          <label>Title</label>
          <input bind:this={titleEl} name="search" placeholder="Search title" class="form-control" />
        </div>
      </div>

      <div class="col-xs-6">
        <Stack>
          <label class="form-label">Is read?</label>
          <FlowItems class="radio">
            <FlowItems tightest={true} vCenter={true}>
              <input type="radio" checked value="" name="is-read" id="isReadE" />
              <label for="isReadE">Either</label>
            </FlowItems>
            <FlowItems tightest={true} vCenter={true}>
              <input type="radio" value="true" name="is-read" id="isReadY" />
              <label for="isReadY">Yes</label>
            </FlowItems>
            <FlowItems tightest={true} vCenter={true}>
              <input type="radio" value="false" name="is-read" id="isReadN" />
              <label for="isReadN">No</label>
            </FlowItems>
          </FlowItems>
        </Stack>
      </div>

      <div class="col-xs-3">
        <SelectAvailableTags tags={allTags} currentlySelected={tags} onSelect={selectTag} />
      </div>
      <div class="col-xs-9">
        <DisplaySelectedTags tags={allTags} currentlySelected={tags} onRemove={removeTag} />
      </div>

      <div class="col-xs-3">
        <SelectAvailableSubjects subjects={allSubjects} currentlySelected={subjects} onSelect={selectSubject} />
      </div>
      <div class="col-xs-9">
        <DisplaySelectedSubjects subjects={allSubjects} currentlySelected={subjects} onRemove={removeSubject} />
      </div>

      <div class="col-xs-6">
        <div class="checkbox"><label> <input type="checkbox" name="child-subjects" /> Also search child subjects </label></div>
      </div>

      <div class="col-xs-12">
        <FlexRow>
          <ActionIconButton class="btn btn-default" disabled={loading}>
            <i class:fa-spin={loading} class:fa-spinner={loading} class:fa-search={!loading} class="fal fa-fw" />
          </ActionIconButton>

          <div class="msg-holder">
            {#if noAvailableBooks}
              <div in:resultsMessageIn|local out:resultsMessageOut class="alert alert-info alert-slimmer">
                You've added all of the books from this page
              </div>
            {/if}

            {#if noResults}
              <div in:resultsMessageIn|local out:resultsMessageOut class="alert alert-warning alert-slimmer">No results</div>
            {/if}
          </div>
        </FlexRow>
      </div>

      <div class="col-xs-12">
        <div>
          {#if resultCount}
            <FlowItems tightest={true} containerStyle="align-items: center; font-size: 14px">
              <button on:click={pageOne} disabled={!canPageDown} class="btn btn-default"> <i class="fal fa-angle-double-left" /> </button>
              <button on:click={pageDown} disabled={!canPageDown} class="btn btn-default"> <i class="fal fa-angle-left" /> </button>
              <span style="padding-left: 3px; padding-right: 3px"> {page} of {totalPages} </span>
              <button on:click={pageUp} disabled={!canPageUp} class="btn btn-default"> <i class="fal fa-angle-right" /> </button>
              <button on:click={pageLast} disabled={!canPageUp} class="btn btn-default"> <i class="fal fa-angle-double-right" /> </button>
            </FlowItems>
            <hr />
          {/if}
        </div>
        <!-- <SearchResults {dispatch} {books} {currentQuery} {selectedBooksSet} /> -->
      </div>
    </FlexRow>
  </form>
</Modal>

<style>
  .msg-holder {
    display: flex;
    position: relative;
    flex: 1;
    align-self: stretch;
  }

  .msg-holder > div {
    display: flex;
    align-items: flex-start;
    justify-content: left;
    /* fix transition 1px glitch */
    backface-visibility: hidden;
  }
</style>
