<script lang="ts">
  import type { Subject, Tag, UnwrapReadable } from "$data/types";

  import Button from "$lib/components/buttons/Button.svelte";

  import Modal from "$lib/components/ui/Modal.svelte";
  import FlexRow from "$lib/components/layout/FlexRow.svelte";
  import FlowItems from "$lib/components/layout/FlowItems.svelte";
  import Stack from "$lib/components/layout/Stack.svelte";

  import { searchState, sortDisplayLookup } from "./state/searchState";
  import { sanitize } from "$lib/util/formDataHelpers";

  import SelectAvailableTags from "$lib/components/subjectsAndTags/tags/SelectAvailableTags.svelte";
  import SelectAvailableSubjects from "$lib/components/subjectsAndTags/subjects/SelectAvailableSubjects.svelte";

  import DisplaySelectedTags from "$lib/components/subjectsAndTags/tags/DisplaySelectedTags.svelte";
  import DisplaySelectedSubjects from "$lib/components/subjectsAndTags/subjects/DisplaySelectedSubjects.svelte";
  import { get } from "svelte/store";

  export let isOpen = false;
  export let onHide = () => {};

  export let tags: Tag[];
  export let allSubjects: Subject[];

  let localSearchValues: UnwrapReadable<typeof searchState> = {} as any;

  let localSubjects = [] as any[];
  let localTags = [] as any[];
  let noSubjects: boolean;
  let key = 1;

  $: {
    if (isOpen) {
      key++;
      syncSearchState();
    }
  }
  function syncSearchState() {
    localSearchValues = { ...get(searchState) };
    localSubjects = localSearchValues.subjects;
    localTags = localSearchValues.tags;
    noSubjects = localSearchValues.noSubjects;
  }

  const selectSubject = (subject: any) => (localSubjects = localSubjects.concat(subject.id));
  const selectTag = (tag: any) => (localTags = localTags.concat(tag.id));
  const removeSubject = (subject: any) => (localSubjects = localSubjects.filter(id => id != subject.id));
  const removeTag = (tag: any) => (localTags = localTags.filter(id => id != tag.id));

  const onFormData = (evt: any) => {
    const searchParams: URLSearchParams = evt.formData;

    if (searchParams.get("sort") === "id-desc") {
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
  {#key key}
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
              {#each Object.entries(sortDisplayLookup) as [sortVal, display]}
                <option value={sortVal}>{display}</option>
              {/each}
            </select>
          </div>
        </div>
        <div class="col-xs-6" />

        <div class="col-sm-3 col-xs-12">
          <SelectAvailableTags {tags} currentlySelected={localTags} onSelect={selectTag} />
        </div>
        <div class="col-sm-9 col-xs-12">
          <DisplaySelectedTags {tags} currentlySelected={localTags} onRemove={removeTag} />
        </div>

        {#if !noSubjects}
          <div class="col-sm-3 col-xs-12">
            <SelectAvailableSubjects subjects={allSubjects} currentlySelected={localSubjects} onSelect={selectSubject} />
          </div>
          <div class="col-sm-9 col-xs-12">
            <DisplaySelectedSubjects subjects={allSubjects} currentlySelected={localSubjects} onRemove={removeSubject} />
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
  {/key}
</Modal>
