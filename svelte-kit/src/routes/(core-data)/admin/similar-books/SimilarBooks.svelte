<script lang="ts">
  import { enhance } from "$app/forms";
  import type { BookWithSimilarItems, SimilarBook } from "$data/types";

  import Button from "$lib/components/ui/button/button.svelte";

  import SlideAnimate from "$lib/util/SlideAnimate.svelte";
  import { isbn13To10 } from "$lib/util/isbn13to10";

  import BookDisplay from "./BookDisplay.svelte";
  import { ChevronsDown, LoaderIcon } from "lucide-svelte";
  import { cn } from "$lib/utils";

  type Props = {
    book: BookWithSimilarItems;
  };

  let { book }: Props = $props();

  let hasSimilarBooks = $derived(Array.isArray(book.similarBooks) && book.similarBooks.length);
  let similarBooksCount = $derived(hasSimilarBooks ? book.similarBooks!.length : 0);

  let loading = $state(false);
  let expanded = $state(false);
  let similarBooks = $state<SimilarBook[]>([]);
  let isRunning = $state(false);

  let isbn10 = $derived(isbn13To10(book.isbn));

  async function expand() {
    if (expanded) {
      expanded = false;
    } else if (similarBooks.length) {
      expanded = true;
    } else {
      loading = true;
      const resultsResp = await fetch("/api/similar-books?id=" + book.id);
      const similarBooksFound = await resultsResp.json();

      similarBooks = similarBooksFound;
      expanded = true;
      loading = false;
    }
  }

  function attemptUpdate() {
    isRunning = true;
    return async ({ update }: any) => {
      update().then(() => {
        isRunning = false;
      });
    };
  }
</script>

{#if hasSimilarBooks}
  <Button class="self-start" variant="outline" disabled={loading} onclick={expand}>
    <span>
      {similarBooksCount} similar book{similarBooksCount === 1 ? "" : "s"}
    </span>
    {#if loading}
      <LoaderIcon class="animate-spin" />
    {:else}
      <ChevronsDown class={cn({ "rotate-180": expanded })} />
    {/if}
  </Button>

  <SlideAnimate open={expanded}>
    <div class="flex flex-col gap-3 mt-3 max-h-80 overflow-y-scroll">
      {#each similarBooks as book}
        <BookDisplay {book} />
      {/each}
    </div>
  </SlideAnimate>
{:else if isbn10}
  {#if book.similarBooksLastSyncDisplay}
    <div class="text-base">
      None found. Last attempt {book.similarBooksLastSyncDisplay}
    </div>

    <form method="POST" action="?/updateRecommended" use:enhance={attemptUpdate}>
      <input type="hidden" name="id" value={book.id} />
      <Button type="submit" disabled={isRunning} class="mt-3">Re-attempt</Button>
    </form>
  {:else}
    <span>Sync pending</span>
  {/if}
{/if}
