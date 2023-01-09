<script lang="ts">
  import { setContext } from "svelte";
  import { writable } from "svelte/store";

  import Button from "$lib/components/buttons/Button.svelte";
  //import EditSubject from "$lib/components/subjectsAndTags/subjects/EditSubject.svelte";
  import Modal from "$lib/components/ui/Modal.svelte";
  import { stackAndGetTopLevelSubjects } from "$lib/state/subjectsState";
  //import { rootSubjects } from "app/state/subjectsState";

  import SubjectDisplay from "./SubjectDisplay.svelte";

  export let data: any;
  $: ({ subjects } = data);

  $: rootSubjects = stackAndGetTopLevelSubjects(subjects);

  $: {
    console.log({ data });
  }

  let editModalOpen = false;
  let editingSubject = { name: "" };
  const closeEditModal = () => (editModalOpen = false);
  const editSubject = (subject: any) => {
    editingSubject = subject;
    editModalOpen = true;
  };

  setContext("subject-chain-disable-animation", writable(false));
</script>

<section class="flush-bottom subjectsRoot">
  <div>
    <Button class="margin-bottom" preset="primary" onClick={() => editSubject({ name: "" })}>New Subject</Button>
  </div>

  <div class="contentRoot">
    <ul>
      {#each rootSubjects as s (s._id)}
        <SubjectDisplay subject={s} {editSubject} />
      {/each}
    </ul>
  </div>

  <Modal isOpen={editModalOpen} onHide={() => (editModalOpen = false)} headerCaption={"Edit Subject"} standardFooter={false}>
    <!-- <EditSubject subject={editingSubject} onCancelEdit={closeEditModal} /> -->
    <hr />
    <Button onClick={closeEditModal}>Close</Button>
  </Modal>
</section>

<style>
  .subjectsRoot {
    display: grid;
    grid-template-rows: auto 1fr;
  }

  .subjectsRoot :global(ul) {
    margin-left: 0;
    padding-left: 0;
  }

  .subjectsRoot :global(ul ul) {
    margin-left: 20px;
  }

  .contentRoot {
    padding-left: 30px;
    border-left: 2px solid var(--primary-4);
  }
  @media (max-width: 1000px) {
    .contentRoot {
      margin-left: 10px;
      padding-left: 10px;
    }
  }
</style>
