<script>
  import { getContext } from "svelte";
  let { closeModal } = getContext("svelte-helpers-modal");

  export let caption = "";
  export let noClose = false;
  export let smaller = false;
</script>

<div class="flex items-center">
  <h1 class:text-base={smaller} class:text-xl={!smaller} class="modal-title text-base">{caption}</h1>

  {#if !noClose}
    <!-- TODO: -->
    <button style="margin-left: auto; display: flex;" class="close raw-button text-lg font-bold" on:click={closeModal}>
      <i class="far fa-times" />
    </button>
  {/if}
</div>
<hr class="my-3" />
