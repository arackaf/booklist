<script lang="ts">
  import Temp from "./Temp.svelte";

  let o = {
    foo() {
      console.log("foo");
    }
  };

  o?.foo();
</script>

<h1>Books</h1>

<Temp val={3} />