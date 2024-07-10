<script lang="ts">
  import { page } from "$app/stores";
  import { enhance } from "$app/forms";
  import { invalidate } from "$app/navigation";

  import type { Book, Subject } from "$data/types";

  import DisplaySelectedSubjects from "$lib/components/subjectsAndTags/subjects/DisplaySelectedSubjects.svelte";
  import SelectAvailableSubjects from "$lib/components/subjectsAndTags/subjects/SelectAvailableSubjects.svelte";

  import Modal from "$lib/components/Modal.svelte";
  import StandardModalFooter from "$lib/components/StandardModalFooter.svelte";
  import Button from "$lib/components/Button/Button.svelte";
  import ActionButton from "$lib/components/Button/ActionButton.svelte";

  import { Tabs, TabHeaders, TabHeader, TabContents, TabContent } from "$lib/components/layout/tabs/index";

  import type { UpdatesTo } from "$lib/state/dataUpdates";
  import SelectAndDisplayContainer from "$lib/components/subjectsAndTags/SelectAndDisplayContainer.svelte";

  $: subjects = $page.data.subjects;
  export let modifyingBooks: any[];
  export let isOpen: boolean;
  export let onSave: (id: number | number[], updates: UpdatesTo<Book>) => void;
  export let onHide: () => void;

  let addingSubjects: number[] = [];
  let removingSubjects: number[] = [];

  const resetSubjects = () => {
    addingSubjects = [];
    removingSubjects = [];
  };

  $: {
    if (isOpen) {
      resetSubjects();
    }
  }

  let saving = false;
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
    <Tabs defaultTab="subjects">
      <TabHeaders>
        <TabHeader tabName="subjects">Choose subjects</TabHeader>
        <TabHeader tabName="books">For books</TabHeader>
      </TabHeaders>
      <TabContents>
        <TabContent tabName="subjects">
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
              <SelectAvailableSubjects
                slot="select"
                {subjects}
                placeholder="Adding"
                currentlySelected={addingSubjects}
                onSelect={subjectSelectedToAdd}
              />
              <DisplaySelectedSubjects slot="display" {subjects} currentlySelected={addingSubjects} onRemove={dontAddSubject} />
            </SelectAndDisplayContainer>

            <SelectAndDisplayContainer>
              <SelectAvailableSubjects
                slot="select"
                {subjects}
                placeholder="Removing"
                currentlySelected={removingSubjects}
                onSelect={subjectSelectedToRemove}
              />
              <DisplaySelectedSubjects slot="display" {subjects} currentlySelected={removingSubjects} onRemove={dontRemoveSubject} />
            </SelectAndDisplayContainer>

            <div>
              <Button size="sm" type="button" onclick={resetSubjects}>Reset subjects</Button>
            </div>
          </div>
        </TabContent>
        <TabContent tabName="books">
          <div class="flex flex-col gap-2 text-sm">
            {#each modifyingBooks as book (book.id)}
              <div>{book.title}</div>
            {/each}
          </div>
        </TabContent>
      </TabContents>
    </Tabs>
    <StandardModalFooter>
      <div class="flex flex-row">
        <ActionButton running={saving} theme="primary">Save</ActionButton>

        <Button type="button" class="ml-auto" onclick={onHide}>Cancel</Button>
      </div>
    </StandardModalFooter>
  </form>
</Modal>
