<script lang="ts">
  import type { Subject } from "$data/types";

  import EditSubject from "$lib/components/subjectsAndTags/subjects/EditSubject.svelte";
  import Modal from "$lib/components/Modal.svelte";
  import { stackAndGetTopLevelSubjects } from "$lib/state/subjectsState";

  import SubjectDisplay from "./SubjectDisplay.svelte";
  import Button from "$lib/components/ui/button/button.svelte";

  let { data } = $props();
  let { subjects, colors } = $derived(data);

  let rootSubjects = $derived(stackAndGetTopLevelSubjects(subjects));

  let editModalOpen = $state(false);
  let editingSubject = $state<Subject>({
    id: 0,
    name: "",
    backgroundColor: "",
    textColor: "",
    path: null
  });

  const closeEditModal = () => (editModalOpen = false);
  const editSubject = (subject: any) => {
    editingSubject = subject;
    editModalOpen = true;
  };

  const newSubject = () => ({
    id: 0,
    name: "",
    backgroundColor: "#847E71",
    textColor: "#ffffff"
  });

  let inputEl = $state<HTMLElement | null>(null);
</script>

<section class="flush-bottom flex flex-col gap-4">
  <div class="p-2 flex items-center sticky-content bg-white">
    <h1 class="text-lg font-bold">Edit Subjects</h1>
    <Button class="ml-auto" onclick={() => editSubject(newSubject())}>New Subject</Button>
  </div>

  <div>
    <ul>
      {#each rootSubjects as s (s.id)}
        <li>
          <SubjectDisplay subject={s} {editSubject} />
        </li>
      {/each}
    </ul>
  </div>
</section>
<Modal openFocus={inputEl} isOpen={editModalOpen} onHide={() => (editModalOpen = false)} headerCaption={"Edit Subject"} standardFooter={false}>
  <EditSubject allSubjects={subjects} {colors} subject={editingSubject} onComplete={closeEditModal} onCancelEdit={closeEditModal} />
  <hr class="my-3" />
  <Button variant="outline" onclick={closeEditModal}>Close</Button>
</Modal>
