<script lang="ts">
import Modal from "../ui/Modal.svelte";
import EditBookInfo from "./EditBookInfo.svelte";

export let book;
export let isOpen = false;
export let onHide;
  
</script>

<Modal headerCaption={`Edit: ${book.title}`} deferStateChangeOnClose={true} {isOpen} {onHide} standardFooter={false}>
  <EditBookInfo {book} />
</Modal>