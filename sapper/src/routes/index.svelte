<script>
  import BooksMenuBar from "./books/components/BooksMenuBar.svelte";
  import GridView from "./books/components/GridView.svelte";
</script>

<svelte:head>
  <title>Sapper project template</title>
</svelte:head>

<div style="marginLeft: 5px; marginTop: 0">
  <div style="flex: 1; padding: 0; minHeight: 450">
    <BooksMenuBar />

    <div
      class="alert alert-warning"
      style="display: none; marginTop: 20px; marginRight: 5px">
      No books found
    </div>

    <GridView />
  </div>
</div>
