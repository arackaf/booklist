<svelte:options tag="svelte-wc2"></svelte:options>

<script>
  let val = 0;
</script>

<button on:click={() => val+= 2}>Inc</button>
<h1>{val}</h1>
<button on:click={() => val-= 2}>Dec</button>