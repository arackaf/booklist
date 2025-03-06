<script lang="ts">
  import { onMount, setContext } from "svelte";

  import type { Book } from "$data/types";
  import Alert from "$lib/components/Alert.svelte";
  import { runUpdate, type UpdatesTo } from "$lib/state/dataUpdates";

  import GridView from "./bookViews/GridView.svelte";
  import MobileView from "./bookViews/MobileView.svelte";
  import CoversView from "./bookViews/CoversView.svelte";

  import MenuBar from "./menuBar/MenuBar.svelte";

  import { selectionState } from "./state/selectionState.svelte";

  import { BASIC_LIST_VIEW, GRID_VIEW } from "./bookViews/constants";

  import type BookSearchModalType from "./SearchModal.svelte";
  import type SubjectEditModalType from "./SubjectEditModal.svelte";
  import type TagEditModalType from "./TagEditModal.svelte";
  import type EditBookModalType from "$lib/components/editBook/EditBookModal.svelte";
  import type BookSubjectTagSetterType from "./BookSubjectTagSetter.svelte";
  import { SearchState } from "./state/searchState.svelte";
  import { afterDelete } from "./state/onDelete";
  import { afterNavigate } from "$app/navigation";
  import { uiState } from "./currentUiState.svelte";

  let { data } = $props();
  let { books, subjects, tags, isPublic, hasPublicId, colors, defaultBookView, totalBooks } = $derived(data);

  const searchState = new SearchState();

  const overrideBookView = (newBookView: string) => {
    uiState.bookViewOverride = newBookView;
  };

  let bookViewToUse = $derived(uiState.bookViewOverride || defaultBookView);
  let modalsReady = $state(false);

  let BookSearchModal = $state<typeof BookSearchModalType | null>(null);
  let SubjectEditModal = $state<typeof SubjectEditModalType | null>(null);
  let TagEditModal = $state<typeof TagEditModalType | null>(null);
  let EditBookModal = $state<typeof EditBookModalType | null>(null);
  let BookSubjectTagSetter = $state<typeof BookSubjectTagSetterType | null>(null);

  onMount(() => {
    Promise.all([
      import("./SearchModal.svelte").then(res => res.default),
      import("./SubjectEditModal.svelte").then(res => res.default),
      import("./TagEditModal.svelte").then(res => res.default),
      import("$lib/components/editBook/EditBookModal.svelte").then(res => res.default),
      import("./BookSubjectTagSetter.svelte").then(res => res.default)
    ]).then(results => {
      [BookSearchModal, SubjectEditModal, TagEditModal, EditBookModal, BookSubjectTagSetter] = results;
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

  function f() {}

  let booksSubjectsModalOpen = $state(false);
  let booksTagsModalOpen = $state(false);

  let booksEditing = $derived(books.filter(b => selectionState.selectedBooksLookup[b.id]));
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
        {#if !books.length}
          <div>
            <Alert type="warning">No books found</Alert>

            {#if !hasPublicId && searchState.value.activeFilterCount === 0}
              <Alert class="mt-4" type="warning">
                If you previously have an account with the old version of this site, your books are safe. Just sync your account&nbsp;
                <a href="/settings/account-sync">here</a>
              </Alert>
            {/if}
          </div>
        {:else}
          <div>
            {#if bookViewToUse == BASIC_LIST_VIEW}
              <MobileView {books} {isPublic} />
            {:else if bookViewToUse === GRID_VIEW}
              <GridView {tags} {subjects} {books} {isPublic} />
            {:else}
              <CoversView {books} {isPublic} />
            {/if}
          </div>
        {/if}

        {#if modalsReady}
          <BookSearchModal isOpen={filterModalOpen} onHide={() => (filterModalOpen = false)} {tags} allSubjects={subjects} />

          <EditBookModal
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

          <BookSubjectTagSetter
            isOpen={booksSubjectsModalOpen}
            onSave={onBooksUpdated}
            onHide={() => (booksSubjectsModalOpen = false)}
            modifyingBooks={booksEditing}
          />

          <SubjectEditModal {colors} {subjects} isOpen={editSubjectsModalOpen} onHide={() => (editSubjectsModalOpen = false)} />

          <TagEditModal {colors} {tags} isOpen={editTagsModalOpen} onHide={() => (editTagsModalOpen = false)} />
        {/if}
      </div>
    </div>
  </div>
</section>
