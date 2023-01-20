<script lang="ts">
  import { page } from "$app/stores";
  import type { Book, Subject } from "$data/types";
  import DisplaySelectedSubjects from "$lib/components/subjectsAndTags/subjects/DisplaySelectedSubjects.svelte";
  import SelectAvailableSubjects from "$lib/components/subjectsAndTags/subjects/SelectAvailableSubjects.svelte";

  import Modal from "$lib/components/ui/Modal.svelte";
  import StandardModalFooter from "$lib/components/ui/StandardModalFooter.svelte";
  import Button from "$lib/components/buttons/Button.svelte";
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";

  import { Tabs, TabHeaders, TabHeader, TabContents, TabContent } from "$lib/components/layout/tabs/index";

  import FlexRow from "$lib/components/layout/FlexRow.svelte";
  import Stack from "$lib/components/layout/Stack.svelte";
  import FlowItems from "$lib/components/layout/FlowItems.svelte";
  import { enhance } from "$app/forms";
  import type { UpdatesTo } from "$lib/state/dataUpdates";

  $: subjects = $page.data.subjects;
  export let modifyingBooks: any[];
  export let isOpen: boolean;
  export let onSave: (_id: string | string[], updates: UpdatesTo<Book>) => void;
  export let onHide: () => void;

  let addingSubjects: string[] = [];
  let removingSubjects: string[] = [];

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
    return async ({ result }: any) => {
      onSave(
        modifyingBooks.map(b => b._id),
        updates
      );
      onHide();
      saving = false;
    };
  };
  const addingSubjectSet = (adding: boolean, { _id }: Subject) =>
    (addingSubjects = adding ? addingSubjects.concat(_id) : addingSubjects.filter(x => x != _id));
  const subjectSelectedToAdd = addingSubjectSet.bind(null, true);

  const removingSubjectSet = (adding: boolean, { _id }: Subject) =>
    (removingSubjects = adding ? removingSubjects.concat(_id) : removingSubjects.filter(x => x != _id));
  const subjectSelectedToRemove = removingSubjectSet.bind(null, true);

  const dontAddSubject = addingSubjectSet.bind(null, false);
  const dontRemoveSubject = removingSubjectSet.bind(null, false);

  let closeModal: () => void;
</script>

<Modal {isOpen} {onHide} headerCaption="Add / Remove Subjects" standardFooter={false}>
  <form method="post" action="?/setBooksSubjects" use:enhance={save}>
    <Tabs defaultTab="subjects">
      <TabHeaders>
        <TabHeader tabName="subjects" text="Choose subjects" />
        <TabHeader tabName="books" text="For books" />
      </TabHeaders>
      <TabContents>
        <TabContent tabName="subjects">
          {#each modifyingBooks as b}
            <input type="hidden" name="_ids" value={b._id} />
          {/each}
          {#each addingSubjects as s}
            <input type="hidden" name="add" value={s} />
          {/each}
          {#each removingSubjects as s}
            <input type="hidden" name="remove" value={s} />
          {/each}
          <FlexRow>
            <div class="col-xs-3">
              <SelectAvailableSubjects {subjects} placeholder="Adding" currentlySelected={addingSubjects} onSelect={subjectSelectedToAdd} />
            </div>
            <div class="col-xs-9" style="display: flex; flex-wrap: wrap">
              <DisplaySelectedSubjects {subjects} currentlySelected={addingSubjects} onRemove={dontAddSubject} />
            </div>

            <div class="col-xs-3">
              <SelectAvailableSubjects {subjects} placeholder="Removing" currentlySelected={removingSubjects} onSelect={subjectSelectedToRemove} />
            </div>
            <div class="col-xs-9" style="display: flex; flex-wrap: wrap">
              <DisplaySelectedSubjects {subjects} currentlySelected={removingSubjects} onRemove={dontRemoveSubject} />
            </div>

            <div class="col-xs-12">
              <Button type="button" onClick={resetSubjects} preset="default-xs">Reset subjects</Button>
            </div>
          </FlexRow>
        </TabContent>
        <TabContent tabName="books">
          <Stack style="font-size: 14px">
            {#each modifyingBooks as book (book._id)}
              <div>{book.title}</div>
            {/each}
          </Stack>
        </TabContent>
      </TabContents>
    </Tabs>
    <StandardModalFooter bind:closeModal>
      <FlowItems pushLast={true}>
        <ActionButton isRunning={saving} style="min-width: 10ch" preset="primary" text="Save" runningText="Saving" finishedText="Saved" />

        <Button type="button" style="min-width: 10ch" preset="" onClick={closeModal}>Cancel</Button>
      </FlowItems>
    </StandardModalFooter>
  </form>
</Modal>
