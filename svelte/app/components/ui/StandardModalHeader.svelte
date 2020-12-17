<script>
  import { getContext } from "svelte";
  let { closeModal } = getContext("svelte-helpers-modal");

  export let caption = "";
</script>

<div class="standard-modal-header">
  <h4 class="modal-title">{caption}</h4>
  <span style="margin-left: auto" class="close" on:click={closeModal}> <span>&times;</span> </span>
</div>
<hr />
