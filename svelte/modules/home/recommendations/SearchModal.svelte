<script context="module" lang="ts">
  const PAGE_SIZE = 20;

  const initialReducerState: any = { active: false, page: 1, pageSize: 50, sort: { title: 1 }, tags: [], subjects: [] };
  const searchStateReducer = (_oldState, payload) => (payload ? { active: true, page: 1, pageSize: PAGE_SIZE, ...payload } : initialReducerState);
</script>

<script lang="ts">
  import { quadIn, quadOut, quintIn, quintOut } from "svelte/easing";
  import { springIn } from "svelte-helpers/spring-transitions";

  import BooksQuery from "graphQL/home/searchBooks.graphql";

  import Modal from "app/components/ui/Modal.svelte";
  import ActionIconButton from "app/components/buttons/ActionIconButton.svelte";
  import FlexRow from "app/components/layout/FlexRow.svelte";
  import Stack from "app/components/layout/Stack.svelte";
  import FlowItems from "app/components/layout/FlowItems.svelte";
  import SelectAvailableTags from "app/components/subjectsAndTags/tags/SelectAvailableTags.svelte";
  import SelectAvailableSubjects from "app/components/subjectsAndTags/subjects/SelectAvailableSubjects.svelte";
  import DisplaySelectedTags from "app/components/subjectsAndTags/tags/DisplaySelectedTags.svelte";
  import DisplaySelectedSubjects from "app/components/subjectsAndTags/subjects/DisplaySelectedSubjects.svelte";
  import SearchResults from "./SearchResults.svelte";
  import useReducer from "util/useReducer";
  import { query } from "micro-graphql-svelte";
  import { Queries, QueryOf } from "graphql-typings";
  import { appState } from "app/state/appState";
  import { preloadBookImages } from "util/imagePreload";

  export let isOpen;
  export let onHide;
  export let dispatch;
  export let selectedBooksSet;

  const { publicUserId } = $appState;

  const [reducerState, searchDispatch] = useReducer(searchStateReducer, initialReducerState);
  $: ({ active, ...searchState } = $reducerState);

  $: variables = { ...searchState, publicUserId };
  $: ({ page } = variables);

  const { queryState, sync } = query<QueryOf<Queries["allBooks"]>>(BooksQuery, { postProcess: preloadBookImages });
  $: {
    if (active) {
      sync(variables);
    }
  }

  let titleEl;
  let searchChild = false;
  let isRead = "null";
  let title = "";
  let subjects = [];
  let tags = [];

  $: ({ loaded, loading, data, error, currentQuery } = $queryState);

  $: booksObj = data?.allBooks as { Books: any[] };
  $: books = data?.allBooks?.Books;

  $: noResults = active && books != null && !books?.length;

  $: resultCount = data?.allBooks?.Meta?.count ?? 0;
  $: totalPages = Math.ceil(resultCount / PAGE_SIZE);

  const pageUp = () => searchDispatch({ page: page + 1 });
  const pageDown = () => searchDispatch({ page: page - 1 });
  const pageOne = () => searchDispatch({ page: 1 });
  const pageLast = () => searchDispatch({ page: totalPages });

  $: canPageUp = !loading && page < totalPages;
  $: canPageDown = !loading && page > 1;

  $: allBooks = data?.allBooks?.Books;
  $: noAvailableBooks = allBooks?.length && !allBooks.find(b => !selectedBooksSet.has(b._id));

  const selectSubject = subject => (subjects = subjects.concat(subject._id));
  const selectTag = tag => (tags = tags.concat(tag._id));
  const removeSubject = subject => (subjects = subjects.filter(_id => _id != subject._id));
  const removeTag = tag => (tags = tags.filter(_id => _id != tag._id));

  const applyFilters = () => {
    searchDispatch({
      title,
      isRead: isRead == "null" ? void 0 : isRead == "0" ? false : true,
      subjects: subjects.length ? subjects : null,
      tags: tags.length ? tags : null,
      searchChildSubjects: searchChild
    });
  };

  const NO_RESULTS_SPRING = { stiffness: 0.2, damping: 0.5 };
  const resultsMessageIn: any = () => {
    const { duration, tickToValue } = springIn(30, 0, NO_RESULTS_SPRING);
    return {
      duration,
      css: t => `transform: translate3d(${tickToValue(t)}px, 0, 0); opacity: ${quintOut(t)}`
    };
  };
  const resultsMessageOut: any = () => {
    return {
      duration: 150,
      css: t => `position: absolute; opacity: ${quadIn(t)}`
    };
  };
</script>

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

<Modal onModalMount={() => titleEl.focus()} standardFooter={false} {isOpen} {onHide} headerCaption="Search your books">
  <form
    on:submit={evt => {
      evt.preventDefault();
      applyFilters();
    }}
  >
    <FlexRow>
      <div class="col-xs-6">
        <div class="form-group">
          <label>Title</label>
          <input bind:this={titleEl} bind:value={title} placeholder="Search title" class="form-control" />
        </div>
      </div>

      <div class="col-xs-6">
        <Stack>
          <label class="form-label">Is read?</label>
          <FlowItems class="radio">
            <FlowItems tightest={true} vCenter={true}>
              <input type="radio" bind:group={isRead} value="null" name="isRead" id="isReadE" />
              <label for="isReadE">Either</label>
            </FlowItems>
            <FlowItems tightest={true} vCenter={true}>
              <input type="radio" bind:group={isRead} value="1" name="isRead" id="isReadY" />
              <label for="isReadY">Yes</label>
            </FlowItems>
            <FlowItems tightest={true} vCenter={true}>
              <input type="radio" bind:group={isRead} value="0" name="isRead" id="isReadN" />
              <label for="isReadN">No</label>
            </FlowItems>
          </FlowItems>
        </Stack>
      </div>

      <div class="col-xs-3">
        <SelectAvailableTags currentlySelected={tags} onSelect={selectTag} />
      </div>
      <div class="col-xs-9">
        <DisplaySelectedTags currentlySelected={tags} onRemove={removeTag} />
      </div>

      <div class="col-xs-3">
        <SelectAvailableSubjects currentlySelected={subjects} onSelect={selectSubject} />
      </div>
      <div class="col-xs-9">
        <DisplaySelectedSubjects currentlySelected={subjects} onRemove={removeSubject} />
      </div>

      <div class="col-xs-6">
        <div class="checkbox"><label> <input type="checkbox" bind:checked={searchChild} /> Also search child subjects </label></div>
      </div>

      <div class="col-xs-12">
        <FlexRow>
          <ActionIconButton class="btn btn-default" onClick={applyFilters} disabled={loading}>
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
        <SearchResults {dispatch} {booksObj} {selectedBooksSet} />
      </div>
    </FlexRow>
  </form>
</Modal>
