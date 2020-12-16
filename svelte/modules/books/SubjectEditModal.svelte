<script lang="ts">
  import Button from "app/components/buttons/Button.svelte";
  import Modal from "app/components/ui/Modal.svelte";

  import EditSubject from "app/components/subjectsAndTags/subjects/EditSubject.svelte";
  import FlowItems from "app/components/layout/FlowItems.svelte";
  import Stack from "app/components/layout/Stack.svelte";
  import SelectAvailableSubjects from "app/components/subjectsAndTags/subjects/SelectAvailableSubjects.svelte";

  export let isOpen = false;
  export let onHide = () => {};

  interface ILocalProps {
    editModalOpen: boolean;
    stopEditing: any;
  }
  let editingSubject = null;

  const cancelEdit = () => (editingSubject = null);
  const newSubject = () => (editingSubject = { name: "" });
  const editSubject = subject => (editingSubject = subject);

  let deleteShowing;
</script>

<Modal {isOpen} {onHide} headerCaption="Edit Subjects" deferStateChangeOnClose={true}>
  <Stack>
    {#if !deleteShowing}
      <FlowItems pushLast={true} xsFlowReverse={true}>
        <SelectAvailableSubjects placeholder="Edit subject" currentlySelected={[]} onSelect={item => editSubject(item)} />

        <Button onClick={newSubject} preset="info-xs">
          <span className="visible-xs">Add new subject </span>
          <i className="fa fa-fw fa-plus-square" />
        </Button>
      </FlowItems>
    {/if}

    {#if editingSubject}
      <EditSubject bind:deleteShowing subject={editingSubject} onCancelEdit={cancelEdit} />
    {/if}
    <hr />
  </Stack>
  <Button onClick={onHide}>Close</Button>
</Modal>
