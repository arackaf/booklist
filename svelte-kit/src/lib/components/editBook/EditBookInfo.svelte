<script lang="ts">
  import type { Book } from "$data/types";

  import Button from "$lib/components/Button/Button.svelte";
  import Input from "../form-elements/Input/Input.svelte";
  import InputGroup from "../form-elements/Input/InputGroup.svelte";

  export let book: any;

  export let saving: boolean;

  let titleEl: HTMLInputElement;

  const updateBook = (updates: Partial<Book>) => {
    book = { ...book, ...updates };
  };

  let missingTitle = false;

  const addAuthor = () => {
    updateBook({ authors: [...book.authors, ""] });
  };

  export const validate = () => {
    missingTitle = !titleEl.value;
    return !missingTitle;
  };
</script>

<fieldset disabled={saving}>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
    <div class="sm:col-span-2 grid grid-cols-3 gap-x-5 gap-y-4">
      {#each book.authors || [] as author, index (index)}
        <InputGroup labelText="Author">
          <Input slot="input" name="authors" bind:value={author} placeholder={`Author ${index + 1}`} />
        </InputGroup>
      {/each}
    </div>

    <div class="sm:col-span-2">
      <Button size="sm" type="button" disabled={saving} on:click={addAuthor}><i class="far fa-fw fa-plus"></i>Add author</Button>
    </div>
  </div>
</fieldset>
