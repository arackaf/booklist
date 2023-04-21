<script lang="ts">
  import { page } from "$app/stores";
  import BookCover from "$lib/components/ui/BookCover.svelte";

  export let data;

  $: ({ books } = data);
</script>

<section>
  <div class="list">
    {#each books as b}
      <div class="entry">
        <BookCover size="small" book={b} preview={b.smallImagePreview} />
        <div class="book-info">
          <span class="book-title">{b.title}</span>
          <span>{b.authors}</span>
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
  }

  .book-info {
    display: flex;
    flex-direction: column;
    margin-left: 5px;
  }
</style>
