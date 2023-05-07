<script lang="ts">
  import FlexRow from "$lib/components/layout/FlexRow.svelte";
  import FlowItems from "$lib/components/layout/FlowItems.svelte";
  import Stack from "$lib/components/layout/Stack.svelte";

  import { ajaxUtil } from "$lib/util/ajaxUtil";

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

<div class="margin-top">
  <FlexRow>
    <div class="col-xs-6">
      <Stack loosest={true}>
        <div style="font-weight: bold">Find some books, and get recommendations based on what's similar</div>

        <FlowItems pushLast={true}>
          <button class="btn btn-default" on:click={openModal}>
            <i class="fal fa-search" />
            <span>Search your books</span>
          </button>

          {#if selectedBooks.length}
            <button on:click={getRecommendations} disabled={recommendationsLoading} style="margin-left: auto" class="btn btn-primary">
              {#if recommendationsLoading}<i class="far fa-fw fa-spin fa-spinner" />{/if}
              Get Recommendations
            </button>
          {/if}
        </FlowItems>

        <div>
          {#each selectedBooks as book (book.id)}
            <DisplayBook {book} {unselectBook} />
          {/each}
        </div>
      </Stack>
    </div>
    <div class="col-xs-6">
      {#if recommendations.length}
        <div>
          <div style="font-weight: bold; margin-bottom: 5px">Similar books found</div>
          <table class="table table-condensed table-striped">
            <tbody>
              {#each recommendations as book (book.id)}
                <DisplayRecommendation {book} />
              {/each}
            </tbody>
          </table>
        </div>
      {:else if recommendationsLoaded}
        <div class="alert alert-warning">Nothing found</div>
      {/if}
    </div>
  </FlexRow>
  <SearchModal isOpen={searchModalOpen} onHide={closeModal} {allSubjects} {allTags} {selectedBooksSet} {selectBook} />
</div>
