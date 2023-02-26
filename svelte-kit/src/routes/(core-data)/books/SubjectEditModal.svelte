<script lang="ts">
  import Button from "$lib/components/buttons/Button.svelte";
  import Modal from "$lib/components/ui/Modal.svelte";

  import EditSubject from "$lib/components/subjectsAndTags/subjects/EditSubject.svelte";
  import FlowItems from "$lib/components/layout/FlowItems.svelte";
  import Stack from "$lib/components/layout/Stack.svelte";
  import SelectAvailableSubjects from "$lib/components/subjectsAndTags/subjects/SelectAvailableSubjects.svelte";
  import type { Color, Subject } from "$data/types";

  export let isOpen = false;
  export let onHide = () => {};

  export let colors: Color[];
  export let subjects: Subject[];

  const emptySubject = {
    id: "",
    name: "",
    textColor: "",
    backgroundColor: "",
    path: ""
  };

  let editingSubject: Subject | null = null;

  const cancelEdit = () => (editingSubject = null);
  const newSubject = () => (editingSubject = emptySubject);
  const editSubject = (subject: Subject) => (editingSubject = subject);

  let deleteShowing: boolean = false;

  $: {
    if (isOpen) {
      cancelEdit();
    }
  }
</script>

<Modal {isOpen} {onHide} headerCaption="Edit Subjects">
  <Stack>
    {#if !deleteShowing}
      <FlowItems pushLast={true} xsFlowReverse={true}>
        <SelectAvailableSubjects {subjects} placeholder="Edit subject" currentlySelected={[]} onSelect={item => editSubject(item)} />

        <Button onClick={newSubject} preset="info-xs">
          <span>Add new subject </span>
          <i class="far fa-fw fa-plus-square" />
        </Button>
      </FlowItems>
    {/if}

    {#if editingSubject}
      <EditSubject {colors} allSubjects={subjects} bind:deleteShowing subject={editingSubject} onComplete={cancelEdit} onCancelEdit={cancelEdit} />
    {/if}
  </Stack>
</Modal>
