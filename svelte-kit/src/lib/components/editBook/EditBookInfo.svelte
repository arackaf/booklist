<script lang="ts">
  import type { Book, Subject, Tag } from "$data/types";

  import Button from "$lib/components/ui/Button/Button.svelte";
  import SelectAvailableTags from "$lib/components/subjectsAndTags/tags/SelectAvailableTags.svelte";
  import SelectAvailableSubjects from "$lib/components/subjectsAndTags/subjects/SelectAvailableSubjects.svelte";

  import DisplaySelectedTags from "$lib/components/subjectsAndTags/tags/DisplaySelectedTags.svelte";
  import DisplaySelectedSubjects from "$lib/components/subjectsAndTags/subjects/DisplaySelectedSubjects.svelte";

  export let book: any;
  export let tags: Tag[];
  export let subjects: Subject[];

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

  export const init: () => void = () => {
    setTimeout(() => {
      titleEl?.focus();
    });
  };
</script>

<fieldset disabled={saving}>
  <div class="grid grid-cols-2 gap-x-5 gap-y-4">
    <div>
      <div class={"form-group"}>
        <label for="book-edit-title">Title</label>
        <input
          id="book-edit-title"
          class="form-control"
          name="title"
          class:error={missingTitle}
          value={book.title}
          bind:this={titleEl}
          on:input={titleKeyDown}
          placeholder="Title (required)"
        />
      </div>
    </div>

    <div>
      <div class="form-group">
        <label for="book-edit-isbn">ISBN</label>
        <input id="book-edit-isbn" name="isbn" class="form-control" value={book.isbn} placeholder="ISBN" />
      </div>
    </div>

    <div>
      <div class="form-group">
        <label for="book-edit-pages">Pages</label>
        <input id="book-edit-pages" name="pages" class="form-control" value={book.pages} type="number" placeholder="Number of pages" />
      </div>
    </div>

    <div>
      <div class="form-group">
        <label for="book-edit-publisher">Publisher</label>
        <input id="book-edit-publisher" name="publisher" class="form-control" value={book.publisher} placeholder="Publisher" />
      </div>
    </div>

    <div>
      <div class="form-group">
        <label for="book-edit-published">Published</label>
        <input id="book-edit-published" name="publicationDate" class="form-control" value={book.publicationDate} placeholder="Publication date" />
      </div>
    </div>

    <div class="col-span-2">
      <div class="flex flex-row">
        <div class="basis-full md:basis-1/4">
          <SelectAvailableTags {tags} currentlySelected={book.tags} onSelect={addTag} />
        </div>
        <div class="basis-full md:basis-3/4 flex items-center">
          <DisplaySelectedTags {tags} currentlySelected={book.tags} onRemove={removeTag} />
        </div>
      </div>
    </div>

    <div class="col-span-2">
      <div class="flex flex-row">
        <div class="basis-full md:basis-1/4">
          <SelectAvailableSubjects {subjects} currentlySelected={book.subjects} onSelect={addSubject} />
        </div>
        <div class="basis-full md:basis-3/4 flex items-center">
          <DisplaySelectedSubjects {subjects} currentlySelected={book.subjects} onRemove={removeSubject} />
        </div>
      </div>
    </div>

    <div class="col-span-2 grid grid-cols-3 gap-x-5 gap-y-4">
      {#each book.authors || [] as author, index (index)}
        <div>
          <div class="form-group">
            <label for={`book-edit-author-${index}`}>Author</label>
            <input id={`book-edit-author-${index}`} value={author} class="form-control" name="authors" placeholder={`Author ${index + 1}`} />
          </div>
        </div>
      {/each}
    </div>

    <div class="col-span-2">
      <Button size="sm" type="button" disabled={saving} on:click={addAuthor}><i class="far fa-fw fa-plus" />Add author</Button>
    </div>
  </div>
</fieldset>
