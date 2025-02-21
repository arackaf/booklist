<script lang="ts">
  import { untrack } from "svelte";
  import type { Subject, Tag } from "$data/types";

  import Button from "$lib/components/Button/Button.svelte";
  import Modal from "$lib/components/Modal.svelte";
  import { sanitize } from "$lib/util/formDataHelpers";
  import SelectAvailableTags from "$lib/components/subjectsAndTags/tags/SelectAvailableTags.svelte";
  import SelectAvailableSubjects from "$lib/components/subjectsAndTags/subjects/SelectAvailableSubjects.svelte";
  import DisplaySelectedTags from "$lib/components/subjectsAndTags/tags/DisplaySelectedTags.svelte";
  import DisplaySelectedSubjects from "$lib/components/subjectsAndTags/subjects/DisplaySelectedSubjects.svelte";
  import SelectAndDisplayContainer from "$lib/components/subjectsAndTags/SelectAndDisplayContainer.svelte";

  import { SearchState, publicUser, sortDisplayLookup } from "./state/searchState.svelte";
  import Input from "$lib/components/ui/input/input.svelte";
  import { Label } from "$lib/components/ui/label";
  import * as Select from "$lib/components/ui/select";
  import * as RadioGroup from "$lib/components/ui/radio-group";

  type Props = {
    isOpen: boolean;
    onHide: () => void;
    tags: Tag[];
    allSubjects: Subject[];
  };

  let { isOpen, onHide = () => {}, tags, allSubjects }: Props = $props();

  const searchState = new SearchState();

  let titleEl = $state<HTMLInputElement | null>(null);
  let localSearchValues = $state<(typeof searchState)["value"]>({} as any);
  let selectedSortValue = $state("id-desc");
  let localSubjects = $state<any[]>([]);
  let localTags = $state<any[]>([]);
  let noSubjects = $state(false);

  const onOpen = () => {
    syncSearchState();
    setTimeout(() => {
      titleEl?.focus();
    });
  };

  $effect(() => {
    if (isOpen) {
      untrack(() => {
        onOpen();
      });
    }
  });

  function syncSearchState() {
    localSearchValues = searchState.value;
    selectedSortValue = localSearchValues.sort || "id-desc";
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
  <div>
    <form action="/books" onformdata={onFormData} onsubmit={onHide}>
      {#if publicUser.value}
        <input type="hidden" name="user" value={publicUser.value} />
      {/if}
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
        <div class="flex flex-col gap-1.5">
          <Label>Title</Label>
          <Input bind:ref={titleEl} name="search" placeholder="Title" value={localSearchValues.search} />
        </div>

        <div class="flex flex-col gap-1.5">
          <Label>Publisher</Label>
          <Input name="publisher" value={localSearchValues.publisher} placeholder="Publisher" />
        </div>

        <div class="flex flex-col gap-1.5">
          <Label>Author</Label>
          <Input name="author" value={localSearchValues.author} placeholder="Author" />
        </div>

        <div class="flex flex-col gap-1.5">
          <Label>Is Read?</Label>

          <RadioGroup.Root class="flex gap-4 my-auto" name="is-read" value={localSearchValues.isRead} orientation="horizontal">
            <div class="inline-flex items-center gap-1.5">
              <RadioGroup.Item value="" id="read-either" />
              <Label for="read-either">Either</Label>
            </div>
            <div class="inline-flex items-center gap-1.5">
              <RadioGroup.Item value="true" id="read-yes" />
              <Label for="read-yes">Yes</Label>
            </div>
            <div class="flex items-center gap-1.5">
              <RadioGroup.Item value="false" id="read-no" />
              <Label for="read-no">No</Label>
            </div>
          </RadioGroup.Root>

          <!-- <div class="flex-1 flex flex-row gap-4 items-center mt-1 sm:mt-0">
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
          </div> -->
        </div>
        <div class="flex flex-col gap-1.5">
          <Label>Sort</Label>

          <Select.Root
            type="single"
            value={selectedSortValue}
            onValueChange={val => {
              selectedSortValue = val;
            }}
          >
            <Select.Trigger>{sortDisplayLookup[selectedSortValue]}</Select.Trigger>
            <Select.Content>
              {#each Object.entries(sortDisplayLookup) as [sortVal, display]}
                <Select.Item value={sortVal} label={display}>{display}</Select.Item>
              {/each}
            </Select.Content>
          </Select.Root>
        </div>

        <SelectAndDisplayContainer class="sm:col-span-2 pt-2">
          {#snippet select()}
            <SelectAvailableTags placeholder="Tags" {tags} currentlySelected={localTags} onSelect={selectTag} />
          {/snippet}
          {#snippet display()}
            <DisplaySelectedTags {tags} currentlySelected={localTags} onRemove={removeTag} />
          {/snippet}
        </SelectAndDisplayContainer>

        <SelectAndDisplayContainer class="sm:col-span-2">
          {#snippet select()}
            <SelectAvailableSubjects
              disabled={noSubjects}
              placeholder="Subjects"
              subjects={allSubjects}
              currentlySelected={localSubjects}
              onSelect={selectSubject}
            />
          {/snippet}
          {#snippet display()}
            <DisplaySelectedSubjects disabled={noSubjects} subjects={allSubjects} currentlySelected={localSubjects} onRemove={removeSubject} />
          {/snippet}
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
        <Button theme="primary">Search</Button>
      </div>
    </form>
  </div>
</Modal>
