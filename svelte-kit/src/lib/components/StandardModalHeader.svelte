<script>
  export let caption = "";
  export let smaller = false;
  export let onHide = () => {};
</script>

<div class="flex items-center">
  <h1 class:text-base={smaller} class:text-xl={!smaller} class="font-normal">{caption}</h1>

  <!-- TODO: -->
  <button style="margin-left: auto; display: flex;" class="close raw-button text-lg font-bold" on:click={onHide}>
    <i class="far fa-times"></i>
  </button>
</div>
<hr class="my-3" />
