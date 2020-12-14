<script lang="ts">
  import BooksMenuBar from "./BooksMenuBar.svelte";
  import { searchBooks } from "./booksState";
import { getBookSearchUiView } from "./booksUiState";

  import TempDataTest from "./TempDataTest.svelte";

  let menuBarHeight = 0;
  const setMenuBarHeight = val => (menuBarHeight = val);

  const booksState = searchBooks();
  $: ({ books, totalPages, resultsCount, currentQuery, reload, booksLoading } = $booksState);

  const uiView = getBookSearchUiView();
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
  <TempDataTest />
</section>
