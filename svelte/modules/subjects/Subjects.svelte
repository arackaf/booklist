<script lang="ts">
  import { setContext } from "svelte";
  import { fade } from "svelte/transition";
  import { quadIn, quadOut } from "svelte/easing";
  import { writable } from "svelte/store";
  import Button from "app/components/buttons/Button.svelte";
  import EditSubject from "app/components/subjectsAndTags/subjects/EditSubject.svelte";
  import Modal from "app/components/ui/Modal.svelte";
  import { rootSubjects } from "app/state/subjectsState";
  import SubjectList from "./SubjectList.svelte";

  let editModalOpen = false;
  let editingSubject = { name: "" };
  const closeEditModal = () => (editModalOpen = false);
  const editSubject = subject => {
    editingSubject = subject;
    editModalOpen = true;
  };

  let subjectsSettings = writable({ initialized: false, exiting: false });
  setContext("subjects-module", subjectsSettings);

  function onLoaded() {
    $subjectsSettings.initialized = true;
  }

  function outStart() {
    subjectsSettings.update(settings => ({ ...settings, exiting: true }));
  }
</script>

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

<section transition:fade={{ duration: 150, easing: quadOut }} on:outrostart={outStart} on:introend={onLoaded} class="flush-bottom subjectsRoot">
  <div>
    <Button class="margin-bottom" preset="primary" onClick={() => editSubject({ name: "" })}>New Subject</Button>
  </div>

  <div class="contentRoot">
    <SubjectList root={true} subjects={$rootSubjects} {editSubject} />
  </div>

  <Modal isOpen={editModalOpen} onHide={() => (editModalOpen = false)} headerCaption={"Edit Subject"} standardFooter={false}>
    <EditSubject subject={editingSubject} onCancelEdit={closeEditModal} />
    <hr />
    <Button onClick={closeEditModal}>Close</Button>
  </Modal>
</section>
