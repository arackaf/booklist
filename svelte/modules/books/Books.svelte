<script lang="ts">
  import Modal from "app/components/ui/Modal.svelte";
  import { setContext } from "svelte";
  import BooksMenuBar from "./BooksMenuBar.svelte";
  import { searchBooks } from "./booksState";
  import { getBookSearchUiView } from "./booksUiState";

  import TempDataTest from "./TempDataTest.svelte";

  let menuBarHeight = 0;
  const setMenuBarHeight = val => (menuBarHeight = val);

  const booksState = searchBooks();
  $: ({ books, totalPages, resultsCount, currentQuery, reload, booksLoading } = $booksState);

  const uiView = getBookSearchUiView();

  let filterModalOpen = false;
  let openFilterModal = () => (filterModalOpen = true);

  let booksModuleContext = { openFilterModal };
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
    <Modal headerCaption="Full Search" isOpen={filterModalOpen} deferStateChangeOnClose={true} onHide={() => (filterModalOpen = false)}>
      <h1>Ayyyyy</h1>
    </Modal>
  {/if}
  <TempDataTest />
</section>
