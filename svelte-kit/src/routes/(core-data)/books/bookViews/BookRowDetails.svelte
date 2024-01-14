<script lang="ts">
  import type { BookDetails } from "$data/types";

  import BookCover from "$lib/components/ui/BookCover.svelte";

  export let isPublic: boolean;
  export let bookDetails: BookDetails;

  $: ({ editorialReviews, similarBooks } = bookDetails || {});
</script>

{#if bookDetails}
  <tr>
    <td colSpan={isPublic ? 8 : 9} style="border-top: 0; padding-left: 50px; padding-top: 0; padding-bottom: 15px;">
      <div class="pt-3 pr-3 grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div>
          {#if !editorialReviews || !editorialReviews.length}
            <h4>No editorial reviews for this book</h4>
          {:else}
            <div class="max-h-80 overflow-y-scroll">
              {#each editorialReviews as review, index}
                <div>
                  {#if index > 0}
                    <hr style="border: 2px solid #eee" />
                  {/if}
                  <div class="flex flex-col">
                    <span class="text-base">{review.source || "<unknown source>"}</span>
                    <div>
                      {@html review.content}
                    </div>
                  </div>
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
            <div class="max-h-80 overflow-y-scroll">
              <div class="flex flex-col">
                <span class="text-base">Similar Books</span>
                <table class="table table-condensed w-full max-w-full text-sm" style="backgroundColor: transparent">
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
              </div>
            </div>
          {/if}
        </div>
      </div>
    </td>
  </tr>
{/if}
