<script lang="ts">
  import type { Subject } from "$data/types";

  import Button from "$lib/components/Button/Button.svelte";
  import EditSubject from "$lib/components/subjectsAndTags/subjects/EditSubject.svelte";
  import Modal from "$lib/components/Modal.svelte";
  import { stackAndGetTopLevelSubjects } from "$lib/state/subjectsState";

  import SubjectDisplay from "./SubjectDisplay.svelte";

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

<section class="flush-bottom grid grid-rows-[auto_1fr]">
  <div>
    <Button class="mb-4" theme="primary" onclick={() => editSubject(newSubject())}>New Subject</Button>
  </div>

  <div class="border-l-2 border-l-primary-4 pl-3 lg:pl-7">
    <ul>
      {#each rootSubjects as s (s.id)}
        <li>
          <SubjectDisplay subject={s} {editSubject} />
        </li>
      {/each}
    </ul>
  </div>

  <Modal openFocus={inputEl} isOpen={editModalOpen} onHide={() => (editModalOpen = false)} headerCaption={"Edit Subject"} standardFooter={false}>
    <EditSubject allSubjects={subjects} {colors} subject={editingSubject} onComplete={closeEditModal} onCancelEdit={closeEditModal} />
    <hr class="my-3" />
    <Button onclick={closeEditModal}>Close</Button>
  </Modal>
</section>
