<script lang="ts">
  import { get } from "svelte/store";
  import colorsState from "app/state/colorsState";
  import { searchBooks } from "./booksState";
  import { tagsState } from "app/state/tagsState";
  import { subjectsState, stackedSubjects, rootSubjects, allSubjects } from "app/state/subjectsState";

  import { quickSearch } from "./setBookFilters";

  let quickSearchEl;

  let booksState = searchBooks();
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
    width: 1300px;
    max-height: 500px;
    overflow: auto;
    border: 1px solid cadetblue;
    padding: 10px;
  }

  .root h2 {
    border-bottom: 1px solid cadetblue;
    font-size: 14px;
  }
</style>

<div>
  <h1>Books</h1>
  <br />
  <br />
  <ul>
    {#each $booksState.books as b}
      <li>{b.title}</li>
    {/each}
  </ul>

  <input bind:this={quickSearchEl} />
  <button on:click={() => quickSearch(quickSearchEl.value)}>Go</button>

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
    <div>
      <h2>All Subjects</h2>
      <ul>
        {#each $allSubjects as t}
          <li>{t.name}</li>
        {/each}
      </ul>
    </div>
    <div>
      <h2>All Subjects Sorted</h2>
      <ul>
        {#each $stackedSubjects.allSubjectsSorted as t}
          <li>{t.name}</li>
        {/each}
      </ul>
    </div>
    <div>
      <h2>Stacked Subjects</h2>
      <ul>
        {#each $stackedSubjects.subjects as t}
          <li>{t.name} - {t.children.length}</li>
        {/each}
      </ul>
    </div>
    <div>
      <h2>Root Subjects</h2>
      <ul>
        {#each $rootSubjects as t}
          <li>{t.name}</li>
        {/each}
      </ul>
    </div>
  </div>
</div>
