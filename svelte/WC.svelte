<svelte:options tag="svelte-wc"></svelte:options>

<script>
  let val = 0;

  export const foo = () => {
    console.log("FOOOO");
  }
</script>

<button on:click={() => val++}>Inc</button>
<h1>{val}</h1>
<button on:click={() => val--}>Dec</button>