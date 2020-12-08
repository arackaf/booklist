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
<ul>{#each $colorsState.colors as c}<li>{c}</li>{/each}</ul>
<ul>{#each $tagsState.tags as t}<li>{t.name}</li>{/each}</ul>

<Temp val={3} />
