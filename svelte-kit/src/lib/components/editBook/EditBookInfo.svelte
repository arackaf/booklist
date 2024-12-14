<script lang="ts">
  import type { Book, Subject, Tag } from "$data/types";

  import Button from "$lib/components/Button/Button.svelte";
  import Input from "../form-elements/Input/Input.svelte";
  import InputGroup from "../form-elements/Input/InputGroup.svelte";
  import SelectAvailableTags from "$lib/components/subjectsAndTags/tags/SelectAvailableTags.svelte";
  import SelectAvailableSubjects from "$lib/components/subjectsAndTags/subjects/SelectAvailableSubjects.svelte";

  import DisplaySelectedTags from "$lib/components/subjectsAndTags/tags/DisplaySelectedTags.svelte";
  import DisplaySelectedSubjects from "$lib/components/subjectsAndTags/subjects/DisplaySelectedSubjects.svelte";
  import SelectAndDisplayContainer from "../subjectsAndTags/SelectAndDisplayContainer.svelte";

  type Props = {
    book: any;
    tags: Tag[];
    subjects: Subject[];
    saveAttempted: boolean;

    saving: boolean;
  };

  let { book, tags, subjects, saving, saveAttempted }: Props = $props();

  let missingTitle = $state(false);
  let titleEl = $state<HTMLInputElement>(null as any);

  const addSubject = (subject: Subject) => {
    book.subjects.push(subject.id);
  };
  const removeSubject = (subject: any) => {
    book.subjects = book.subjects.filter((id: string) => id != subject.id);
  };

  const addTag = (tag: any) => {
    book.tags.push(tag.id);
  };
  const removeTag = (tag: any) => {
    book.tags = book.tags.filter((id: string) => id != tag.id);
  };

  const addAuthor = () => {
    book.authors.push("");
  };
</script>

<fieldset disabled={saving}>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4">
    <InputGroup labelText="Title">
      <Input
        name="title"
        error={saveAttempted && missingTitle}
        bind:value={book.title}
        bind:inputEl={titleEl}
        oninput={evt => (missingTitle = !titleEl.value.trim())}
        placeholder="Title (required)"
      />
    </InputGroup>

    <InputGroup labelText="ISBN">
      <Input name="isbn" bind:value={book.isbn} placeholder="ISBN" />
    </InputGroup>

    <InputGroup labelText="Pages">
      <Input name="pages" bind:value={book.pages} type="number" placeholder="Number of pages" />
    </InputGroup>

    <InputGroup labelText="Publisher">
      <Input name="publisher" bind:value={book.publisher} placeholder="Publisher" />
    </InputGroup>

    <InputGroup labelText="Published">
      <Input name="publicationDate" bind:value={book.publicationDate} placeholder="Publication date" />
    </InputGroup>

    <SelectAndDisplayContainer class="sm:col-span-2">
      {#snippet select()}
        <SelectAvailableTags {tags} currentlySelected={book.tags} onSelect={addTag} />
      {/snippet}
      {#snippet display()}
        <DisplaySelectedTags {tags} currentlySelected={book.tags} onRemove={removeTag} />
      {/snippet}
    </SelectAndDisplayContainer>

    <SelectAndDisplayContainer class="sm:col-span-2">
      {#snippet select()}
        <SelectAvailableSubjects {subjects} currentlySelected={book.subjects} onSelect={addSubject} />
      {/snippet}
      {#snippet display()}
        <DisplaySelectedSubjects {subjects} currentlySelected={book.subjects} onRemove={removeSubject} />
      {/snippet}
    </SelectAndDisplayContainer>

    <div class="sm:col-span-2 grid grid-cols-3 gap-x-5 gap-y-4">
      {#each book.authors || [] as _, index (index)}
        <InputGroup labelText="Author">
          <Input name="authors" bind:value={book.authors[index]} placeholder={`Author ${index + 1}`} />
        </InputGroup>
      {/each}
    </div>

    <div class="sm:col-span-2">
      <Button size="sm" type="button" disabled={saving} onclick={addAuthor}><i class="far fa-fw fa-plus"></i>Add author</Button>
    </div>
  </div>
</fieldset>
