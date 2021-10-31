<script lang="ts">
  import { query } from "micro-graphql-svelte";
  import { BookSummary, EditorialReview, Queries, QueryOf } from "graphql-typings";

  import BookDetailsQuery from "graphQL/books/getBookDetails.graphql";

  import CoverSmall from "app/components/bookCovers/CoverSmall.svelte";
  import FlexRow from "app/components/layout/FlexRow.svelte";
  import Stack from "app/components/layout/Stack.svelte";

  import { appState } from "app/state/appState";
  import { IBookDisplay } from "../booksState";

  export let book: IBookDisplay;
  export let detailsLoading = false;

  let { isPublic: viewingPublic, publicUserId } = $appState;
  let { queryState } = query<QueryOf<Queries["getBook"]>>(BookDetailsQuery, { initialSearch: { _id: book._id, publicUserId, cache: 9 } });

  $: ({ loading, data, loaded } = $queryState);

  $: console.log($queryState);
  $: detailsLoading = loading;

  $: ({ editorialReviews, similarBooks } = data?.getBook?.Book ?? ({} as { editorialReviews: EditorialReview[]; similarBooks: BookSummary[] }));
</script>

<style>
  :global(.detailsRow) {
    padding-right: 10px;
  }
  :global(.detailsRow) {
    padding-top: 10px;
  }
  :global(.detailsRow > * > div) {
    max-height: 250px;
    overflow: auto;
  }
</style>

{#if loaded}
  <tr>
    <td colSpan={viewingPublic ? 8 : 9} style="border-top: 0; padding-left: 50px; padding-top: 0; padding-bottom: 15px;">
      <FlexRow class="detailsRow">
        <div class="col-xs-6">
          {#if !editorialReviews || !editorialReviews.length}
            <h4>No editorial reviews for this book</h4>
          {:else}
            <div>
              {#each editorialReviews as review, index}
                <div>
                  {#if index > 0}
                    <hr style="border: 2px solid #eee" />
                  {/if}
                  <Stack>
                    <h4>{review.source || "<unknown source>"}</h4>
                    <div>
                      {@html review.content}
                    </div>
                  </Stack>
                </div>
              {/each}
              <br />
            </div>
          {/if}
        </div>

        <div class="col-xs-6">
          {#if !similarBooks || !similarBooks.length}
            <h4>No similar items found for this book</h4>
          {:else}
            <div>
              <Stack>
                <h4>Similar Books</h4>
                <table class="table table-condensed" style="backgroundColor: transparent">
                  <tbody>
                    {#each similarBooks as book, i}
                      <tr>
                        <td>
                          {#if book.smallImage}
                            <CoverSmall url={book.smallImage} />
                          {/if}
                        </td>
                        <td>
                          <span style="font-weight: bold">{book.title}</span>
                          <br />
                          {#if book.authors.length}<span style="font-style: italic">{book.authors.join(", ")}</span> <br />{/if}
                          <a target="_new" style="color: black" href={`https://www.amazon.com/gp/product/${book.asin}/?tag=zoomiec-20`}>
                            <i class="fab fa-amazon" />
                          </a>
                        </td>
                      </tr>
                    {/each}
                  </tbody>
                </table>
              </Stack>
            </div>
          {/if}
        </div>
      </FlexRow>
    </td>
  </tr>
{/if}
