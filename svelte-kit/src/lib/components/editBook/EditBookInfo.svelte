<script lang="ts">
  import { enhance } from "$app/forms";

  import type { Book, Subject, Tag } from "$data/types";
  import type { UpdatesTo } from "$lib/state/dataUpdates";

  import ActionButton from "../buttons/ActionButton.svelte";
  import Button from "../buttons/Button.svelte";

  import SelectAvailableTags from "$lib/components/subjectsAndTags/tags/SelectAvailableTags.svelte";
  import SelectAvailableSubjects from "$lib/components/subjectsAndTags/subjects/SelectAvailableSubjects.svelte";

  import DisplaySelectedTags from "$lib/components/subjectsAndTags/tags/DisplaySelectedTags.svelte";
  import DisplaySelectedSubjects from "$lib/components/subjectsAndTags/subjects/DisplaySelectedSubjects.svelte";
  import FlexRow from "../layout/FlexRow.svelte";
  import FlowItems from "../layout/FlowItems.svelte";

  export let book: any;
  export let tags: Tag[];
  export let subjects: Subject[];

  export let onBookUpdated: (_id: string, updates: UpdatesTo<Book>) => void;

  let editingBook: any;
  $: bookChanged(book);

  function bookChanged(book: any) {
    editingBook = { ...book };
  }

  const addSubject = (subject: Subject) => (editingBook.subjects = editingBook.subjects.concat(subject._id));
  const removeSubject = (subject: any) => (editingBook.subjects = editingBook.subjects.filter((_id: string) => _id != subject._id));

  const addTag = (tag: any) => (editingBook.tags = editingBook.tags.concat(tag._id));
  const removeTag = (tag: any) => (editingBook.tags = editingBook.tags.filter((_id: string) => _id != tag._id));

  let missingTitle = false;

  export let cancel: any;

  const addAuthor = (evt: any) => {
    editingBook.authors = [...editingBook.authors, ""];
  };

  let saving = false;
  function executeSave({ cancel, data }: any) {
    if (!data.get("title")) {
      missingTitle = true;
      return cancel();
    }
    const _id = data.get("_id");
    missingTitle = false;

    saving = true;
    return async ({ result }: any) => {
      saving = false;
      onBookUpdated(_id, result.data.updates);
    };
  }

  function titleKeyDown(evt: any) {
    if (evt.target.value) {
      missingTitle = false;
    }
  }
</script>

<form method="post" action="?/saveBook" use:enhance={executeSave}>
  <fieldset disabled={saving}>
    <input type="hidden" name="_id" value={editingBook._id} />
    <FlexRow>
      <div class="col-xs-6">
        <div class={"form-group"}>
          <label for="book-edit-title">Title</label>
          <input
            id="book-edit-title"
            class="form-control"
            name="title"
            class:error={missingTitle}
            bind:value={editingBook.title}
            on:input={titleKeyDown}
            placeholder="Title (required)"
          />
        </div>
      </div>

      <div class="col-xs-6">
        <div class="form-group">
          <label for="book-edit-isbn">ISBN</label>
          <input id="book-edit-isbn" class="form-control" bind:value={editingBook.isbn} placeholder="ISBN" />
        </div>
      </div>

      <div class="col-xs-6">
        <div class="form-group">
          <label for="book-edit-pages">Pages</label>
          <input id="book-edit-pages" class="form-control" bind:value={editingBook.pages} type="number" placeholder="Number of pages" />
        </div>
      </div>

      <div class="col-xs-6">
        <div class="form-group">
          <label for="book-edit-publisher">Publisher</label>
          <input id="book-edit-publisher" class="form-control" bind:value={editingBook.publisher} placeholder="Publisher" />
        </div>
      </div>

      <div class="col-xs-6">
        <div class="form-group">
          <label for="book-edit-published">Published</label>
          <input id="book-edit-published" class="form-control" bind:value={editingBook.publicationDate} placeholder="Publication date" />
        </div>
      </div>

      <div class="col-xs-12">
        <FlexRow>
          <div class="col-sm-3 col-xs-12">
            <SelectAvailableTags {tags} currentlySelected={editingBook.tags} onSelect={addTag} />
          </div>
          <div class="col-sm-9 col-xs-12">
            <DisplaySelectedTags {tags} currentlySelected={editingBook.tags} onRemove={removeTag} />
          </div>
        </FlexRow>
      </div>

      <div class="col-xs-12">
        <FlexRow>
          <div class="col-sm-3 col-xs-12">
            <SelectAvailableSubjects {subjects} currentlySelected={editingBook.subjects} onSelect={addSubject} />
          </div>
          <div class="col-sm-9 col-xs-12">
            <DisplaySelectedSubjects {subjects} currentlySelected={editingBook.subjects} onRemove={removeSubject} />
          </div>
        </FlexRow>
      </div>

      {#each editingBook.authors || [] as author, index (index)}
        <div class="col-xs-4">
          <div class="form-group">
            <label for={`book-edit-author-${index}`}>Author</label>
            <input
              id={`book-edit-author-${index}`}
              bind:value={editingBook.authors[index]}
              class="form-control"
              name="authors"
              placeholder={`Author ${index + 1}`}
            />
          </div>
        </div>
      {/each}
      <div class="col-xs-12">
        <Button type="button" disabled={saving} onClick={evt => addAuthor(evt)} preset="default-xs"><i class="far fa-fw fa-plus" />Add author</Button>
      </div>
    </FlexRow>
    <hr />

    <FlowItems>
      <ActionButton type="submit" style="min-width: 10ch" isRunning={saving} finishedText="Saved" text="Save" preset="primary" runningText="Saving" />
      <Button disabled={saving} style="margin-left: auto;" type="button" onClick={cancel}>Cancel</Button>
    </FlowItems>
  </fieldset>
</form>
