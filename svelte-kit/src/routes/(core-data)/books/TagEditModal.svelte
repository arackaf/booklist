<script lang="ts">
  import type { Color, Tag } from "$data/types";

  import Button from "$lib/components/buttons/Button.svelte";
  import Modal from "$lib/components/ui/Modal.svelte";

  import EditTag from "$lib/components/subjectsAndTags/tags/EditTag.svelte";
  import SelectAvailableTags from "$lib/components/subjectsAndTags/tags/SelectAvailableTags.svelte";

  export let isOpen = false;
  export let onHide = () => {};

  export let colors: Color[];
  export let tags: Tag[];

  let editingTag: Tag | null = null;

  const createNewTag = () => ({ id: 0, name: "", backgroundColor: "#847E71", textColor: "#ffffff" });

  const cancelEdit = () => (editingTag = null);
  const newTag = () => (editingTag = createNewTag());
  const editTag = (tag: Tag) => (editingTag = tag);

  let deleteShowing: boolean;
</script>

<Modal {isOpen} {onHide} headerCaption="Edit Tags" deferStateChangeOnClose={true}>
  <div class="flex flex-col gap-3">
    {#if !deleteShowing}
      <div class="flex flex-col-reverse sm:flex-row gap-5">
        <SelectAvailableTags {tags} placeholder="Edit tag" currentlySelected={[]} onSelect={item => editTag(item)} />

        <Button class="sm:ml-auto flex flex-row gap-1" onClick={newTag} preset="info-xs">
          <span>Add new tag </span>
          <i class="far fa-fw fa-plus-square" />
        </Button>
      </div>
    {/if}

    {#if editingTag}
      <EditTag {colors} bind:deleteShowing tag={editingTag} onComplete={cancelEdit} onCancelEdit={cancelEdit} />
    {/if}
  </div>
</Modal>
