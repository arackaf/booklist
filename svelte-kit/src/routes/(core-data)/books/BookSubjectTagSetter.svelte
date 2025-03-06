<script lang="ts">
  import { page } from "$app/stores";
  import { enhance } from "$app/forms";

  import type { Book, Subject, Tag } from "$data/types";
  import type { UpdatesTo } from "$lib/state/dataUpdates";

  import * as Tabs from "$lib/components/ui/tabs";

  import Button from "$lib/components/ui/button/button.svelte";

  import DisplaySelectedSubjects from "$lib/components/subjectsAndTags/subjects/DisplaySelectedSubjects.svelte";
  import SelectAvailableSubjects from "$lib/components/subjectsAndTags/subjects/SelectAvailableSubjects.svelte";
  import SelectAvailableTags from "$lib/components/subjectsAndTags/tags/SelectAvailableTags.svelte";
  import DisplaySelectedTags from "$lib/components/subjectsAndTags/tags/DisplaySelectedTags.svelte";

  import SelectAndDisplayContainer from "$lib/components/subjectsAndTags/SelectAndDisplayContainer.svelte";
  import Modal from "$lib/components/Modal.svelte";
  import StandardModalFooter from "$lib/components/StandardModalFooter.svelte";

  type Props = {
    modifyingBooks: any[];
    isOpen: boolean;
    onSave: (id: number | number[], updates: UpdatesTo<Book>) => void;
    onHide: () => void;
  };

  let { modifyingBooks, isOpen, onSave, onHide }: Props = $props();
  let { subjects, tags } = $derived($page.data);

  let addingSubjects = $state<number[]>([]);
  let removingSubjects = $state<number[]>([]);
  let addingTags = $state<number[]>([]);
  let removingTags = $state<number[]>([]);
  let saving = $state(false);

  const resetSubjects = () => {
    addingSubjects = [];
    removingSubjects = [];
  };

  const resetTags = () => {
    addingTags = [];
    removingTags = [];
  };

  $effect(() => {
    if (isOpen) {
      resetSubjects();
      resetTags();
    }
  });

  const save = () => {
    saving = true;
    const updates = {
      arraySync: {
        subjects: {
          push: addingSubjects,
          pull: removingSubjects
        },
        tags: {
          push: addingTags,
          pull: removingTags
        }
      }
    };
    return async ({}) => {
      onSave(
        modifyingBooks.map(b => b.id),
        updates
      );
      saving = false;
      window.dispatchEvent(new CustomEvent("reload-user-summary"));
      onHide();
    };
  };

  const addingSubjectSet = (adding: boolean, { id }: Subject) =>
    (addingSubjects = adding ? addingSubjects.concat(id) : addingSubjects.filter(x => x != id));
  const subjectSelectedToAdd = addingSubjectSet.bind(null, true);

  const removingSubjectSet = (adding: boolean, { id }: Subject) =>
    (removingSubjects = adding ? removingSubjects.concat(id) : removingSubjects.filter(x => x != id));
  const subjectSelectedToRemove = removingSubjectSet.bind(null, true);

  const dontAddSubject = addingSubjectSet.bind(null, false);
  const dontRemoveSubject = removingSubjectSet.bind(null, false);

  const addingTagSet = (adding: boolean, { id }: Tag) => (addingTags = adding ? addingTags.concat(id) : addingTags.filter(x => x != id));
  const tagSelectedToAdd = addingTagSet.bind(null, true);

  const removingTagSet = (adding: boolean, { id }: Tag) => (removingTags = adding ? removingTags.concat(id) : removingTags.filter(x => x != id));
  const tagSelectedToRemove = removingTagSet.bind(null, true);

  const dontAddTag = addingTagSet.bind(null, false);
  const dontRemoveTag = removingTagSet.bind(null, false);
</script>

<Modal {isOpen} {onHide} headerCaption="Set Subjects & Tags" standardFooter={false}>
  <form method="post" action="?/setBooksSubjectsTags" use:enhance={save}>
    {#each modifyingBooks as b}
      <input type="hidden" name="ids" value={b.id} />
    {/each}
    <Tabs.Root value="subjects" class="">
      <Tabs.List class="w-full grid grid-cols-3 gap-2">
        <Tabs.Trigger value="subjects">Subjects</Tabs.Trigger>
        <Tabs.Trigger value="tags">Tags</Tabs.Trigger>
        <Tabs.Trigger value="books">For books</Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="subjects">
        {#each addingSubjects as s}
          <input type="hidden" name="subjects-add" value={s} />
        {/each}
        {#each removingSubjects as s}
          <input type="hidden" name="subjects-remove" value={s} />
        {/each}
        <div class="flex flex-col gap-4 pt-3">
          <SelectAndDisplayContainer>
            {#snippet select()}
              <SelectAvailableSubjects {subjects} placeholder="Adding" currentlySelected={addingSubjects} onSelect={subjectSelectedToAdd} />
            {/snippet}
            {#snippet display()}
              <DisplaySelectedSubjects {subjects} currentlySelected={addingSubjects} onRemove={dontAddSubject} />
            {/snippet}
          </SelectAndDisplayContainer>

          <SelectAndDisplayContainer>
            {#snippet select()}
              <SelectAvailableSubjects {subjects} placeholder="Removing" currentlySelected={removingSubjects} onSelect={subjectSelectedToRemove} />
            {/snippet}
            {#snippet display()}
              <DisplaySelectedSubjects {subjects} currentlySelected={removingSubjects} onRemove={dontRemoveSubject} />
            {/snippet}
          </SelectAndDisplayContainer>

          <div>
            <Button variant="secondary" size="sm" type="button" onclick={resetSubjects}>Reset subjects</Button>
          </div>
        </div>
      </Tabs.Content>

      <Tabs.Content value="tags">
        {#each addingTags as t}
          <input type="hidden" name="tags-add" value={t} />
        {/each}
        {#each removingTags as t}
          <input type="hidden" name="tags-remove" value={t} />
        {/each}
        <div class="flex flex-col gap-4 pt-3">
          <SelectAndDisplayContainer>
            {#snippet select()}
              <SelectAvailableTags {tags} placeholder="Adding" currentlySelected={addingTags} onSelect={tagSelectedToAdd} />
            {/snippet}
            {#snippet display()}
              <DisplaySelectedTags {tags} currentlySelected={addingTags} onRemove={dontAddTag} />
            {/snippet}
          </SelectAndDisplayContainer>

          <SelectAndDisplayContainer>
            {#snippet select()}
              <SelectAvailableTags {tags} placeholder="Removing" currentlySelected={removingTags} onSelect={tagSelectedToRemove} />
            {/snippet}
            {#snippet display()}
              <DisplaySelectedTags {tags} currentlySelected={removingTags} onRemove={dontRemoveTag} />
            {/snippet}
          </SelectAndDisplayContainer>

          <div>
            <Button variant="secondary" size="sm" type="button" onclick={resetTags}>Reset tags</Button>
          </div>
        </div>
      </Tabs.Content>

      <Tabs.Content value="books">
        <div class="flex flex-col gap-2 text-sm">
          {#each modifyingBooks as book (book.id)}
            <div>{book.title}</div>
          {/each}
        </div>
      </Tabs.Content>
    </Tabs.Root>

    <StandardModalFooter>
      <div class="flex flex-row">
        <Button type="submit" disabled={saving}>Save</Button>
        <Button variant="outline" type="button" class="ml-auto" onclick={onHide}>Cancel</Button>
      </div>
    </StandardModalFooter>
  </form>
</Modal>
