<script>
  import { getContext } from "svelte";
  let { closeModal } = getContext("svelte-helpers-modal");

  export let caption = "";
  export let noClose = false;
  export let smaller = false;
</script>

<div class="standard-modal-header">
  {#if smaller}
    <h5 class="modal-title">{caption}</h5>
  {:else}
    <h4 class="modal-title">{caption}</h4>
  {/if}
  {#if !noClose}
    <span style="margin-left: auto" class="close" on:click={closeModal}> <span>&times;</span> </span>
  {/if}
</div>
<hr />
