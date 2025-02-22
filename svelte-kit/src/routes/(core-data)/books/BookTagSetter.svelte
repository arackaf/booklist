<script lang="ts">
  import { page } from "$app/stores";
  import { enhance } from "$app/forms";

  import type { Book, Tag } from "$data/types";
  import type { UpdatesTo } from "$lib/state/dataUpdates";

  import * as Tabs from "$lib/components/ui/tabs";

  import SelectAvailableTags from "$lib/components/subjectsAndTags/tags/SelectAvailableTags.svelte";
  import DisplaySelectedTags from "$lib/components/subjectsAndTags/tags/DisplaySelectedTags.svelte";
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
  let { tags } = $derived($page.data);

  let addingTags = $state<number[]>([]);
  let removingTags = $state<number[]>([]);
  let saving = $state(false);

  const resetTags = () => {
    addingTags = [];
    removingTags = [];
  };

  $effect(() => {
    if (isOpen) {
      resetTags();
    }
  });

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
    <Tabs.Root value="tags" class="">
      <Tabs.List class="w-full grid grid-cols-2 gap-2">
        <Tabs.Trigger value="tags">Choose tags</Tabs.Trigger>
        <Tabs.Trigger value="books">For books</Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="tags">
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
            <Button size="sm" type="button" onclick={resetTags}>Reset tags</Button>
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
