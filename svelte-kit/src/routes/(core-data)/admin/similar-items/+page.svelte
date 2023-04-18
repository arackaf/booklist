<script lang="ts">
  import { page } from "$app/stores";
  import BookCover from "$lib/components/ui/BookCover.svelte";

  export let data;

  $: ({ books } = data);
</script>

<section>
  <div class="list">
    {#each books as b}
      <div class="book">
        <BookCover size="small" book={b} preview={b.smallImagePreview} />
        <span>{b.title}</span>
        <span>{b.authors}</span>
      </div>
    {/each}
  </div>
</section>
