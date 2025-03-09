<script lang="ts">
  import { PlusIcon } from "lucide-svelte";

  import type { Subject, Tag } from "$data/types";

  import { cn } from "$lib/utils";
  import Button from "$lib/components/ui/button/button.svelte";
  import Label from "$lib/components/ui/label/label.svelte";
  import Input from "$lib/components/ui/input/input.svelte";

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
    <div class="flex flex-col gap-1.5">
      <Label for="edit-title">Title</Label>
      <Input
        id="edit-title"
        name="title"
        autocomplete="off"
        class={cn("focus:border-border", {
          "border-red-600": saveAttempted && !book.title,
          "focus-visible:ring-red-600": saveAttempted && !book.title
        })}
        bind:value={book.title}
        bind:ref={titleEl}
        placeholder="Title (required)"
      />
    </div>

    <div class="flex flex-col gap-1.5">
      <Label for="edit-isbn">ISBN</Label>
      <Input id="edit-isbn" name="isbn" bind:value={book.isbn} placeholder="ISBN" />
    </div>

    <div class="flex flex-col gap-1.5">
      <Label for="edit-pages">Pages</Label>
      <Input id="edit-pages" name="pages" bind:value={book.pages} type="number" placeholder="Number of pages" />
    </div>

    <div class="flex flex-col gap-1.5">
      <Label for="edit-publisher">Publisher</Label>
      <Input id="edit-publisher" name="publisher" bind:value={book.publisher} placeholder="Publisher" />
    </div>

    <div class="flex flex-col gap-1.5">
      <Label for="edit-published">Published</Label>
      <Input id="edit-published" name="publicationDate" bind:value={book.publicationDate} placeholder="Publication date" />
    </div>

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
        <div class="flex flex-col gap-1.5">
          <Label for="edit-author-{index}">Author</Label>
          <Input id="edit-author-{index}" name="authors" bind:value={book.authors[index]} placeholder={`Author ${index + 1}`} />
        </div>
      {/each}
    </div>

    <div class="sm:col-span-2">
      <Button variant="secondary" size="sm" type="button" disabled={saving} onclick={addAuthor}><PlusIcon />Add author</Button>
    </div>
  </div>
</fieldset>
