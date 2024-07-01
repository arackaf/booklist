<script lang="ts">
  import type { Book, Subject, Tag } from "$data/types";

  import Button from "$lib/components/Button/Button.svelte";
  import Input from "../form-elements/Input/Input.svelte";
  import InputGroup from "../form-elements/Input/InputGroup.svelte";

  export let book: any;

  export let saving: boolean;

  let titleEl: HTMLInputElement;

  const updateBook = (updates: Partial<Book>) => {
    book = { ...book, ...updates };
  };

  const addSubject = (subject: Subject) => updateBook({ subjects: book.subjects.concat(subject.id) });
  const removeSubject = (subject: any) => updateBook({ subjects: book.subjects.filter((id: string) => id != subject.id) });

  const addTag = (tag: any) => updateBook({ tags: book.tags.concat(tag.id) });
  const removeTag = (tag: any) => updateBook({ tags: book.tags.filter((id: string) => id != tag.id) });

  let missingTitle = false;

  const addAuthor = () => {
    updateBook({ authors: [...book.authors, ""] });
  };

  function titleKeyDown(evt: any) {
    if (evt.target.value) {
      missingTitle = false;
    }
  }

  export const validate = () => {
    missingTitle = !titleEl.value;
    return !missingTitle;
  };
</script>

<fieldset disabled={saving}>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
    <InputGroup labelText="Title">
      <Input
        slot="input"
        name="title"
        error={missingTitle}
        bind:value={book.title}
        bind:inputEl={titleEl}
        on:input={titleKeyDown}
        placeholder="Title (required)"
      />
    </InputGroup>

    <InputGroup labelText="ISBN">
      <Input slot="input" name="isbn" bind:value={book.isbn} placeholder="ISBN" />
    </InputGroup>

    <InputGroup labelText="Pages">
      <Input slot="input" name="pages" bind:value={book.pages} type="number" placeholder="Number of pages" />
    </InputGroup>

    <InputGroup labelText="Publisher">
      <Input slot="input" name="publisher" bind:value={book.publisher} placeholder="Publisher" />
    </InputGroup>

    <InputGroup labelText="Published">
      <Input slot="input" name="publicationDate" bind:value={book.publicationDate} placeholder="Publication date" />
    </InputGroup>

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
