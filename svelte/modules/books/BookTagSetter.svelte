<script lang="ts">
  import { mutation } from "micro-graphql-svelte";
  import { MutationOf, Mutations } from "graphql-typings";

  import updateBookTags from "graphQL/books/updateBookTags.graphql";
  
  import SelectAvailableTags from "app/components/subjectsAndTags/tags/SelectAvailableTags.svelte";
  import DisplaySelectedTags from "app/components/subjectsAndTags/tags/DisplaySelectedTags.svelte";
  
  import Modal from "app/components/ui/Modal.svelte";
  import StandardModalFooter from "app/components/ui/StandardModalFooter.svelte";
  import Button from "app/components/buttons/Button.svelte";
  import ActionButton from "app/components/buttons/ActionButton.svelte";
  import Tabs from "app/components/layout/tabs/Tabs.svelte";
  import TabHeaders from "app/components/layout/tabs/TabHeaders.svelte";
  import TabHeader from "app/components/layout/tabs/TabHeader.svelte";
  import TabContents from "app/components/layout/tabs/TabContents.svelte";
  import TabContent from "app/components/layout/tabs/TabContent.svelte";

  import FlexRow from "app/components/layout/FlexRow.svelte";
  import Stack from "app/components/layout/Stack.svelte";
  import FlowItems from "app/components/layout/FlowItems.svelte";

  export let modifyingBooks: any[];
  export let isOpen;
  export let onHide;

  interface ILocalProps {
    modifyingBooks: any[];
    onDone: any;
  }

  let addingTags = [];
  let removingTags = [];

  const resetTags = () => {
    addingTags = [];
    removingTags = [];
  };

  const { mutationState } = mutation<MutationOf<Mutations["updateBooks"]>>(updateBookTags);
  $: ({ runMutation, running } = $mutationState);

  const save = () => {
    let args = { books: modifyingBooks.map(b => b._id), add: addingTags, remove: removingTags };
    return Promise.resolve(runMutation(args)).then(() => {
      onHide();
    });
  };
  const addingTagSet = (adding, { _id }) => (addingTags = adding ? addingTags.concat(_id) : addingTags.filter(x => x != _id));
  const tagSelectedToAdd = addingTagSet.bind(null, true);

  const removingTagSet = (adding, { _id }) => (removingTags = adding ? removingTags.concat(_id) : removingTags.filter(x => x != _id));
  const tagSelectedToRemove = removingTagSet.bind(null, true);

  const dontAddTag = addingTagSet.bind(null, false);
  const dontRemoveTag = removingTagSet.bind(null, false);

  let closeModal;
</script>

<Modal {isOpen} {onHide} headerCaption="Add / Remove Tags" deferStateChangeOnClose={true} standardFooter={false}>
  <Tabs defaultTab="tags">
    <TabHeaders>
      <TabHeader tabName="tags"><a>Choose tags</a></TabHeader>
      <TabHeader tabName="books"><a>For books</a></TabHeader>
    </TabHeaders>
    <TabContents>
      <TabContent tabName="tags">
        <FlexRow>
          <div class="col-xs-3">
            <SelectAvailableTags placeholder="Adding" currentlySelected={addingTags} onSelect={tagSelectedToAdd} />
          </div>
          <div class="col-xs-9" style="display: flex; flex-wrap: wrap">
            <DisplaySelectedTags currentlySelected={addingTags} onRemove={dontAddTag} />
          </div>

          <div class="col-xs-3">
            <SelectAvailableTags placeholder="Removing" currentlySelected={removingTags} onSelect={tagSelectedToRemove} />
          </div>
          <div class="col-xs-9" style="display: flex; flex-wrap: wrap">
            <DisplaySelectedTags currentlySelected={removingTags} onRemove={dontRemoveTag} />
          </div>

          <div class="col-xs-12">
            <Button onClick={resetTags} preset="default-xs">Reset tags</Button>
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
