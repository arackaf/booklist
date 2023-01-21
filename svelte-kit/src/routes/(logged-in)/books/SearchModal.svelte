<script lang="ts">
  import type { Subject, Tag, UnwrapReadable } from "$data/types";

  import Button from "$lib/components/buttons/Button.svelte";

  import Modal from "$lib/components/ui/Modal.svelte";
  import FlexRow from "$lib/components/layout/FlexRow.svelte";
  import FlowItems from "$lib/components/layout/FlowItems.svelte";
  import Stack from "$lib/components/layout/Stack.svelte";

  import { searchState } from "./state/searchState";
  import { sanitize } from "$lib/util/formDataHelpers";

  import SelectAvailableTags from "$lib/components/subjectsAndTags/tags/SelectAvailableTags.svelte";
  import SelectAvailableSubjects from "$lib/components/subjectsAndTags/subjects/SelectAvailableSubjects.svelte";

  import DisplaySelectedTags from "$lib/components/subjectsAndTags/tags/DisplaySelectedTags.svelte";
  import DisplaySelectedSubjects from "$lib/components/subjectsAndTags/subjects/DisplaySelectedSubjects.svelte";
  import { get } from "svelte/store";

  export let isOpen = false;
  export let onHide = () => {};

  export let allTags: Tag[];
  export let allSubjects: Subject[];

  let localSearchValues: UnwrapReadable<typeof searchState> = {} as any;

  let subjects = [] as any[];
  let tags = [] as any[];
  let noSubjects: boolean;

  $: {
    if (isOpen) {
      syncSearchState();
    }
  }
  function syncSearchState() {
    localSearchValues = { ...get(searchState) };
    subjects = localSearchValues.subjects;
    tags = localSearchValues.tags;
    noSubjects = localSearchValues.noSubjects;
  }

  const selectSubject = (subject: any) => (subjects = subjects.concat(subject._id));
  const selectTag = (tag: any) => (tags = tags.concat(tag._id));
  const removeSubject = (subject: any) => (subjects = subjects.filter(_id => _id != subject._id));
  const removeTag = (tag: any) => (tags = tags.filter(_id => _id != tag._id));

  const onFormData = (evt: any) => {
    const searchParams: URLSearchParams = evt.formData;

    if (searchParams.get("sort") === "_id-desc") {
      searchParams.delete("sort");
    }

    if (searchParams.get("is-read") === "off") {
      searchParams.delete("is-read");
    }

    if (searchParams.get("no-subjects") === "true") {
      searchParams.delete("subjects");
      searchParams.delete("child-subjects");
    }

    sanitize(searchParams);
  };
</script>

<Modal {isOpen} {onHide} headerCaption={"Full Search"} standardFooter={false}>
  <form action="/books" on:formdata={onFormData} on:submit={onHide}>
    <FlexRow>
      <div class="col-xs-6">
        <div class="form-group">
          <label for="book_search_title">Title</label>
          <input id="book_search_title" name="search" value={localSearchValues.search} placeholder="Search title" class="form-control" />
        </div>
      </div>
      <div class="col-xs-6">
        <div class="form-group">
          <label for="book_search_pub">Publisher</label>
          <input id="book_search_pub" name="publisher" value={localSearchValues.publisher} placeholder="Publisher" class="form-control" />
        </div>
      </div>
      <div class="col-xs-6">
        <div class="form-group">
          <label for="book_search_auth">Author</label>
          <input id="book_search_auth" name="author" value={localSearchValues.author} placeholder="Author" class="form-control" />
        </div>
      </div>
      <Stack class="col-xs-6">
        <Stack tighter={true} style="flex: 1">
          <label for="__" class="form-label">Is Read?</label>
          <FlowItems class="radio" style="display: flex; flex: 1; align-items: center;">
            <FlowItems tightest={true} vCenter={true}>
              <input type="radio" checked={localSearchValues.isRead === ""} name="is-read" id="isReadE" value="off" />
              <label for="isReadE">Either</label>
            </FlowItems>
            <FlowItems tightest={true} vCenter={true}>
              <input type="radio" checked={localSearchValues.isRead === "true"} name="is-read" id="isReadY" value="true" />
              <label for="isReadY">Yes</label>
            </FlowItems>
            <FlowItems tightest={true} vCenter={true}>
              <input type="radio" checked={localSearchValues.isRead === "false"} name="is-read" id="isReadN" value="false" />
              <label for="isReadN">No</label>
            </FlowItems>
          </FlowItems>
        </Stack>
      </Stack>
      <div class="col-xs-6">
        <div class="form-group">
          <label for="book_search_sort">Sort</label>
          <select id="book_search_sort" name="sort" value={localSearchValues.sortPacket} class="form-control">
            <option value="title-asc">Title A-Z</option>
            <option value="title-desc">Title Z-A</option>
            <option value="pages-asc">Pages, Low</option>
            <option value="pages-desc">Pages, High</option>
            <option value="_id-asc">Created, Earliest</option>
            <option value="_id-desc">Created, Most Recent</option>
          </select>
        </div>
      </div>
      <div class="col-xs-6" />

      <div class="col-sm-3 col-xs-12">
        <SelectAvailableTags tags={allTags} currentlySelected={tags} onSelect={selectTag} />
      </div>
      <div class="col-sm-9 col-xs-12">
        <DisplaySelectedTags tags={allTags} currentlySelected={tags} onRemove={removeTag} />
      </div>

      {#if !noSubjects}
        <div class="col-sm-3 col-xs-12">
          <SelectAvailableSubjects subjects={allSubjects} currentlySelected={subjects} onSelect={selectSubject} />
        </div>
        <div class="col-sm-9 col-xs-12">
          <DisplaySelectedSubjects subjects={allSubjects} currentlySelected={subjects} onRemove={removeSubject} />
        </div>

        <div class="col-xs-12">
          <label class="checkbox">
            <input type="checkbox" name="child-subjects" value="true" checked={!!localSearchValues.childSubjects} />
            Also search child subjects
          </label>
        </div>
      {/if}

      <div class="col-xs-12">
        <label class="checkbox">
          <input type="checkbox" name="no-subjects" value="true" bind:checked={noSubjects} />
          Search books with no subjects set
        </label>
      </div>
    </FlexRow>

    <div class="margin-top-med">
      <Button text="Filter" preset="primary">Search</Button>
    </div>
  </form>
</Modal>
