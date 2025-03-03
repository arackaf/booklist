<script lang="ts">
  import type { Color, Subject } from "$data/types";
  import Button from "$lib/components/ui/button/button.svelte";
  import EditSubject from "$lib/components/subjectsAndTags/subjects/EditSubject.svelte";
  import SelectAvailableSubjects from "$lib/components/subjectsAndTags/subjects/SelectAvailableSubjects.svelte";

  type Props = {
    colors: Color[];
    subjects: Subject[];
  };

  let { colors, subjects }: Props = $props();

  const emptySubject = {
    id: 0,
    name: "",
    backgroundColor: "#847E71",
    textColor: "#ffffff",
    path: ""
  };

  let editingSubject = $state<Subject | null>(null);
  let deleteShowing = $state(false);

  const cancelEdit = () => {
    editingSubject = null;
    deleteShowing = false;
  };

  const newSubject = () => (editingSubject = emptySubject);
  const editSubject = (subject: Subject) => (editingSubject = subject);
</script>

<div class="flex flex-col gap-3">
  {#if !deleteShowing}
    <div class="flex flex-col-reverse sm:flex-row gap-5">
      <SelectAvailableSubjects {subjects} placeholder="Edit subject" currentlySelected={[]} onSelect={item => editSubject(item)} />

      <Button size="sm" variant="outline" class="flex flex-row gap-1 items-center self-start sm:ml-auto" onclick={newSubject}>
        <span>New subject </span>
      </Button>
    </div>
  {/if}

  {#if editingSubject}
    <EditSubject {colors} bind:deleteShowing allSubjects={subjects} subject={editingSubject} onComplete={cancelEdit} onCancelEdit={cancelEdit} />
  {/if}
</div>
