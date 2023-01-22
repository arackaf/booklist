<script lang="ts">
  import { page } from "$app/stores";
  import { enhance } from "$app/forms";
  import type { Book, Tag } from "$data/types";

  import SelectAvailableTags from "$lib/components/subjectsAndTags/tags/SelectAvailableTags.svelte";
  import DisplaySelectedTags from "$lib/components/subjectsAndTags/tags/DisplaySelectedTags.svelte";

  import Modal from "$lib/components/ui/Modal.svelte";
  import StandardModalFooter from "$lib/components/ui/StandardModalFooter.svelte";
  import Button from "$lib/components/buttons/Button.svelte";
  import ActionButton from "$lib/components/buttons/ActionButton.svelte";

  import { Tabs, TabHeaders, TabHeader, TabContents, TabContent } from "$lib/components/layout/tabs/index";

  import FlexRow from "$lib/components/layout/FlexRow.svelte";
  import Stack from "$lib/components/layout/Stack.svelte";
  import FlowItems from "$lib/components/layout/FlowItems.svelte";
  import type { UpdatesTo } from "$lib/state/dataUpdates";

  $: tags = $page.data.tags;
  export let modifyingBooks: any[];
  export let isOpen: boolean;
  export let onSave: (_id: string | string[], updates: UpdatesTo<Book>) => void;
  export let onHide: () => void;

  let addingTags: string[] = [];
  let removingTags: string[] = [];

  const resetTags = () => {
    addingTags = [];
    removingTags = [];
  };

  $: {
    if (isOpen) {
      resetTags();
    }
  }

  let saving = false;
  const save = () => {
    saving = true;
    const updates = {
      arraySync: {
        tags: {
          push: addingTags,
          pull: removingTags
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

  const addingTagSet = (adding: boolean, { _id }: Tag) => (addingTags = adding ? addingTags.concat(_id) : addingTags.filter(x => x != _id));
  const tagSelectedToAdd = addingTagSet.bind(null, true);

  const removingTagSet = (adding: boolean, { _id }: Tag) => (removingTags = adding ? removingTags.concat(_id) : removingTags.filter(x => x != _id));
  const tagSelectedToRemove = removingTagSet.bind(null, true);

  const dontAddTag = addingTagSet.bind(null, false);
  const dontRemoveTag = removingTagSet.bind(null, false);

  let closeModal: () => void;
</script>

<Modal {isOpen} {onHide} headerCaption="Add / Remove Tags" deferStateChangeOnClose={true} standardFooter={false}>
  <form method="post" action="?/setBooksTags" use:enhance={save}>
    <Tabs defaultTab="tags">
      <TabHeaders>
        <TabHeader tabName="tags" text="Choose tags" />
        <TabHeader tabName="books" text="For books" />
      </TabHeaders>
      <TabContents>
        <TabContent tabName="tags">
          {#each modifyingBooks as b}
            <input type="hidden" name="_ids" value={b._id} />
          {/each}
          {#each addingTags as t}
            <input type="hidden" name="add" value={t} />
          {/each}
          {#each removingTags as t}
            <input type="hidden" name="remove" value={t} />
          {/each}
          <FlexRow>
            <div class="col-xs-3">
              <SelectAvailableTags {tags} placeholder="Adding" currentlySelected={addingTags} onSelect={tagSelectedToAdd} />
            </div>
            <div class="col-xs-9" style="display: flex; flex-wrap: wrap">
              <DisplaySelectedTags {tags} currentlySelected={addingTags} onRemove={dontAddTag} />
            </div>

            <div class="col-xs-3">
              <SelectAvailableTags {tags} placeholder="Removing" currentlySelected={removingTags} onSelect={tagSelectedToRemove} />
            </div>
            <div class="col-xs-9" style="display: flex; flex-wrap: wrap">
              <DisplaySelectedTags {tags} currentlySelected={removingTags} onRemove={dontRemoveTag} />
            </div>

            <div class="col-xs-12">
              <Button type="button" onClick={resetTags} preset="default-xs">Reset tags</Button>
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

        <Button style="min-width: 10ch" preset="" onClick={closeModal}>Cancel</Button>
      </FlowItems>
    </StandardModalFooter>
  </form>
</Modal>
