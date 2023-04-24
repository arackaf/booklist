<script lang="ts">
  import BookDisplay from "./BookDisplay.svelte";
  import SimilarBooks from "./SimilarBooks.svelte";

  export let data;

  $: ({ books } = data);
</script>

<section>
  <div class="list">
    {#each books as book}
      <div class="entry">
        <BookDisplay {book} />
        <div class="similar-items">
          <SimilarBooks {book} />
        </div>
      </div>
    {/each}
  </div>
</section>

<style>
  .entry {
    display: flex;
    border: 1px solid var(--neutral-border);
    border-radius: 5px;
    padding: 15px;
    gap: 10px;
    margin-bottom: 10px;
  }

  @media (max-width: 1000px) {
    .entry {
      flex-direction: column;
    }
  }

  .similar-items {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
</style>
