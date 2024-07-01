<script lang="ts">
  import Button from "$lib/components/Button/Button.svelte";
  import Input from "../form-elements/Input/Input.svelte";
  import InputGroup from "../form-elements/Input/InputGroup.svelte";

  export let book: any;

  const updateBook = (updates: any) => {
    book = { ...book, ...updates };
  };

  const addAuthor = () => {
    updateBook({ authors: [...book.authors, ""] });
  };
</script>

{#each book.authors || [] as author, index (index)}
  <Input name="authors" bind:value={author} placeholder={`Author ${index + 1}`} />
{/each}

<div class="sm:col-span-2">
  <button type="button" on:click={addAuthor}><i class="far fa-fw fa-plus"></i>Add author</button>
</div>
