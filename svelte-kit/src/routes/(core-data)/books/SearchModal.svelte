<script lang="ts">
  import { untrack } from "svelte";
  import type { Subject, Tag } from "$data/types";

  import Input from "$lib/components/ui/input/input.svelte";
  import { Label } from "$lib/components/ui/label";
  import * as Select from "$lib/components/ui/select";
  import * as RadioGroup from "$lib/components/ui/radio-group";
  import Checkbox from "$lib/components/ui/checkbox/checkbox.svelte";

  import Modal from "$lib/components/Modal.svelte";
  import { sanitize } from "$lib/util/formDataHelpers";
  import SelectAvailableTags from "$lib/components/subjectsAndTags/tags/SelectAvailableTags.svelte";
  import SelectAvailableSubjects from "$lib/components/subjectsAndTags/subjects/SelectAvailableSubjects.svelte";
  import DisplaySelectedTags from "$lib/components/subjectsAndTags/tags/DisplaySelectedTags.svelte";
  import DisplaySelectedSubjects from "$lib/components/subjectsAndTags/subjects/DisplaySelectedSubjects.svelte";
  import SelectAndDisplayContainer from "$lib/components/subjectsAndTags/SelectAndDisplayContainer.svelte";

  import { SearchState, publicUser, sortDisplayLookup, type SortValue } from "./state/searchState.svelte";
  import Button from "$lib/components/ui/button/button.svelte";

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
  let selectedSortValue = $state<SortValue>("added-desc");
  let localSubjects = $state<any[]>([]);
  let localTags = $state<any[]>([]);
  let noSubjects = $state(false);
  let childSubjects = $state(false);

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
    selectedSortValue = localSearchValues.sort || "added-desc";
    localSubjects = localSearchValues.subjects;
    localTags = localSearchValues.tags;
    noSubjects = localSearchValues.noSubjects;
    childSubjects = !!localSearchValues.childSubjects;
  }

  const selectSubject = (subject: any) => (localSubjects = localSubjects.concat(subject.id));
  const selectTag = (tag: any) => (localTags = localTags.concat(tag.id));
  const removeSubject = (subject: any) => (localSubjects = localSubjects.filter(id => id != subject.id));
  const removeTag = (tag: any) => (localTags = localTags.filter(id => id != tag.id));

  const onFormData = (evt: any) => {
    const searchParams: URLSearchParams = evt.formData;

    if (searchParams.get("sort") === "added-desc") {
      searchParams.delete("sort");
    }

    if (searchParams.get("is-read") === "off") {
      searchParams.delete("is-read");
    }

    if (searchParams.get("no-subjects") === "true") {
      searchParams.delete("subjects");
      searchParams.delete("child-subjects");
    }

    if (!searchParams.get("subjects")) {
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
          <Label for="search-title">Title</Label>
          <Input id="search-title" autocomplete="off" bind:ref={titleEl} name="search" placeholder="Title" value={localSearchValues.search} />
        </div>

        <div class="flex flex-col gap-1.5">
          <Label for="search-publisher">Publisher</Label>
          <Input id="search-publisher" autocomplete="off" name="publisher" value={localSearchValues.publisher} placeholder="Publisher" />
        </div>

        <div class="flex flex-col gap-1.5">
          <Label for="search-author">Author</Label>
          <Input id="search-author" autocomplete="off" name="author" value={localSearchValues.author} placeholder="Author" />
        </div>

        <div class="flex flex-col gap-1.5">
          <span class="text-neutral-600 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Is Read?</span>

          <RadioGroup.Root class="flex gap-4 my-auto" name="is-read" value={localSearchValues.isRead} orientation="horizontal">
            <div class="inline-flex items-center gap-1">
              <RadioGroup.Item value="" id="read-either" />
              <Label for="read-either">Either</Label>
            </div>
            <div class="inline-flex items-center gap-1">
              <RadioGroup.Item value="true" id="read-yes" />
              <Label for="read-yes">Yes</Label>
            </div>
            <div class="flex items-center gap-1">
              <RadioGroup.Item value="false" id="read-no" />
              <Label for="read-no">No</Label>
            </div>
          </RadioGroup.Root>
        </div>
        <div class="flex flex-col gap-1.5">
          <Label for="search-sort">Sort</Label>

          <Select.Root name="sort" type="single" bind:value={selectedSortValue}>
            <Select.Trigger id="search-sort">{sortDisplayLookup[selectedSortValue]}</Select.Trigger>
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

        <div class="sm:col-span-2 flex items-center gap-2">
          <Checkbox id="search-child-subjects" name="child-subjects" value="true" disabled={noSubjects} bind:checked={childSubjects} />
          <Label for="search-child-subjects" class="checkbox">Also search child subjects</Label>
        </div>

        <div class="sm:col-span-2 flex items-center gap-2">
          <Checkbox id="search-no-subjects" name="no-subjects" value="true" disabled={childSubjects} bind:checked={noSubjects} />
          <Label for="search-no-subjects" class="checkbox">Search books with no subjects set</Label>
        </div>
      </div>

      <div class="mt-5">
        <Button type="submit">Search</Button>
      </div>
    </form>
  </div>
</Modal>
