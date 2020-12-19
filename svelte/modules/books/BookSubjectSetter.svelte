<script lang="ts">
  import { mutation } from "micro-graphql-svelte";

  import updateBookSubjects from "graphQL/books/updateBookSubjects.graphql";

  import Modal from "app/components/ui/Modal.svelte";
  import StandardModalFooter from "app/components/ui/StandardModalFooter.svelte";
  import Button from "app/components/buttons/Button.svelte";
  import ActionButton from "app/components/buttons/ActionButton.svelte";
  import Tabs from "app/components/layout/tabs/Tabs.svelte";
  import TabHeaders from "app/components/layout/tabs/TabHeaders.svelte";
  import TabHeader from "app/components/layout/tabs/TabHeader.svelte";
  import TabContents from "app/components/layout/tabs/TabContents.svelte";
  import TabContent from "app/components/layout/tabs/TabContent.svelte";

  import { MutationOf, Mutations } from "graphql-typings";
  import FlexRow from "app/components/layout/FlexRow.svelte";
  import Stack from "app/components/layout/Stack.svelte";
  import FlowItems from "app/components/layout/FlowItems.svelte";

  import DisplaySelectedSubjects from "app/components/subjectsAndTags/subjects/DisplaySelectedSubjects.svelte";
  import SelectAvailableSubjects from "app/components/subjectsAndTags/subjects/SelectAvailableSubjects.svelte";

  export let modifyingBooks: any[];
  export let isOpen;
  export let onHide;

  interface ILocalProps {
    modifyingBooks: any[];
    onDone: any;
  }

  let addingSubjects = [];
  let removingSubjects = [];

  const resetSubjects = () => {
    addingSubjects = [];
    removingSubjects = [];
  };

  const { mutationState } = mutation<MutationOf<Mutations["updateBooks"]>>(updateBookSubjects);
  $: ({ runMutation, running } = $mutationState);

  const save = () => {
    let args = { books: modifyingBooks.map(b => b._id), add: addingSubjects, remove: removingSubjects };
    return Promise.resolve(runMutation(args)).then(() => {
      onHide();
    });
  };
  const addingSubjectSet = (adding, { _id }) => (addingSubjects = adding ? addingSubjects.concat(_id) : addingSubjects.filter(x => x != _id));
  const subjectSelectedToAdd = addingSubjectSet.bind(null, true);

  const removingSubjectSet = (adding, { _id }) => (removingSubjects = adding ? removingSubjects.concat(_id) : removingSubjects.filter(x => x != _id));
  const subjectSelectedToRemove = removingSubjectSet.bind(null, true);

  const dontAddSubject = addingSubjectSet.bind(null, false);
  const dontRemoveSubject = removingSubjectSet.bind(null, false);

  let closeModal;
</script>

<Modal {isOpen} {onHide} headerCaption="Add / Remove Subjects" deferStateChangeOnClose={true} standardFooter={false}>
  <Tabs defaultTab="subjects">
    <TabHeaders>
      <TabHeader tabName="subjects"><a>Choose subjects</a></TabHeader>
      <TabHeader tabName="books"><a>For books</a></TabHeader>
    </TabHeaders>
    <TabContents>
      <TabContent tabName="subjects">
        <FlexRow>
          <div class="col-xs-3">
            <SelectAvailableSubjects placeholder="Adding" currentlySelected={addingSubjects} onSelect={subjectSelectedToAdd} />
          </div>
          <div class="col-xs-9" style="display: flex; flex-wrap: wrap">
            <DisplaySelectedSubjects currentlySelected={addingSubjects} onRemove={dontAddSubject} />
          </div>

          <div class="col-xs-3">
            <SelectAvailableSubjects placeholder="Removing" currentlySelected={removingSubjects} onSelect={subjectSelectedToRemove} />
          </div>
          <div class="col-xs-9" style="display: flex; flex-wrap: wrap">
            <DisplaySelectedSubjects currentlySelected={removingSubjects} onRemove={dontRemoveSubject} />
          </div>

          <div class="col-xs-12">
            <Button onClick={resetSubjects} preset="default-xs">Reset subjects</Button>
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
      <ActionButton style="min-width: 10ch" preset="primary" text="Save" runningText="Saving" finishedText="Saved" onClick={save} />

      <Button style="min-width: 10ch" preset="" onClick={closeModal}>Cancel</Button>
    </FlowItems>
  </StandardModalFooter>
</Modal>
