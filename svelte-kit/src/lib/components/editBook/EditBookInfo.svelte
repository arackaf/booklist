<script lang="ts">
  export let book: any;

  const updateBook = (updates: any) => {
    book = { ...book, ...updates };
  };

  const addAuthor = () => {
    updateBook({ authors: [...book.authors, ""] });
  };
</script>

{#each book.authors || [] as author, index (index)}
  <input name="authors" bind:value={author} placeholder={`Author ${index + 1}`} />
{/each}

<button type="button" on:click={addAuthor}><i class="far fa-fw fa-plus"></i>Add author</button>
