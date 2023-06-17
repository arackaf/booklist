<script lang="ts">
  import BookDisplay from "./BookDisplay.svelte";
  import SimilarBooks from "./SimilarBooks.svelte";

  export let data;

  $: ({ books } = data);
</script>

<section>
  <div class="list">
    {#each books as book}
      <div class="flex flex-col lg:flex-row gap-3 mb-3 p-4 rounded border border-neutral-400">
        <BookDisplay {book} />
        <div class="flex-1 flex flex-col overflow-hidden">
          <SimilarBooks {book} />
        </div>
      </div>
    {/each}
  </div>
</section>
