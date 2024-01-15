<script>
  export let caption = "";
  export let smaller = false;
  export let onHide = () => {};
</script>

<div class="flex items-center">
  <h1 class:text-base={smaller} class:text-xl={!smaller} class="modal-title text-base">{caption}</h1>

  <!-- TODO: -->
  <button style="margin-left: auto; display: flex;" class="close raw-button text-lg font-bold" on:click={onHide}>
    <i class="far fa-times" />
  </button>
</div>
<hr class="my-3" />
