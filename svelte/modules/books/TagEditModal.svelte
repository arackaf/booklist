<script lang="ts">
  import Button from "app/components/buttons/Button.svelte";
  import Modal from "app/components/ui/Modal.svelte";

  import EditTag from "app/components/subjectsAndTags/tags/EditTag.svelte";
  import FlowItems from "app/components/layout/FlowItems.svelte";
  import Stack from "app/components/layout/Stack.svelte";
  import SelectAvailableTags from "app/components/subjectsAndTags/tags/SelectAvailableTags.svelte";

  export let isOpen = false;
  export let onHide = () => {};

  interface ILocalProps {
    editModalOpen: boolean;
    stopEditing: any;
  }
  let editingTag = null;

  const cancelEdit = () => (editingTag = null);
  const newTag = () => (editingTag = { name: "" });
  const editTag = tag => (editingTag = tag);

  let deleteShowing;
</script>

<Modal {isOpen} {onHide} headerCaption="Edit Tags" deferStateChangeOnClose={true}>
  <Stack>
    {#if !deleteShowing}
      <FlowItems pushLast={true} xsFlowReverse={true}>
        <SelectAvailableTags placeholder="Edit tag" currentlySelected={[]} onSelect={item => editTag(item)} />

        <Button onClick={newTag} preset="info-xs">
          <span class="visible-xs">Add new tag </span>
          <i class="far fa-fw fa-plus-square" />
        </Button>
      </FlowItems>
    {/if}

    {#if editingTag}
      <EditTag bind:deleteShowing tag={editingTag} onCancelEdit={cancelEdit} />
    {/if}
  </Stack>
</Modal>
