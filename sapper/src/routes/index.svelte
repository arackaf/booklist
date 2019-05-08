<script>
  import BooksMenuBar from "./books/components/BooksMenuBar.svelte";
  import GridView from "./books/components/GridView.svelte";

  import getSearchState from "./books/util/searchState";
  import getGraphQLQuery from "../util/graphqlQuery";
  import delve from "dlv";

  const searchState = getSearchState();

  const results = getGraphQLQuery(
    `query getBooks($search:String){allBooks(title_contains:$search){Books{title,authors,smallImage}}}`,
    searchState
  );

  let books = [];
  $: books = delve(results, "data.allBooks.Books") || [];
</script>

<svelte:head>
  <title>Sapper project template</title>
</svelte:head>

<div style="marginLeft: 5px; marginTop: 0">
  <div style="flex: 1; padding: 0; minHeight: 450">
    <BooksMenuBar />

    <h1>{JSON.stringify(results)}</h1>
    {#if !books.length}
      <div
        class="alert alert-warning"
        style="marginTop: 20px; marginRight: 5px">
        No books found
      </div>
    {:else}
      <GridView {books} />
    {/if}
  </div>
</div>
