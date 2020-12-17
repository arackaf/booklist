<script lang="ts">
  import Modal from "app/components/ui/Modal.svelte";
  import { setContext } from "svelte";
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
  $: ({ books, totalPages, resultsCount, currentQuery, reload, booksLoading } = $booksState);

  const uiView = getBookSearchUiView();

  let filterModalOpen = false;
  let openFilterModal = () => (filterModalOpen = true);

  let editSubjectsModalOpen = false;
  let editSubjects = () => (editSubjectsModalOpen = true);

  let editTagsModalOpen = false;
  let editTags = () => (editTagsModalOpen = true);

  let booksModuleContext = { openFilterModal, editSubjects, editTags };
  setContext("books-module-context", booksModuleContext);
</script>

<section class="full flush-bottom">
  <BooksMenuBar {setMenuBarHeight} {uiView} bookResultsPacket={$booksState} />
  <br />
  <br />
  <br />
  <br />
  <hr />
  {menuBarHeight}
  <hr />

  <br />
  <br />
  <br />
  <br />

  {#if filterModalOpen}
    <BookSearchModal isOpen={filterModalOpen} onHide={() => (filterModalOpen = false)} />
  {/if}
  {#if editSubjectsModalOpen}
    <SubjectEditModal isOpen={editSubjectsModalOpen} onHide={() => (editSubjectsModalOpen = false)} />
  {/if}
  {#if editTagsModalOpen}
    <TagEditModal isOpen={editTagsModalOpen} onHide={() => (editTagsModalOpen = false)} />
  {/if}
  <TempDataTest />
</section>
