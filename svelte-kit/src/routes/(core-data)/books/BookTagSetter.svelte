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
  export let onSave: (id: number | number[], updates: UpdatesTo<Book>) => void;
  export let onHide: () => void;

  let addingTags: number[] = [];
  let removingTags: number[] = [];

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
    return async () => {
      onSave(
        modifyingBooks.map(b => b.id),
        updates
      );
      saving = false;
      onHide();
    };
  };

  const addingTagSet = (adding: boolean, { id }: Tag) => (addingTags = adding ? addingTags.concat(id) : addingTags.filter(x => x != id));
  const tagSelectedToAdd = addingTagSet.bind(null, true);

  const removingTagSet = (adding: boolean, { id }: Tag) => (removingTags = adding ? removingTags.concat(id) : removingTags.filter(x => x != id));
  const tagSelectedToRemove = removingTagSet.bind(null, true);

  const dontAddTag = addingTagSet.bind(null, false);
  const dontRemoveTag = removingTagSet.bind(null, false);

  let closeModal: () => void;
</script>

<Modal {isOpen} {onHide} headerCaption="Add / Remove Tags" deferStateChangeOnClose={true} standardFooter={false}>
  <form method="post" action="?/setBooksTags" use:enhance={save}>
    <Tabs defaultTab="tags">
      <TabHeaders>
        <TabHeader tabName="tags">Choose tags</TabHeader>
        <TabHeader tabName="books">For books</TabHeader>
      </TabHeaders>
      <TabContents>
        <TabContent tabName="tags">
          {#each modifyingBooks as b}
            <input type="hidden" name="ids" value={b.id} />
          {/each}
          {#each addingTags as t}
            <input type="hidden" name="add" value={t} />
          {/each}
          {#each removingTags as t}
            <input type="hidden" name="remove" value={t} />
          {/each}
          <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <SelectAvailableTags {tags} placeholder="Adding" currentlySelected={addingTags} onSelect={tagSelectedToAdd} />
            </div>
            <div class="md:col-span-3 flex items-center">
              <DisplaySelectedTags {tags} currentlySelected={addingTags} onRemove={dontAddTag} />
            </div>

            <div>
              <SelectAvailableTags {tags} placeholder="Removing" currentlySelected={removingTags} onSelect={tagSelectedToRemove} />
            </div>
            <div class="md:col-span-3 flex items-center">
              <DisplaySelectedTags {tags} currentlySelected={removingTags} onRemove={dontRemoveTag} />
            </div>

            <div class="md:col-span-4">
              <Button type="button" onClick={resetTags} preset="default-xs">Reset tags</Button>
            </div>
          </div>
        </TabContent>
        <TabContent tabName="books">
          <Stack style="font-size: 14px">
            {#each modifyingBooks as book (book.id)}
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
