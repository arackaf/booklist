<script context="module" lang="ts">
  const initialBooksState = { selectedBooks: {}, savingReadForBooks: {}, pendingDelete: {}, deleting: {} };
  const keysToHash = (_ids: string[], value: boolean) => (Array.isArray(_ids) ? _ids : [_ids]).reduce((o: any, _id) => ((o[_id] = value), o), {});

  function booksUiStateReducer(state: any, [action, payload = null]: [string, any]) {
    switch (action) {
      case "select":
        return { ...state, selectedBooks: { ...state.selectedBooks, ...keysToHash(payload, true) } };
      case "de-select":
        return { ...state, selectedBooks: { ...state.selectedBooks, ...keysToHash(payload, false) } };
      case "toggle-select":
        return { ...state, selectedBooks: { ...state.selectedBooks, [payload]: !state.selectedBooks[payload] } };
      case "start-delete":
        return { ...state, pendingDelete: { ...state.pendingDelete, ...keysToHash(payload, true) } };
      case "cancel-delete":
        return { ...state, pendingDelete: { ...state.pendingDelete, ...keysToHash(payload, false) } };
      case "delete":
        return { ...state, deleting: { ...state.deleting, [payload]: true } };
      case "reset":
        return { ...initialBooksState };
      default:
        throw "Invalid key";
    }
  }
</script>

<script lang="ts">
  import { onMount, setContext } from "svelte";
  import { page } from "$app/stores";

  import useReducer from "$lib/state/useReducer";
  import { writable, type Writable } from "svelte/store";
  import ModuleLoading from "$lib/components/navigation/ModuleLoading.svelte";

  import GridView from "./bookViews/GridView.svelte";
  // import BasicView from './bookViews/BasicView.svelte';
  import CoversView from "./bookViews/CoversView.svelte";

  import BookSearchModal from "./SearchModal.svelte";
  import BooksMenuBar from "./menuBar/MenuBar.svelte";
  // import { searchBooks } from './booksState';

  import SubjectEditModal from "./SubjectEditModal.svelte";
  import TagEditModal from "./TagEditModal.svelte";
  import EditBookModal from "$lib/components/editBook/EditBookModal.svelte";
  import BookSubjectSetter from "./BookSubjectSetter.svelte";
  import BookTagSetter from "./BookTagSetter.svelte";
  // import ModuleLoading from 'app/components/navigation/ModuleLoading.svelte';

  //TODO: TEMP
  import { searchState } from "./state/searchState";
  import DisplaySelectedTags from "$lib/components/subjectsAndTags/tags/DisplaySelectedTags.svelte";
  import DisplaySelectedSubjects from "$lib/components/subjectsAndTags/subjects/DisplaySelectedSubjects.svelte";
  import { runUpdate, type UpdatesTo } from "$lib/state/dataUpdates";
  import type { Book } from "$data/types";
  import { selectedBooksLookup, selectionState } from "./state/selectionState";

  import type { PageData } from "./$types";
  import { BASIC_LIST_VIEW, GRID_VIEW } from "./bookViews/constants";

  export let data: PageData;

  $: ({ colors, subjects, defaultBookView, tags, showMobile } = data);
  let bookViewOverride: string | null = null;
  const overrideBookView = (newBookView: string) => (bookViewOverride = newBookView);

  $: bookViewToUse = bookViewOverride || defaultBookView;

  onMount(() => {
    const div = document.createElement("div");
    document.body.appendChild(div);

    setTimeout(() => {
      div.appendChild(document.createElement("div"));
    }, 2000);

    selectionState.clear();
  });

  const prepBookForSaving = (book: any) => {
    let propsToUpdate = ["title", "isbn", "smallImage", "pages", "publisher", "publicationDate", "authors", "subjects", "tags"];
    let pages = parseInt(book.pages, 10);
    book.pages = isNaN(pages) ? void 0 : pages;

    return propsToUpdate.reduce((obj, prop) => ((obj[prop] = book[prop]), obj), {} as any);
  };

  const booksState = writable({
    books: [],
    booksLoaded: false,
    totalPages: 0,
    resultsCount: 0,
    currentQuery: "",
    reload: () => {},
    booksLoading: false
  });
  $: ({ /*books,*/ booksLoaded, totalPages, resultsCount, currentQuery, reload, booksLoading } = $booksState);

  $: books = $page.data.books as Writable<Book[]>;

  $: allSubjects = $page.data.subjects;

  let filterModalOpen = false;
  let openFilterModal = () => (filterModalOpen = true);

  let editSubjectsModalOpen = false;
  let editSubjects = () => (editSubjectsModalOpen = true);

  let editTagsModalOpen = false;
  let editTags = () => (editTagsModalOpen = true);

  const [booksUiState, dispatchBooksUiState] = useReducer(booksUiStateReducer, initialBooksState);

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
    booksUiState,
    dispatchBooksUiState,
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

{#if booksLoading}
  <ModuleLoading />
{/if}

<section class="full flush-bottom">
  <div style="background-color: white;">
    <BooksMenuBar />

    <div>
      <div class="overlay-holder" style="flex: 1; padding: 0px; grid-template-columns: 100%">
        {#if !$books.length}
          <div>
            <div class="alert alert-warning" style="margin-top: 20px">No books found</div>
          </div>
        {:else}
          <div>
            {#if bookViewToUse == BASIC_LIST_VIEW}
              <h1>MOBILE</h1>
            {:else if bookViewToUse === GRID_VIEW}
              <GridView books={$books} subjects={allSubjects} {tags} />
            {:else}
              <CoversView books={$books} />
            {/if}

            <!-- {:else if $uiView.view == BASIC_LIST_VIEW}
								<BasicView {booksState} />
							{:else if $uiView.view == COVERS_LIST}
								<CoversView {booksState} />
							{/if} -->
          </div>
        {/if}

        <BookSearchModal isOpen={filterModalOpen} onHide={() => (filterModalOpen = false)} {tags} {allSubjects} />

        <EditBookModal
          isOpen={editBookModalOpen}
          book={editingBook}
          onBookUpdated={onBooksUpdated}
          onHide={stopEditingBook}
          subjects={allSubjects}
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
