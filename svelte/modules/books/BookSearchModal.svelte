<script lang="ts">
  import ActionButton from "app/components/buttons/ActionButton.svelte";

  import FlexRow from "app/components/layout/FlexRow.svelte";
  import FlowItems from "app/components/layout/FlowItems.svelte";
  import Stack from "app/components/layout/Stack.svelte";

  import Modal from "app/components/ui/Modal.svelte";

  import { currentSearch } from "./booksSearchState";
  import { applyFilters } from "./setBookFilters";

  export let isOpen = false;
  export let onHide = () => {};

  let searchEl;
  let pagesEl;
  let pagesDirEl;
  let isReadE;
  let isRead0;
  let childSubEl;
  let authorEl;
  let publisherEl;
  let sortSelectEl;

  let subjects = $currentSearch.subjectIds;
  let tags = $currentSearch.tagIds;

  let noSubjectsFilter = !!$currentSearch.noSubjects;
  const setNoSubjectsFilter = evt => {
    noSubjectsFilter = evt.target.checked;
  };

  const selectSubject = subject => (subjects = subjects.concat(subject._id));
  const selectTag = tag => (tags = tags.concat(tag._id));
  const removeSubject = subject => (subjects = subjects.filter(_id => _id != subject._id));
  const removeTag = tag => (tags = tags.filter(_id => _id != tag._id));

  const updateFilters = evt => {
    evt.preventDefault();

    let sort = "";
    let sortDirection = "";
    let sortValue = sortSelectEl.current.value;
    if (sortValue !== "_id|desc") {
      [sort, sortDirection] = sortValue.split("|");
    }

    applyFilters({
      subjects: noSubjectsFilter ? [] : subjects,
      tags,
      search: searchEl.current.value,
      pages: pagesEl.current.value,
      pagesOperator: pagesDirEl.current.value,
      author: authorEl.current.value,
      publisher: publisherEl.current.value,
      isRead: isReadE.current.checked ? "" : isRead0.current.checked ? "0" : "1",
      searchChildSubjects: childSubEl.current && childSubEl.current.checked,
      noSubjects: noSubjectsFilter,
      sort,
      sortDirection
    });
    onHide();
  };
</script>

<Modal deferStateChangeOnClose={true} {isOpen} {onHide} headerCaption={'Full Search'}>
  <form on:submit={updateFilters}>
    <FlexRow>
      <div class="col-xs-6">
        <div class="form-group">
          <label for="book_search_title">Title</label>
          <input id="book_search_title" value={$currentSearch.search} bind:this={searchEl} placeholder="Search title" class="form-control" />
        </div>
      </div>
      <div class="col-xs-6">
        <div class="form-group">
          <label for="book_search_pages">Pages</label>
          <FlowItems tightest={true}>
            <select id="book_search_pages" style="width: 40px" bind:this={pagesDirEl} value={$currentSearch.pagesOperator} class="form-control">
              <option value="lt">{'<'}</option>
              <option value="gt">{'>'}</option>
            </select>

            <input value={$currentSearch.pages} bind:this={pagesEl} style="width: 80px" type="number" placeholder="Pages" class="form-control" />
          </FlowItems>
        </div>
      </div>
      <div class="col-xs-6">
        <div class="form-group">
          <label for="book_search_pub">Publisher</label>
          <input id="book_search_pub" bind:this={publisherEl} value={$currentSearch.publisher} placeholder="Publisher" class="form-control" />
        </div>
      </div>
      <div class="col-xs-6">
        <div class="form-group">
          <label for="book_search_auth">Author</label>
          <input id="book_search_auth" bind:this={authorEl} value={$currentSearch.author} placeholder="Author" class="form-control" />
        </div>
      </div>
      <div class="col-xs-6">
        <Stack tighter={true}>
          <label for="__" class="form-label">Is Read?</label>
          <FlowItems class="radio">
            <FlowItems tightest={true} vCenter={true}>
              <input type="radio" checked={$currentSearch.isRead == ''} bind:this={isReadE} name="isRead" id="isReadE" />
              <label for="isReadE">Either</label>
            </FlowItems>
            <FlowItems tightest={true} vCenter={true}>
              <input type="radio" checked={$currentSearch.isRead == '1'} name="isRead" id="isReadY" />
              <label for="isReadY">Yes</label>
            </FlowItems>
            <FlowItems tightest={true} vCenter={true}>
              <input type="radio" checked={$currentSearch.isRead == '0'} bind:this={isRead0} name="isRead" id="isReadN" />
              <label for="isReadN">No</label>
            </FlowItems>
          </FlowItems>
        </Stack>
      </div>
      <div class="col-xs-6">
        <div class="form-group">
          <label for="book_search_sort">Sort</label>
          <select
            id="book_search_sort"
            bind:this={sortSelectEl}
            style="margin-bottom: 0"
            value={$currentSearch.bindableSortValue}
            class="form-control"
          >
            <option value="title|asc">Title A-Z</option>
            <option value="title|desc">Title Z-A</option>
            <option value="pages|asc">Pages, Low</option>
            <option value="pages|desc">Pages, High</option>
            <option value="_id|asc">Created, Earliest</option>
            <option value="_id|desc">Created, Latest</option>
          </select>
        </div>
      </div>

      <div class="col-sm-3 col-xs-12">
        <!-- <SelectAvailableTags currentlySelected={tags} onSelect={selectTag} /> -->
      </div>
      <div class="col-sm-9 col-xs-12">
        <!-- <DisplaySelectedTags currentlySelected={tags} onRemove={removeTag} /> -->
      </div>
      {#if !noSubjectsFilter}
        <div class="col-sm-3 col-xs-12">
          <!-- <SelectAvailableSubjects currentlySelected={subjects} onSelect={selectSubject} /> -->
        </div>
        <div class="col-sm-9 col-xs-12">
          <!-- <DisplaySelectedSubjects currentlySelected={subjects} onRemove={removeSubject} /> -->
        </div>
        <div class="col-xs-12">
          <label class="checkbox">
            <input type="checkbox" bind:this={childSubEl} checked={!!$currentSearch.searchChildSubjects} />
            Also search child subjects
          </label>
        </div>
      {/if}
      <div class="col-xs-12">
        <label class="checkbox">
          <input type="checkbox" checked={!!noSubjectsFilter} onChange={setNoSubjectsFilter} />
          Search books with no subjects set
        </label>
      </div>
    </FlexRow>

    <hr />
    <FlowItems pushLast={true}>
      <ActionButton text="Filter" preset="primary" onClick={updateFilters} />
    </FlowItems>
  </form>
</Modal>
