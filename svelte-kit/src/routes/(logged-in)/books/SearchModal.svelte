<script lang="ts">
  import { page } from "$app/stores";
  import Button from "$lib/components/buttons/Button.svelte";

  import Modal from "$lib/components/ui/Modal.svelte";
  import FlexRow from "$lib/components/layout/FlexRow.svelte";
  import FlowItems from "$lib/components/layout/FlowItems.svelte";
  import Stack from "$lib/components/layout/Stack.svelte";

  import { searchState } from "./searchState";
  import { sanitize } from "$lib/util/formDataHelpers";

  // import DisplaySelectedSubjects from "app/components/subjectsAndTags/subjects/DisplaySelectedSubjects.svelte";
  // import SelectAvailableSubjects from "app/components/subjectsAndTags/subjects/SelectAvailableSubjects.svelte";
  // import DisplaySelectedTags from "app/components/subjectsAndTags/tags/DisplaySelectedTags.svelte";
  import SelectAvailableTags from "$lib/components/subjectsAndTags/tags/SelectAvailableTags.svelte";
  import type { Hash, Tag } from "$data/types";

  // import { currentSearch } from "./booksSearchState";
  // import { applyFilters } from "./setBookFilters";
  //import StandardModalFooter from "app/components/ui/StandardModalFooter.svelte";

  export let isOpen = false;
  export let onHide = () => {};

  export let allTags: Tag[];
  export let tagHash: Hash<Tag>;

  let closeModal: any;

  //let searchEl: any;
  let pagesEl: any;
  let pagesDirEl: any;
  let isReadE: any;
  let isRead0: any;
  let childSubEl: any;
  let authorEl: any;
  let publisherEl: any;
  let sortSelectEl: any;

  let subjects = [] as any[]; //$currentSearch.subjectIds;
  let tags = [] as any[]; //$currentSearch.tagIds;

  let noSubjectsFilter = false; // = !!$currentSearch.noSubjects;
  const setNoSubjectsFilter = (evt: any) => {
    noSubjectsFilter = evt.target.checked;
  };

  const selectSubject = (subject: any) => (subjects = subjects.concat(subject._id));
  const selectTag = (tag: any) => (tags = tags.concat(tag._id));
  const removeSubject = (subject: any) => (subjects = subjects.filter(_id => _id != subject._id));
  const removeTag = (tag: any) => (tags = tags.filter(_id => _id != tag._id));

  const updateFilters = (evt: any) => {
    evt.preventDefault();

    let sort = "";
    let sortDirection = "";
    let sortValue = sortSelectEl.value;
    if (sortValue !== "_id|desc") {
      [sort, sortDirection] = sortValue.split("|");
    }

    const applyFilters: any = () => {};
    // applyFilters({
    //   subjects: noSubjectsFilter ? [] : subjects,
    //   tags,
    //   search: searchEl.value,
    //   pages: pagesEl.value,
    //   pagesOperator: pagesDirEl.value,
    //   author: authorEl.value,
    //   publisher: publisherEl.value,
    //   isRead: isReadE.checked ? "" : isRead0.checked ? "0" : "1",
    //   searchChildSubjects: childSubEl && childSubEl.checked,
    //   noSubjects: noSubjectsFilter,
    //   sort,
    //   sortDirection
    // });
  };

  const onFormData = (evt: any) => {
    //closeModal();
    const searchParams: URLSearchParams = evt.formData;
    sanitize(searchParams);

    const sortPacket = searchParams.get("sort_pack")!;
    searchParams.delete("sort_pack");

    if (sortPacket !== "_id|desc") {
      const [sort, sortDirection] = sortPacket.split("|");
      searchParams.set("sort", sort);
      searchParams.set("sortDirection", sortDirection);
    }
  };
</script>

<Modal deferStateChangeOnClose={true} {isOpen} {onHide} headerCaption={"Full Search"} standardFooter={false} bind:closeModal>
  <form action="/books" on:formdata={onFormData}>
    <FlexRow>
      <div class="col-xs-6">
        <div class="form-group">
          <label for="book_search_title">Title</label>
          <input id="book_search_title" name="search" value={$searchState.search} placeholder="Search title" class="form-control" />
        </div>
      </div>
      <div class="col-xs-6">
        <div class="form-group">
          <label for="book_search_pub">Publisher</label>
          <input id="book_search_pub" name="publisher" value={$searchState.publisher} placeholder="Publisher" class="form-control" />
        </div>
      </div>
      <div class="col-xs-6">
        <div class="form-group">
          <label for="book_search_auth">Author</label>
          <input id="book_search_auth" name="author" value={$searchState.author} placeholder="Author" class="form-control" />
        </div>
      </div>
      <Stack class="col-xs-6">
        <Stack tighter={true} style="flex: 1">
          <label for="__" class="form-label">Is Read?</label>
          <FlowItems class="radio" style="display: flex; flex: 1; align-items: center;">
            <FlowItems tightest={true} vCenter={true}>
              <input type="radio" checked={false} bind:this={isReadE} name="isRead" id="isReadE" />
              <label for="isReadE">Either</label>
            </FlowItems>
            <FlowItems tightest={true} vCenter={true}>
              <input type="radio" checked={false} name="isRead" id="isReadY" />
              <label for="isReadY">Yes</label>
            </FlowItems>
            <FlowItems tightest={true} vCenter={true}>
              <input type="radio" checked={false} bind:this={isRead0} name="isRead" id="isReadN" />
              <label for="isReadN">No</label>
            </FlowItems>
          </FlowItems>
        </Stack>
      </Stack>
      <div class="col-xs-6">
        <div class="form-group">
          <label for="book_search_sort">Sort</label>
          <select id="book_search_sort" name="sort_pack" value={$searchState.sortPacket} class="form-control">
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
        <SelectAvailableTags currentlySelected={tags} onSelect={selectTag} {allTags} />
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
            <input type="checkbox" bind:this={childSubEl} checked={false} />
            Also search child subjects
          </label>
        </div>
      {/if}
      <div class="col-xs-12">
        <label class="checkbox">
          <input type="checkbox" checked={!!noSubjectsFilter} on:change={setNoSubjectsFilter} />
          Search books with no subjects set
        </label>
      </div>
    </FlexRow>

    <Button text="Filter" preset="primary" type="submit" />
    <!-- <StandardModalFooter>
      <ActionButton text="Filter" preset="primary" onClick={updateFilters} />
    </StandardModalFooter> -->
  </form>
</Modal>
