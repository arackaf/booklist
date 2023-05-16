<script lang="ts">
  import type { BookDetails } from "$data/types";

  import Stack from "$lib/components/layout/Stack.svelte";
  import BookCover from "$lib/components/ui/BookCover.svelte";
  import { onMount } from "svelte";

  export let id: number;
  export let detailsLoading: boolean | undefined = true;

  export let isPublic: boolean;
  let bookDetails: BookDetails;

  $: ({ editorialReviews, similarBooks } = bookDetails || {});

  onMount(() => {
    fetch("/api/book-details?id=" + id)
      .then(resp => resp.json())
      .then(details => {
        bookDetails = details;
        detailsLoading = void 0;
      });
  });
</script>

{#if bookDetails}
  <tr>
    <td colSpan={isPublic ? 8 : 9} style="border-top: 0; padding-left: 50px; padding-top: 0; padding-bottom: 15px;">
      <div class="detailsRow grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
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

        <div>
          {#if !similarBooks || !similarBooks.length}
            <h4>No similar items found for this book</h4>
          {:else}
            <div>
              <Stack>
                <h4>Similar Books</h4>
                <table class="table table-condensed" style="backgroundColor: transparent">
                  <tbody>
                    {#each similarBooks as book}
                      <tr>
                        <td>
                          {#if book.smallImage}
                            <BookCover size="small" {book} />
                          {/if}
                        </td>
                        <td>
                          <span style="font-weight: bold">{book.title}</span>
                          <br />
                          {#if book.authors?.length}
                            <span style="font-style: italic">{book.authors.join(", ")}</span>
                            <br />
                          {/if}
                          <a target="_new" style="color: black" href={`https://www.amazon.com/gp/product/${book.isbn}/?tag=zoomiec-20`}>
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
      </div>
    </td>
  </tr>
{/if}

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
