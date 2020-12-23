<script lang="ts">
  import { springIn, springOut } from "svelte-helpers/spring-transitions";
  import Modal from "app/components/ui/Modal.svelte";
  import ActionIconButton from "app/components/buttons/ActionIconButton.svelte";
  import FlexRow from "app/components/layout/FlexRow.svelte";
  import Stack from "app/components/layout/Stack.svelte";
  import FlowItems from "app/components/layout/FlowItems.svelte";
  import SelectAvailableTags from "app/components/subjectsAndTags/tags/SelectAvailableTags.svelte";
  import SelectAvailableSubjects from "app/components/subjectsAndTags/subjects/SelectAvailableSubjects.svelte";
  import DisplaySelectedTags from "app/components/subjectsAndTags/tags/DisplaySelectedTags.svelte";
  import DisplaySelectedSubjects from "app/components/subjectsAndTags/subjects/DisplaySelectedSubjects.svelte";
  import ActionButton from "app/components/buttons/ActionButton.svelte";
  import SearchResults from "./SearchResults.svelte";
import { quadIn, quadOut, quintIn, quintOut } from "svelte/easing";
import { onMount } from "svelte";

  export let isOpen;
  export let onHide;
  export let dispatch;
  export let selectedBooksSet;
  export let searchState;
  export let queryState;
  export let searchDispatch;

  //const focus = el => { setTimeout(() => el.focus()); }
  let titleEl;

  let ready = false;
  const mounted = () => {
    titleEl.focus();
    ready = true;
  };

  $: ({ active } = $searchState);
  let { ...initialSearchState } = $searchState;
  let searchChild = !!initialSearchState.searchChildSubjects;
  let isRead = initialSearchState.isRead === true ? "1" : initialSearchState.isRead === false ? "0" : "null";
  let title = initialSearchState.title;
  let subjects = initialSearchState.subjects ?? [];
  let tags = initialSearchState.tags ?? [];

  $: ({ pageSize, page } = $searchState);

  $: ({ loaded, loading, data, error, currentQuery } = $queryState);

  $: resultCount = data?.allBooks?.Meta?.count ?? 0;
  $: totalPages = Math.ceil(resultCount / pageSize);

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
  const noResultsIn: any = () => {
    const { duration, tickToValue } = springIn(30, 0, NO_RESULTS_SPRING);
    return {
      duration: ready ? duration : 0,
      css: t => `transform: translateX(${tickToValue(t)}px); opacity: ${quintOut(t)}`
    };
  };
  const noResultsOut: any = () => {
    return {
      duration: ready ? 100 : 0,
      css: t => {
        return `transform: translateX(${(1 - t) * 30}px); opacity: ${t}`;
      }
    };
  };
</script>

<Modal onModalMount={mounted} deferStateChangeOnClose={true} standardFooter={false} {isOpen} {onHide} headerCaption="Search your books">
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
        <FlexRow containerStyle="align-items: baseline">
          {#if loading}
            <button style="width: 6ch" disabled={true} class="btn btn-default"><i class="fa fa-fw fa-spin fa-spinner" /></button>
          {:else}
            <ActionIconButton onClick={applyFilters} style="width: 6ch" class="btn btn-default"><i class="fal fa-search" /></ActionIconButton>
          {/if}

          {#if noAvailableBooks}
            <div in:noResultsIn out:noResultsOut class="alert alert-info alert-slimmer">You've added all of the books from this page</div>
          {/if}
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
        <SearchResults {dispatch} {data} {selectedBooksSet} {active} />
      </div>
    </FlexRow>
  </form>
</Modal>
