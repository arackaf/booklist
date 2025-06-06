<script lang="ts">
  import { MessageCircleWarningIcon, SearchIcon } from "lucide-svelte";

  import type { Book } from "$data/types";

  import { ajaxUtil } from "$lib/util/ajaxUtil";

  import * as Alert from "$lib/components/ui/alert";
  import Button from "$lib/components/ui/button/button.svelte";

  import DisplayBook from "./DisplayBook.svelte";
  import DisplayRecommendation from "./DisplayRecommendation.svelte";
  import SearchModal from "./SearchModal.svelte";

  type Props = {
    data: {
      subjects: any[];
      tags: any[];
    };
  };

  let { data }: Props = $props();

  let { subjects: allSubjects, tags: allTags } = $derived(data);

  let selectedBooks = $state<Book[]>([]);
  let recommendationsLoading = $state(false);
  let recommendationsLoaded = $state(false);
  let recommendations = $state<Book[]>([]);

  let searchModalOpen = $state(false);

  const selectBook = (book: Book) => (selectedBooks = [...selectedBooks, book]);
  const unselectBook = (book: Book) => (selectedBooks = selectedBooks.filter(b => b !== book));

  const closeModal = () => {
    searchModalOpen = false;
  };
  const openModal = () => (searchModalOpen = true);

  let selectedBooksSet = $derived(new Set(selectedBooks.map(b => b.id)));

  const getRecommendations = async () => {
    recommendationsLoading = true;

    const result = await ajaxUtil.post("/api/get-recommendations", { bookIds: [...selectedBooksSet] });
    recommendations = result?.results ?? [];
    recommendationsLoading = false;
    recommendationsLoaded = true;
  };
</script>

<div class="flex flex-row gap-3">
  <div class="basis-1/2 min-w-0">
    <div class="flex flex-col gap-5">
      <div style="font-weight: bold">Search your books, and get recommendations based on what's similar</div>

      <div class="flex flex-row">
        <Button class="gap-2" onclick={openModal}>
          <SearchIcon />
          <span>Search your books</span>
        </Button>

        {#if selectedBooks.length}
          <Button variant="secondary" class="ml-auto" onclick={getRecommendations} disabled={recommendationsLoading}>Get Recommendations</Button>
        {/if}
      </div>

      <div>
        {#each selectedBooks as book (book.id)}
          <DisplayBook {book} {unselectBook} />
        {/each}
      </div>
    </div>
  </div>
  <div class="basis-1/2 min-w-0">
    {#if recommendations.length}
      <div>
        <div style="font-weight: bold; margin-bottom: 5px">Similar books found</div>

        <div class="flex flex-col gap-2">
          {#each recommendations as book (book.id)}
            <DisplayRecommendation {book} />
          {/each}
        </div>
      </div>
    {:else if recommendationsLoaded}
      <Alert.Root>
        <MessageCircleWarningIcon class="size-4" />
        <Alert.Title>Nothing found</Alert.Title>
        <Alert.Description>No similar books found for what you selected</Alert.Description>
      </Alert.Root>
    {/if}
  </div>
</div>
<SearchModal isOpen={searchModalOpen} onHide={closeModal} {allSubjects} {allTags} {selectedBooksSet} {selectBook} />
