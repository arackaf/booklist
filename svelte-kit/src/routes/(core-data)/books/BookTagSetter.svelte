<script lang="ts">
  import { page } from "$app/stores";
  import { enhance } from "$app/forms";
  import { invalidate } from "$app/navigation";

  import type { Book, Tag } from "$data/types";

  import SelectAvailableTags from "$lib/components/subjectsAndTags/tags/SelectAvailableTags.svelte";
  import DisplaySelectedTags from "$lib/components/subjectsAndTags/tags/DisplaySelectedTags.svelte";

  import Modal from "$lib/components/Modal.svelte";
  import StandardModalFooter from "$lib/components/StandardModalFooter.svelte";
  import Button from "$lib/components/Button/Button.svelte";
  import ActionButton from "$lib/components/Button/ActionButton.svelte";

  import { Tabs, TabHeaders, TabHeader, TabContents, TabContent } from "$lib/components/layout/tabs/index";

  import type { UpdatesTo } from "$lib/state/dataUpdates";
  import SelectAndDisplayContainer from "$lib/components/subjectsAndTags/SelectAndDisplayContainer.svelte";

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
      window.dispatchEvent(new CustomEvent("reload-user-summary"));
      onHide();
    };
  };

  const addingTagSet = (adding: boolean, { id }: Tag) => (addingTags = adding ? addingTags.concat(id) : addingTags.filter(x => x != id));
  const tagSelectedToAdd = addingTagSet.bind(null, true);

  const removingTagSet = (adding: boolean, { id }: Tag) => (removingTags = adding ? removingTags.concat(id) : removingTags.filter(x => x != id));
  const tagSelectedToRemove = removingTagSet.bind(null, true);

  const dontAddTag = addingTagSet.bind(null, false);
  const dontRemoveTag = removingTagSet.bind(null, false);
</script>

<Modal {isOpen} {onHide} headerCaption="Add / Remove Tags" standardFooter={false}>
  <form method="post" action="?/setBooksTags" use:enhance={save}>
    <Tabs currentTab="tags">
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
          <div class="flex flex-col gap-4 pt-3">
            <SelectAndDisplayContainer>
              <SelectAvailableTags slot="select" {tags} placeholder="Adding" currentlySelected={addingTags} onSelect={tagSelectedToAdd} />
              <DisplaySelectedTags slot="display" {tags} currentlySelected={addingTags} onRemove={dontAddTag} />
            </SelectAndDisplayContainer>

            <SelectAndDisplayContainer>
              <SelectAvailableTags slot="select" {tags} placeholder="Removing" currentlySelected={removingTags} onSelect={tagSelectedToRemove} />
              <DisplaySelectedTags slot="display" {tags} currentlySelected={removingTags} onRemove={dontRemoveTag} />
            </SelectAndDisplayContainer>

            <div>
              <Button size="sm" type="button" onclick={resetTags}>Reset tags</Button>
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
