<script lang="ts">
  import { onMount, setContext } from "svelte";
  import { page } from "$app/stores";

  import type { Writable } from "svelte/store";

  import GridView from "./bookViews/GridView.svelte";
  import BasicView from "./bookViews/BasicView.svelte";
  import CoversView from "./bookViews/CoversView.svelte";

  import BookSearchModal from "./SearchModal.svelte";
  import MenuBar from "./menuBar/MenuBar.svelte";

  import SubjectEditModal from "./SubjectEditModal.svelte";
  import TagEditModal from "./TagEditModal.svelte";
  import EditBookModal from "$lib/components/editBook/EditBookModal.svelte";
  import BookSubjectSetter from "./BookSubjectSetter.svelte";
  import BookTagSetter from "./BookTagSetter.svelte";

  import { runUpdate, type UpdatesTo } from "$lib/state/dataUpdates";
  import type { Book } from "$data/types";
  import { selectedBooksLookup, selectionState } from "./state/selectionState";

  import type { PageData } from "./$types";
  import { BASIC_LIST_VIEW, GRID_VIEW } from "./bookViews/constants";

  export let data: PageData;

  $: ({ isPublic, colors, subjects, defaultBookView, tags, publicUser } = data);
  let bookViewOverride: string | null = null;
  const overrideBookView = (newBookView: string) => (bookViewOverride = newBookView);

  $: bookViewToUse = bookViewOverride || defaultBookView;

  onMount(() => {
    selectionState.clear();
  });

  $: books = $page.data.books as Writable<Book[]>;

  let filterModalOpen = false;
  let openFilterModal = () => (filterModalOpen = true);

  let editSubjectsModalOpen = false;
  let editSubjects = () => (editSubjectsModalOpen = true);

  let editTagsModalOpen = false;
  let editTags = () => (editTagsModalOpen = true);

  let editBookModalOpen = false;
  let editingBook: any = null;
  const editBook = (book: any) => {
    editingBook = book;
    editBookModalOpen = true;
  };

  const onBooksUpdated = (_id: string | string[], updates: UpdatesTo<Book>) => {
    runUpdate($page.data.books, _id, updates);
  };

  let booksSubjectsModalOpen = false;
  let booksTagsModalOpen = false;

  $: booksEditing = $books.filter(b => $selectedBooksLookup[b._id]);
  const editBooksSubjects = () => (booksSubjectsModalOpen = true);
  const editBooksTags = () => (booksTagsModalOpen = true);

  let booksModuleContext = {
    openFilterModal,
    editSubjects,
    editTags,
    editBook,
    editBooksSubjects,
    editBooksTags,
    onBooksUpdated,
    overrideBookView
  };
  setContext("books-module-context", booksModuleContext);

  const stopEditingBook = () => {
    editBookModalOpen = false;
  };
</script>

<section class="full flush-bottom">
  <div style="background-color: white;">
    <MenuBar {isPublic} {bookViewToUse} />

    <div>
      <div class="overlay-holder" style="flex: 1; padding: 0px; grid-template-columns: 100%">
        {#if !$books.length}
          <div>
            <div class="alert alert-warning" style="margin-top: 20px">No books found</div>
            {#if !publicUser}
              <div class="alert alert-warning" style="margin-top: 20px">
                If you previously have an account with the old version of this site, your books are safe. Just sync your account&nbsp;
                <a href="/settings/account-sync">here</a>
              </div>
            {/if}
          </div>
        {:else}
          <div>
            {#if bookViewToUse == BASIC_LIST_VIEW}
              <BasicView books={$books} {isPublic} />
            {:else if bookViewToUse === GRID_VIEW}
              <GridView books={$books} {subjects} {tags} {isPublic} />
            {:else}
              <CoversView books={$books} {subjects} {tags} {isPublic} />
            {/if}
          </div>
        {/if}

        <BookSearchModal isOpen={filterModalOpen} onHide={() => (filterModalOpen = false)} {tags} allSubjects={subjects} />

        <EditBookModal
          isOpen={editBookModalOpen}
          book={editingBook}
          onSave={onBooksUpdated}
          closeOnSave={true}
          onHide={stopEditingBook}
          {subjects}
          {tags}
        />

        <BookSubjectSetter
          isOpen={booksSubjectsModalOpen}
          onSave={onBooksUpdated}
          onHide={() => (booksSubjectsModalOpen = false)}
          modifyingBooks={booksEditing}
        />
        <BookTagSetter
          isOpen={booksTagsModalOpen}
          onSave={onBooksUpdated}
          onHide={() => (booksTagsModalOpen = false)}
          modifyingBooks={booksEditing}
        />

        <SubjectEditModal {colors} {subjects} isOpen={editSubjectsModalOpen} onHide={() => (editSubjectsModalOpen = false)} />

        <TagEditModal {colors} {tags} isOpen={editTagsModalOpen} onHide={() => (editTagsModalOpen = false)} />
      </div>
    </div>
  </div>
</section>

<style>
  :global(.bookTitle) {
    font-size: 15px;
    font-weight: normal;
  }

  :global(.bookAuthor) {
    font-size: 14px;
    font-weight: normal;
    color: var(--neutral-light-text);
  }
</style>
