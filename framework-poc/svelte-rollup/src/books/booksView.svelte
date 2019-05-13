<script>
  import getGraphQLQuery from "./graphqlQuery";
  import bookSearchState from "./searchState";

  import Grid from "./grid.svelte";

  const results = getGraphQLQuery(
    `query getBooks($search:String){allBooks(title_contains:$search){Books{title,authors,smallImage}}}`,
    bookSearchState
  );

  $: books =
    ($results.data && $results.data.allBooks && $results.data.allBooks.Books) ||
    [];
</script>

<Grid {books} />
