<script lang="ts">
  import type { Book, Subject, Tag } from "$data/types";

  import Button from "../buttons/Button.svelte";

  import SelectAvailableTags from "$lib/components/subjectsAndTags/tags/SelectAvailableTags.svelte";
  import SelectAvailableSubjects from "$lib/components/subjectsAndTags/subjects/SelectAvailableSubjects.svelte";

  import DisplaySelectedTags from "$lib/components/subjectsAndTags/tags/DisplaySelectedTags.svelte";
  import DisplaySelectedSubjects from "$lib/components/subjectsAndTags/subjects/DisplaySelectedSubjects.svelte";
  import FlexRow from "../layout/FlexRow.svelte";

  export let book: any;
  export let tags: Tag[];
  export let subjects: Subject[];

  export let saving: boolean;

  let titleEl: HTMLInputElement;

  const updateBook = (updates: Partial<Book>) => {
    book = { ...book, ...updates };
  };

  const addSubject = (subject: Subject) => updateBook({ subjects: book.subjects.concat(subject._id) });
  const removeSubject = (subject: any) => updateBook({ subjects: book.subjects.filter((_id: string) => _id != subject._id) });

  const addTag = (tag: any) => updateBook({ tags: book.tags.concat(tag._id) });
  const removeTag = (tag: any) => updateBook({ tags: book.tags.filter((_id: string) => _id != tag._id) });

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
  <FlexRow>
    <div class="col-xs-6">
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

    <div class="col-xs-6">
      <div class="form-group">
        <label for="book-edit-isbn">ISBN</label>
        <input id="book-edit-isbn" name="isbn" class="form-control" value={book.isbn} placeholder="ISBN" />
      </div>
    </div>

    <div class="col-xs-6">
      <div class="form-group">
        <label for="book-edit-pages">Pages</label>
        <input id="book-edit-pages" name="pages" class="form-control" value={book.pages} type="number" placeholder="Number of pages" />
      </div>
    </div>

    <div class="col-xs-6">
      <div class="form-group">
        <label for="book-edit-publisher">Publisher</label>
        <input id="book-edit-publisher" name="publisher" class="form-control" value={book.publisher} placeholder="Publisher" />
      </div>
    </div>

    <div class="col-xs-6">
      <div class="form-group">
        <label for="book-edit-published">Published</label>
        <input id="book-edit-published" name="publicationDate" class="form-control" value={book.publicationDate} placeholder="Publication date" />
      </div>
    </div>

    <div class="col-xs-12">
      <FlexRow>
        <div class="col-sm-3 col-xs-12">
          <SelectAvailableTags {tags} currentlySelected={book.tags} onSelect={addTag} />
        </div>
        <div class="col-sm-9 col-xs-12">
          <DisplaySelectedTags {tags} currentlySelected={book.tags} onRemove={removeTag} />
        </div>
      </FlexRow>
    </div>

    <div class="col-xs-12">
      <FlexRow>
        <div class="col-sm-3 col-xs-12">
          <SelectAvailableSubjects {subjects} currentlySelected={book.subjects} onSelect={addSubject} />
        </div>
        <div class="col-sm-9 col-xs-12">
          <DisplaySelectedSubjects {subjects} currentlySelected={book.subjects} onRemove={removeSubject} />
        </div>
      </FlexRow>
    </div>

    {#each book.authors || [] as author, index (index)}
      <div class="col-xs-4">
        <div class="form-group">
          <label for={`book-edit-author-${index}`}>Author</label>
          <input id={`book-edit-author-${index}`} value={author} class="form-control" name="authors" placeholder={`Author ${index + 1}`} />
        </div>
      </div>
    {/each}
    <div class="col-xs-12">
      <Button type="button" disabled={saving} onClick={addAuthor} preset="default-xs"><i class="far fa-fw fa-plus" />Add author</Button>
    </div>
  </FlexRow>
</fieldset>
