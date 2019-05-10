<script>
  export let initial = 1;

  const increment = () => initial++;
  const decrement = () => initial--;
</script>

<h1>Value {initial}</h1>
<button on:click={increment}>Inc</button>
<button on:click={decrement}>Dec</button>
