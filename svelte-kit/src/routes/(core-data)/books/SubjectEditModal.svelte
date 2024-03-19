<script lang="ts">
  import Modal from "$lib/components/Modal.svelte";

  import type { Color, Subject } from "$data/types";
  import SubjectEditModalContents from "./SubjectEditModalContents.svelte";

  export let isOpen = false;
  export let onHide = () => {};

  export let colors: Color[];
  export let subjects: Subject[];
</script>

<Modal {isOpen} {onHide} headerCaption="Edit Subjects">
  <SubjectEditModalContents {colors} {subjects} />
</Modal>
