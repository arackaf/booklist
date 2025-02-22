<script lang="ts">
  import { page } from "$app/stores";
  import { enhance } from "$app/forms";

  import type { Book, Subject } from "$data/types";
  import type { UpdatesTo } from "$lib/state/dataUpdates";

  import * as Tabs from "$lib/components/ui/tabs";

  import DisplaySelectedSubjects from "$lib/components/subjectsAndTags/subjects/DisplaySelectedSubjects.svelte";
  import SelectAvailableSubjects from "$lib/components/subjectsAndTags/subjects/SelectAvailableSubjects.svelte";
  import SelectAndDisplayContainer from "$lib/components/subjectsAndTags/SelectAndDisplayContainer.svelte";
  import Modal from "$lib/components/Modal.svelte";
  import StandardModalFooter from "$lib/components/StandardModalFooter.svelte";
  import Button from "$lib/components/Button/Button.svelte";
  import ActionButton from "$lib/components/Button/ActionButton.svelte";

  type Props = {
    modifyingBooks: any[];
    isOpen: boolean;
    onSave: (id: number | number[], updates: UpdatesTo<Book>) => void;
    onHide: () => void;
  };

  let { modifyingBooks, isOpen, onSave, onHide }: Props = $props();
  let { subjects } = $derived($page.data);

  let addingSubjects = $state<number[]>([]);
  let removingSubjects = $state<number[]>([]);
  let saving = $state(false);

  const resetSubjects = () => {
    addingSubjects = [];
    removingSubjects = [];
  };

  $effect(() => {
    if (isOpen) {
      resetSubjects();
    }
  });

  const save = () => {
    saving = true;
    const updates = {
      arraySync: {
        subjects: {
          push: addingSubjects,
          pull: removingSubjects
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
</script>

<Modal {isOpen} {onHide} headerCaption="Add / Remove Subjects" standardFooter={false}>
  <form method="post" action="?/setBooksSubjects" use:enhance={save}>
    <Tabs.Root value="subjects" class="">
      <Tabs.List class="w-full grid grid-cols-2 gap-2">
        <Tabs.Trigger value="subjects">Choose subjects</Tabs.Trigger>
        <Tabs.Trigger value="books">For books</Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="subjects">
        {#each modifyingBooks as b}
          <input type="hidden" name="ids" value={b.id} />
        {/each}
        {#each addingSubjects as s}
          <input type="hidden" name="add" value={s} />
        {/each}
        {#each removingSubjects as s}
          <input type="hidden" name="remove" value={s} />
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
            <Button size="sm" type="button" onclick={resetSubjects}>Reset subjects</Button>
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
        <ActionButton running={saving} theme="primary">Save</ActionButton>

        <Button type="button" class="ml-auto" onclick={onHide}>Cancel</Button>
      </div>
    </StandardModalFooter>
  </form>
</Modal>
