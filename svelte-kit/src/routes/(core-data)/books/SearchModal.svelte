<script lang="ts">
  import type { Subject, Tag } from "$data/types";
  import type { UnwrapReadable } from "$lib/types";

  import Button from "$lib/components/Button/Button.svelte";

  import Modal from "$lib/components/Modal.svelte";

  import { searchState, publicUser, sortDisplayLookup } from "./state/searchState";
  import { sanitize } from "$lib/util/formDataHelpers";

  import SelectAvailableTags from "$lib/components/subjectsAndTags/tags/SelectAvailableTags.svelte";
  import SelectAvailableSubjects from "$lib/components/subjectsAndTags/subjects/SelectAvailableSubjects.svelte";

  import DisplaySelectedTags from "$lib/components/subjectsAndTags/tags/DisplaySelectedTags.svelte";
  import DisplaySelectedSubjects from "$lib/components/subjectsAndTags/subjects/DisplaySelectedSubjects.svelte";
  import { get } from "svelte/store";
  import SelectAndDisplayContainer from "$lib/components/subjectsAndTags/SelectAndDisplayContainer.svelte";
  import InputGroup from "$lib/components/form-elements/Input/InputGroup.svelte";
  import Input from "$lib/components/form-elements/Input/Input.svelte";
  import SelectGroup from "$lib/components/form-elements/Select/SelectGroup.svelte";
  import Select from "$lib/components/form-elements/Select/Select.svelte";

  export let isOpen = false;
  export let onHide = () => {};

  export let tags: Tag[];
  export let allSubjects: Subject[];

  let titleEl: HTMLInputElement;
  let localSearchValues: UnwrapReadable<typeof searchState> = {} as any;

  let localSubjects = [] as any[];
  let localTags = [] as any[];
  let noSubjects: boolean;

  const onOpen = () => {
    syncSearchState();
    setTimeout(() => {
      titleEl?.focus();
    });
  };

  $: {
    if (isOpen) {
      onOpen();
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
  <form action="/books" on:formdata={onFormData} on:submit={onHide}>
    {#if $publicUser}
      <input type="hidden" name="user" value={$publicUser} />
    {/if}
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
      <InputGroup labelText="Title">
        <Input bind:inputEl={titleEl} slot="input" name="search" placeholder="Title" value={localSearchValues.search} />
      </InputGroup>

      <InputGroup labelText="Publisher">
        <Input slot="input" name="publisher" value={localSearchValues.publisher} placeholder="Publisher" />
      </InputGroup>

      <InputGroup labelText="Author">
        <Input slot="input" name="author" value={localSearchValues.author} placeholder="Author" />
      </InputGroup>

      <div class="flex flex-col">
        <label for="isReadE" class="text-sm">Is Read?</label>
        <div class="flex-1 flex flex-row gap-4 items-center mt-1 sm:mt-0">
          <div class="flex flex-row items-center gap-1">
            <input type="radio" checked={localSearchValues.isRead === ""} name="is-read" id="isReadE" value="off" />
            <label for="isReadE">Either</label>
          </div>
          <div class="flex flex-row items-center gap-1">
            <input type="radio" checked={localSearchValues.isRead === "true"} name="is-read" id="isReadY" value="true" />
            <label for="isReadY">Yes</label>
          </div>
          <div class="flex flex-row items-center gap-1">
            <input type="radio" checked={localSearchValues.isRead === "false"} name="is-read" id="isReadN" value="false" />
            <label for="isReadN">No</label>
          </div>
        </div>
      </div>
      <SelectGroup labelText="Sort">
        <Select slot="select" name="sort" value={localSearchValues.sortPacket || "id-desc"}>
          {#each Object.entries(sortDisplayLookup) as [sortVal, display]}
            <option value={sortVal}>{display}</option>
          {/each}
        </Select>
      </SelectGroup>

      <SelectAndDisplayContainer class="sm:col-span-2 pt-2">
        <SelectAvailableTags placeholder="Tags" slot="select" {tags} currentlySelected={localTags} onSelect={selectTag} />
        <DisplaySelectedTags slot="display" {tags} currentlySelected={localTags} onRemove={removeTag} />
      </SelectAndDisplayContainer>

      <SelectAndDisplayContainer class="sm:col-span-2">
        <SelectAvailableSubjects
          placeholder="Subjects"
          inputProps={{ disabled: noSubjects }}
          slot="select"
          subjects={allSubjects}
          currentlySelected={localSubjects}
          onSelect={selectSubject}
        />
        <DisplaySelectedSubjects
          disabled={noSubjects}
          slot="display"
          subjects={allSubjects}
          currentlySelected={localSubjects}
          onRemove={removeSubject}
        />
      </SelectAndDisplayContainer>

      <div class="sm:col-span-2">
        <label class="checkbox">
          <input type="checkbox" name="child-subjects" value="true" checked={!!localSearchValues.childSubjects} />
          Also search child subjects
        </label>
      </div>

      <div class="sm:col-span-2">
        <label class="checkbox">
          <input type="checkbox" name="no-subjects" value="true" bind:checked={noSubjects} />
          Search books with no subjects set
        </label>
      </div>
    </div>

    <div class="mt-5">
      <Button theme="primary" text="Filter">Search</Button>
    </div>
  </form>
</Modal>
