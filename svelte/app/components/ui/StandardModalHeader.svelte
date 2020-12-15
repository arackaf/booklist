<script>
  import { getContext } from "svelte";
  let { onClose } = getContext("svelte-helpers-modal");

  export let caption = "";
</script>

<div class="standard-modal-header">
  <h4 class="modal-title">{caption}</h4>
  <span style="margin-left: auto" class="close" on:click={onClose}> <span>&times;</span> </span>
</div>
<hr />
