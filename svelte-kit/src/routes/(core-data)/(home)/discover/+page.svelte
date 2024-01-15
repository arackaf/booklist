<script lang="ts">
  import { ajaxUtil } from "$lib/util/ajaxUtil";

  import Alert from "$lib/components/Alert.svelte";
  import Button from "$lib/components/Button/Button.svelte";
  import ActionButton from "$lib/components/Button/ActionButton.svelte";

  import DisplayBook from "./DisplayBook.svelte";
  import DisplayRecommendation from "./DisplayRecommendation.svelte";
  import SearchModal from "./SearchModal.svelte";
  import type { Book } from "$data/types";

  export let data;

  $: ({ subjects: allSubjects, tags: allTags } = data);

  let selectedBooks: Book[] = [];
  let recommendationsLoading = false;
  let recommendationsLoaded = false;
  let recommendations: Book[] = [];

  let searchModalOpen = false;

  const selectBook = (book: Book) => (selectedBooks = selectedBooks.concat(book));
  const unselectBook = (book: Book) => (selectedBooks = selectedBooks.filter(b => b !== book));

  const closeModal = () => {
    searchModalOpen = false;
  };
  const openModal = () => (searchModalOpen = true);

  $: selectedBooksSet = new Set(selectedBooks.map(b => b.id));

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
      <div style="font-weight: bold">Find some books, and get recommendations based on what's similar</div>

      <div class="flex flex-row">
        <Button class="gap-2" on:click={openModal}>
          <i class="fal fa-search" />
          <span>Search your books</span>
        </Button>

        {#if selectedBooks.length}
          <ActionButton theme="primary" class="ml-auto" on:click={getRecommendations} running={recommendationsLoading}>
            Get Recommendations
          </ActionButton>
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
      <Alert type="warning">Nothing found</Alert>
    {/if}
  </div>
</div>
<SearchModal isOpen={searchModalOpen} onHide={closeModal} {allSubjects} {allTags} {selectedBooksSet} {selectBook} />
