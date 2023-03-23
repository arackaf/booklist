<script lang="ts">
  import type { Subject } from "$data/types";

  import { setContext } from "svelte";
  import { writable } from "svelte/store";
  import { flip } from "svelte/animate";
  import { quadIn } from "svelte/easing";
  import { scale } from "svelte/transition";

  import Button from "$lib/components/buttons/Button.svelte";
  import EditSubject from "$lib/components/subjectsAndTags/subjects/EditSubject.svelte";
  import Modal from "$lib/components/ui/Modal.svelte";
  import { stackAndGetTopLevelSubjects } from "$lib/state/subjectsState";

  import SubjectDisplay from "./SubjectDisplay.svelte";
  import { exitStart, scaleTransitionProps } from "./animationHelpers";

  export let data;

  $: ({ subjects, colors } = data);
  $: rootSubjects = stackAndGetTopLevelSubjects(subjects);

  let editModalOpen = false;
  let editingSubject: Subject = { id: 0, name: "", backgroundColor: "", textColor: "", path: null };
  const closeEditModal = () => (editModalOpen = false);
  const editSubject = (subject: any) => {
    editingSubject = subject;
    editModalOpen = true;
  };

  const newSubject = () => ({ id: 0, name: "", backgroundColor: "#847E71", textColor: "#ffffff" });

  let resetEditSubject: () => void;

  setContext("subject-chain-disable-animation", writable(false));
</script>

<section class="flush-bottom subjectsRoot">
  <div>
    <Button class="margin-bottom" preset="primary" onClick={() => editSubject(newSubject())}>New Subject</Button>
  </div>

  <div class="contentRoot">
    <ul>
      {#each rootSubjects as s (s.id)}
        <li on:outrostart={exitStart} animate:flip={{ duration: 150, easing: quadIn }} transition:scale|local={scaleTransitionProps}>
          <SubjectDisplay subject={s} {editSubject} />
        </li>
      {/each}
    </ul>
  </div>

  <Modal
    isOpen={editModalOpen}
    on:mount={resetEditSubject}
    onHide={() => (editModalOpen = false)}
    headerCaption={"Edit Subject"}
    standardFooter={false}
  >
    <EditSubject
      bind:reset={resetEditSubject}
      allSubjects={subjects}
      {colors}
      subject={editingSubject}
      onComplete={closeEditModal}
      onCancelEdit={closeEditModal}
    />
    <hr />
    <Button onClick={closeEditModal}>Close</Button>
  </Modal>
</section>

<style>
  ul {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

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
