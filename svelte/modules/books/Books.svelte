<script lang="ts">
  import colorsState from "app/state/colorsState";
  import { tagsState } from "app/state/tagsState";

  import Temp from "./Temp.svelte";

  let o = {
    foo() {
      console.log("foo");
    },
  };

  o?.foo();
</script>

<h1>Books</h1>

<h2>{$colorsState.loaded}</h2>
<h2>{$colorsState.colors}</h2>
<h2>{$tagsState.tags}</h2>

<Temp val={3} />
