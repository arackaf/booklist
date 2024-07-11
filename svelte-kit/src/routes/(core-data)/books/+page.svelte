<script lang="ts">
  import { onMount, setContext } from "svelte";

  import type { Book } from "$data/types";
  import Alert from "$lib/components/Alert.svelte";
  import { runUpdate, type UpdatesTo } from "$lib/state/dataUpdates";

  import GridView from "./bookViews/GridView.svelte";
  import MobileView from "./bookViews/MobileView.svelte";
  import CoversView from "./bookViews/CoversView.svelte";

  import MenuBar from "./menuBar/MenuBar.svelte";

  import { selectedBooksLookup, selectionState } from "./state/selectionState";

  import { BASIC_LIST_VIEW, GRID_VIEW } from "./bookViews/constants";

  import type BookSearchModalType from "./SearchModal.svelte";
  import type SubjectEditModalType from "./SubjectEditModal.svelte";
  import type TagEditModalType from "./TagEditModal.svelte";
  import type EditBookModalType from "$lib/components/editBook/EditBookModal.svelte";
  import type BookSubjectSetterType from "./BookSubjectSetter.svelte";
  import type BookTagSetterType from "./BookTagSetter.svelte";
  import { searchState } from "./state/searchState";
  import { afterDelete } from "./state/onDelete";
  import { afterNavigate } from "$app/navigation";
  import { uiState } from "./currentUiState.svelte";

  let { data } = $props();
  let { isPublic, hasPublicId, colors, subjects, defaultBookView, tags, /*books,*/ totalBooks } = data;
  let books = $derived(data.books);

  const overrideBookView = (newBookView: string) => {
    uiState.bookViewOverride = newBookView;
  };

  let bookViewToUse = $derived(uiState.bookViewOverride || defaultBookView);

  let modalsReady = $state(false);

  let BookSearchModal = $state<typeof BookSearchModalType | null>(null);
  let SubjectEditModal = $state<typeof SubjectEditModalType | null>(null);
  let TagEditModal = $state<typeof TagEditModalType | null>(null);
  let EditBookModal = $state<typeof EditBookModalType | null>(null);
  let BookSubjectSetter = $state<typeof BookSubjectSetterType | null>(null);
  let BookTagSetter = $state<typeof BookTagSetterType | null>(null);

  onMount(() => {
    Promise.all([
      import("./SearchModal.svelte").then(res => res.default),
      import("./SubjectEditModal.svelte").then(res => res.default),
      import("./TagEditModal.svelte").then(res => res.default),
      import("$lib/components/editBook/EditBookModal.svelte").then(res => res.default),
      import("./BookSubjectSetter.svelte").then(res => res.default),
      import("./BookTagSetter.svelte").then(res => res.default)
    ]).then(results => {
      [BookSearchModal, SubjectEditModal, TagEditModal, EditBookModal, BookSubjectSetter, BookTagSetter] = results;
      modalsReady = true;
    });
  });

  afterNavigate(() => {
    selectionState.clear();
  });

  let filterModalOpen = $state(false);
  let openFilterModal = () => (filterModalOpen = true);

  let editSubjectsModalOpen = $state(false);
  let editSubjects = () => (editSubjectsModalOpen = true);

  let editTagsModalOpen = $state(false);
  let editTags = () => (editTagsModalOpen = true);

  let editBookModalOpen = $state(false);
  let editingBook = $state<any>(null);
  const editBook = (book: any) => {
    let bookSnapshot = $state.snapshot(book);
    editingBook = bookSnapshot;
    editBookModalOpen = true;
  };

  const onBooksUpdated = (id: number | number[], updates: UpdatesTo<Book>) => {
    runUpdate(books, id, updates);
  };

  let booksSubjectsModalOpen = $state(false);
  let booksTagsModalOpen = $state(false);

  let booksEditing = $derived(books.value.filter(b => $selectedBooksLookup[b.id]));
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

<section class="full pb-0">
  <div style="background-color: white;">
    <MenuBar totalBooks={totalBooks.value} {isPublic} {bookViewToUse} />

    <div class:overflow-x-auto={bookViewToUse === "tbl"}>
      <div class="overlay-holder mt-1" style="flex: 1; padding: 0px; grid-template-columns: 100%">
        {#if !books.value.length}
          <div>
            <Alert type="warning">No books found</Alert>

            {#if !hasPublicId && $searchState.activeFilterCount === 0}
              <Alert class="mt-4" type="warning">
                If you previously have an account with the old version of this site, your books are safe. Just sync your account&nbsp;
                <a href="/settings/account-sync">here</a>
              </Alert>
            {/if}
          </div>
        {:else}
          <div>
            {#if bookViewToUse == BASIC_LIST_VIEW}
              <MobileView books={books.value} {isPublic} />
            {:else if bookViewToUse === GRID_VIEW}
              <GridView books={books.value} {isPublic} />
            {:else}
              <CoversView books={books.value} {isPublic} />
            {/if}
          </div>
        {/if}

        {#if modalsReady}
          <svelte:component this={BookSearchModal} isOpen={filterModalOpen} onHide={() => (filterModalOpen = false)} {tags} allSubjects={subjects} />

          <svelte:component
            this={EditBookModal}
            isOpen={editBookModalOpen}
            book={editingBook}
            onSave={onBooksUpdated}
            closeOnSave={true}
            onHide={stopEditingBook}
            {subjects}
            {tags}
            header={`Edit: ${editingBook?.title}`}
            {afterDelete}
          />

          <svelte:component
            this={BookSubjectSetter}
            isOpen={booksSubjectsModalOpen}
            onSave={onBooksUpdated}
            onHide={() => (booksSubjectsModalOpen = false)}
            modifyingBooks={booksEditing}
          />
          <svelte:component
            this={BookTagSetter}
            isOpen={booksTagsModalOpen}
            onSave={onBooksUpdated}
            onHide={() => (booksTagsModalOpen = false)}
            modifyingBooks={booksEditing}
          />

          <svelte:component
            this={SubjectEditModal}
            {colors}
            {subjects}
            isOpen={editSubjectsModalOpen}
            onHide={() => (editSubjectsModalOpen = false)}
          />

          <svelte:component this={TagEditModal} {colors} {tags} isOpen={editTagsModalOpen} onHide={() => (editTagsModalOpen = false)} />
        {/if}
      </div>
    </div>
  </div>
</section>
