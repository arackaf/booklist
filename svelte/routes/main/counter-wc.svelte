<svelte:options tag="wc-counter" />

<script>
  export let value;
</script>

<style>
  .value {
    color: blue;
  }
</style>

<button on:click={() => value++}>Inc</button>
Value is: <span class="value">{value}</span>
<button on:click={() => value--}>Dec</button>


