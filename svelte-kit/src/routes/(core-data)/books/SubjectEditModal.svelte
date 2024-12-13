<script lang="ts">
  import Modal from "$lib/components/Modal.svelte";
  import type { Color, Subject } from "$data/types";
  import SubjectEditModalContents from "./SubjectEditModalContents.svelte";

  type Props = {
    isOpen: boolean;
    onHide: () => void;
    colors: Color[];
    subjects: Subject[];
  };

  let { isOpen = false, onHide = () => {}, colors, subjects }: Props = $props();
</script>

<Modal {isOpen} {onHide} headerCaption="Edit Subjects">
  <SubjectEditModalContents {colors} {subjects} />
</Modal>
