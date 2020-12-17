<script context="module">
  const initialBooksState = { selectedBooks: {}, savingReadForBooks: {}, pendingDelete: {}, deleting: {} };
  const keysToHash = (_ids, value) => (Array.isArray(_ids) ? _ids : [_ids]).reduce((o, _id) => ((o[_id] = value), o), {});

  function booksUiStateReducer(state, [action, payload = null]) {
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
  import Modal from "app/components/ui/Modal.svelte";
  import { setContext } from "svelte";

  import useReducer from "util/useReducer";

  import GridView from "./bookViews/GridView.svelte";
  import BookSearchModal from "./BookSearchModal.svelte";
  import BooksMenuBar from "./BooksMenuBar.svelte";
  import { searchBooks } from "./booksState";
  import { getBookSearchUiView } from "./booksUiState";
  import SubjectEditModal from "./SubjectEditModal.svelte";
  import TagEditModal from "./TagEditModal.svelte";
  import TempDataTest from "./TempDataTest.svelte";

  let menuBarHeight = 0;
  const setMenuBarHeight = val => (menuBarHeight = val);

  const booksState = searchBooks();
  $: ({ books, booksLoaded, totalPages, resultsCount, currentQuery, reload, booksLoading } = $booksState);

  const uiView = getBookSearchUiView();

  let filterModalOpen = false;
  let openFilterModal = () => (filterModalOpen = true);

  let editSubjectsModalOpen = false;
  let editSubjects = () => (editSubjectsModalOpen = true);

  let editTagsModalOpen = false;
  let editTags = () => (editTagsModalOpen = true);

  const [booksUiState, dispatchBooksUiState] = useReducer(booksUiStateReducer, initialBooksState);

  let booksModuleContext = { openFilterModal, editSubjects, editTags, booksUiState, dispatchBooksUiState };
  setContext("books-module-context", booksModuleContext);
</script>

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

<section class="full flush-bottom">
  <BooksMenuBar {setMenuBarHeight} {uiView} bookResultsPacket={$booksState} />
  {#if booksLoaded && books != null}
    {#if $uiView.isGridView}
      <GridView {books} />
    {/if}
  {/if}

  {#if filterModalOpen}
    <BookSearchModal isOpen={filterModalOpen} onHide={() => (filterModalOpen = false)} />
  {/if}
  {#if editSubjectsModalOpen}
    <SubjectEditModal isOpen={editSubjectsModalOpen} onHide={() => (editSubjectsModalOpen = false)} />
  {/if}
  {#if editTagsModalOpen}
    <TagEditModal isOpen={editTagsModalOpen} onHide={() => (editTagsModalOpen = false)} />
  {/if}
</section>
