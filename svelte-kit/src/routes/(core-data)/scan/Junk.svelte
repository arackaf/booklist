<script lang="ts">
  import Foo from "./Foo.svelte";

  let x = $state(0);
</script>

<span>{x}</span>

<button onclick={() => x++}>Increment</button>

<Foo a={"1"} b={"4"} c={{}} />
