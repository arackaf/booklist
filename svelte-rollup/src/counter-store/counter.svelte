<script>
  import { writable } from "svelte/store";

  export let initial = 1;

  let store = writable(initial);

  const increment = () => store.set($store + 1);
  const decrement = () => store.set($store - 1);
</script>

<h1>Value {$store}</h1>
<button on:click={increment}>Inc</button>
<button on:click={decrement}>Dec</button>
