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

<style>
  h1 { 
    margin-bottom: 0;
  }
  h2 {
    margin: 0 0 10px 0;
  }
  .root {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    padding-left: 30px;
  }

  .root > * {
    flex: 1;
    margin-right: 30px;
    width: 700px;
    max-height: 500px;
    overflow: auto;
  }
</style>

<div>
  <h1>Books</h1>
  <br />

  <div class="root">
    <div>
      <h2>Colors</h2>
      <ul>
        {#each $colorsState.colors as c}
          <li>{c}</li>
        {/each}
      </ul>
    </div>
    <div>
      <h2>Tags</h2>
      <ul>
        {#each $tagsState.tags as t}
          <li>{t.name}</li>
        {/each}
      </ul>
    </div>
  </div>
</div>
