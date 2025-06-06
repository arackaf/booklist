<script lang="ts">
  import { onDestroy, onMount } from "svelte";
  import { fade } from "svelte/transition";
  import { BookCheckIcon, SearchIcon } from "lucide-svelte";

  import type { Book } from "$data/types";
  import { ajaxUtil } from "$lib/util/ajaxUtil";

  import Input from "$lib/components/ui/input/input.svelte";
  import Button from "$lib/components/ui/button/button.svelte";
  import EditBookModal from "$lib/components/editBook/EditBookModal.svelte";
  import BookRating from "$lib/components/BookRating.svelte";

  let { data } = $props();
  let { subjects: allSubjects, tags } = $derived(data);

  let editingBook = $state<Book | null>(null);
  let enteringBook = $state(false);
  let focused = $state(0);
  let inputEl = $state<HTMLInputElement | null>(null);

  onMount(() => {
    inputEl?.focus();
  });

  const defaultEmptyBook = () =>
    ({
      title: "",
      isbn: "",
      pages: "",
      publisher: "",
      publicationDate: "",
      authors: [""],
      tags: [],
      subjects: []
    }) as unknown as Book;

  const manuallyEnterBook = () => {
    editingBook = defaultEmptyBook();
    enteringBook = true;
  };

  const onFocus = () => {
    if (!focused) {
      onFocus();
    }
  };

  let isSearching = $state(false);
  let isbn = $state("");
  let isbnClean = $derived(isbn.trim());
  let canSearch = $derived(!isSearching && (isbnClean.length == 10 || isbnClean.length == 13));
  let scannedMessage = $state("");

  function entryFinished() {
    isbn = "";
  }

  let lastScannedTimeout = $state<any>(0);
  let mounted = true;
  onDestroy(() => {
    mounted = false;
  });

  const handleSearch = (evt: any) => {
    evt.preventDefault();

    if (!canSearch) {
      return;
    }

    const isbnCapture = isbnClean;
    entryFinished();

    clearTimeout(lastScannedTimeout);
    ajaxUtil.post("/api/scan-book", { isbn: isbnCapture }, () => {
      lastScannedTimeout = setTimeout(() => {
        if (mounted) {
          scannedMessage = "";
        }
      }, 1500);
    });
    scannedMessage = `${isbnCapture} queued for lookup!`;
  };
</script>

<section class="flush-bottom flex flex-col gap-8">
  <div class="pt-4">
    <div class="flex flex-col gap-4">
      <BookRating averageReview={3.5} numberReviews={10} />
      <BookRating averageReview={4.5} numberReviews={10} />
      <BookRating averageReview={5} numberReviews={10} />
      <h1 class="text-lg font-bold">Add Books</h1>

      <div class="flex items-start gap-3">
        <div class="flex flex-col gap-2 h-20">
          <form onsubmit={handleSearch} class="flex gap-2 w-full max-w-sm">
            <Input bind:ref={inputEl} type="text" placeholder="Enter or Scan ISBN..." bind:value={isbn} />
            <Button type="submit" disabled={!canSearch}>
              <SearchIcon class="h-4 w-4 mr-2" />
              Search
            </Button>
          </form>
          {#if scannedMessage}
            <p transition:fade class="text-sm text-muted-foreground">{scannedMessage}</p>
          {/if}
        </div>

        <Button onclick={manuallyEnterBook} variant="outline">Manual Entry</Button>
      </div>
      <a href="/recent-scans" class="inline-flex items-center text-sm hover:text-primary/80">
        <BookCheckIcon class="h-4 w-4 mr-2" />
        View recently looked up books here
      </a>
    </div>

    <EditBookModal
      isOpen={enteringBook}
      book={editingBook}
      subjects={allSubjects}
      {tags}
      onSave={() => (editingBook = defaultEmptyBook())}
      onHide={() => (enteringBook = false)}
      header={"Enter book"}
    />
  </div>
</section>
