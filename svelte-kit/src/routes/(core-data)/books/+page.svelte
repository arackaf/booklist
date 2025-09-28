<script lang="ts">
  import { onMount, setContext } from "svelte";
  import { MessageCircleWarningIcon, TerminalIcon, TriangleAlertIcon } from "lucide-svelte";

  import type { Book } from "$data/types";

  import { afterNavigate } from "$app/navigation";
  import * as Alert from "$lib/components/ui/alert";
  import { runUpdate, type UpdatesTo } from "$lib/state/dataUpdates";

  import GridView from "./bookViews/GridView.svelte";
  import MobileView from "./bookViews/MobileView.svelte";
  import CoversView from "./bookViews/CoversView.svelte";

  import MenuBar from "./menuBar/MenuBar.svelte";

  import { selectionState } from "./state/selectionState.svelte";

  import { BASIC_LIST_VIEW, GRID_VIEW } from "./bookViews/constants";

  import type BookSearchModalType from "./SearchModal.svelte";
  import type SubjectsTagsEditModalType from "./SubjectTagEditModal.svelte";
  import type EditBookModalType from "$lib/components/editBook/EditBookModal.svelte";
  import type BookSubjectTagSetterType from "./BookSubjectTagSetter.svelte";
  import { SearchState } from "./state/searchState.svelte";
  import { afterDelete } from "./state/onDelete";
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
  let SubjectsTagsEditModal = $state<typeof SubjectsTagsEditModalType | null>(null);
  let EditBookModal = $state<typeof EditBookModalType | null>(null);
  let BookSubjectTagSetter = $state<typeof BookSubjectTagSetterType | null>(null);

  onMount(() => {
    Promise.all([
      import("./SearchModal.svelte").then(res => res.default),
      import("./SubjectTagEditModal.svelte").then(res => res.default),
      import("$lib/components/editBook/EditBookModal.svelte").then(res => res.default),
      import("./BookSubjectTagSetter.svelte").then(res => res.default)
    ]).then(results => {
      [BookSearchModal, SubjectsTagsEditModal, EditBookModal, BookSubjectTagSetter] = results;
      modalsReady = true;
    });
  });

  afterNavigate(() => {
    selectionState.clear();
  });

  let filterModalOpen = $state(false);
  let openFilterModal = () => (filterModalOpen = true);

  let editSubjectsTagsModalOpen = $state(false);
  let editSubjectsAndTags = () => (editSubjectsTagsModalOpen = true);

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

  let booksEditing = $derived(books.filter(b => selectionState.selectedBooksLookup[b.id]));
  const editBooksSubjectsTags = () => (booksSubjectsModalOpen = true);

  let booksModuleContext = {
    openFilterModal,
    editSubjectsAndTags,
    editBook,
    editBooksSubjectsTags,
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
            {#if !hasPublicId && searchState.value.activeFilterCount === 0}
              <Alert.Root class="mt-2">
                <TerminalIcon class="size-4" />
                <Alert.Title>Hi there!</Alert.Title>
                <Alert.Description>
                  It looks like there's nothing to show. Once you add some books to your library they'll show up here.
                </Alert.Description>
              </Alert.Root>
              <Alert.Root class="mt-2">
                <TriangleAlertIcon class="size-4" />
                <Alert.Title>Heads up!</Alert.Title>
                <Alert.Description>
                  There's been an update to this app's auth (and forcing a logout is apparently tricky) - you may need to logout, and log back in to
                  get all your books back.
                </Alert.Description>
              </Alert.Root>
            {:else}
              <Alert.Root class="self-start">
                <MessageCircleWarningIcon class="size-4" />
                <Alert.Title>Nothing here!</Alert.Title>
                <Alert.Description>No books found matching this search</Alert.Description>
              </Alert.Root>
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

          <SubjectsTagsEditModal {colors} {tags} {subjects} isOpen={editSubjectsTagsModalOpen} onHide={() => (editSubjectsTagsModalOpen = false)} />
        {/if}
      </div>
    </div>
  </div>
</section>
