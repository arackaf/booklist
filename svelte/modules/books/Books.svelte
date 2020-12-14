<script lang="ts">
  import BooksMenuBar from "./BooksMenuBar.svelte";
  import { searchBooks } from "./booksState";

  import TempDataTest from "./TempDataTest.svelte";

  let menuBarHeight = 0;
  const setMenuBarHeight = val => (menuBarHeight = val);

  const booksState = searchBooks();
  $: ({ books, totalPages, resultsCount, currentQuery, reload } = $booksState);
</script>

<section class="full flush-bottom">
  <BooksMenuBar {setMenuBarHeight} bookResultsPacket={{ books, totalPages, resultsCount, reload }} />
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
